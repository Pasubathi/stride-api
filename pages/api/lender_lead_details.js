
import Cors from 'cors';
import moment from 'moment';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getLenderLeads(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getLenderLeads();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getLenderLeads() {
        try {
            const { opportunity_sfid, current_status } = req.body;
            if (opportunity_sfid == "" || opportunity_sfid == undefined)
                return res.status(200).send({ status:"error", message: "Id is mandatory" })
                const oppId   = String(opportunity_sfid);
                const leadDet = await prisma.opportunity.findFirst({
                    where: {
                        sfid: oppId
                    }
                });

            if(leadDet){
                const opp_id      = leadDet.id;
                const opp_sfid    = leadDet.sfid;
                const user_sfid   = leadDet && leadDet.accountid?leadDet.accountid:null;
                const plan_id     = leadDet && leadDet.payment_plan__c?leadDet.payment_plan__c:null;
                const merchantDet = leadDet && leadDet.merchant_product__c?leadDet.merchant_product__c:null;
                let nextObj   = {
                    recordtypeid: leadDet.recordtypeid,
                    lender_name__c: leadDet.lender_name__c,
                    id: {
                        lt: Number(opp_id),
                      }
                }
                let prevObj   = {
                    recordtypeid: leadDet.recordtypeid,
                    lender_name__c: leadDet.lender_name__c,
                    id: {
                        gt: Number(opp_id),
                      }
                }
                if(current_status !=='all')
                {
                    if(leadDet.stagename && leadDet.stagename !==undefined)
                    {
                        nextObj.stagename = leadDet.stagename;
                        prevObj.stagename = leadDet.stagename;
                    }
                }
                if(user_sfid)
                {
                    const accountDet = await prisma.account.findFirst({
                        where: {
                            sfid: user_sfid
                        }
                    });
                    if(accountDet)
                    {
                        let rowData = accountDet;
                        let addressDet = '';
                        let planDet = '';
                        let productDet;
                        const address_id = accountDet && accountDet.current_address_id__c?Number(accountDet.current_address_id__c):null;
                        if(address_id)
                        {
                           addressDet = await prisma.address__c.findFirst({
                                where: {
                                    id: address_id
                                }
                            });
                        }
                        if(plan_id)
                        {
                            planDet = await prisma.payment_plan__c.findFirst({
                                where: {
                                    sfid: plan_id
                                }
                            });
                        }
                        if(merchantDet)
                        {
                            const merchantProDet  = await prisma.merchant_product__c.findFirst({
                                where: {
                                    sfid: merchantDet
                                },
                                include:{
                                    product2: true
                                }
                            });
                            productDet = merchantProDet && merchantProDet.product2?merchantProDet.product2:null;
                        }
                        const breauDet = await prisma.bureau_response__c.findFirst({
                            where: {
                                account__c: user_sfid
                            }
                        });
                        const getStatementCount = await prisma.contentversion.count({
                            where:{
                                firstpublishlocationid: user_sfid,
                                document_type__c: "Bank Statement"
                            }
                        });
                        const prevDet = await prisma.opportunity.findFirst({
                            where: prevObj,
                            orderBy: {
                              id: 'desc',
                            }
                        });
                        const nextDet = await prisma.opportunity.findFirst({
                            where: nextObj,
                            orderBy: {
                              id: 'desc',
                            }
                        });
                        console.log("opp_id ------------->",opp_id);
                        console.log("prev Obj",prevObj);
                        console.log("next Obj",nextObj);
                        console.log("prevDet",prevDet);
                        console.log("nextDet",nextDet);
                        if(prevDet && prevDet !==null)
                        {
                            rowData.prevDet = prevDet && prevDet.sfid?prevDet.sfid:'';
                        }
                        if(nextDet && nextDet !==null)
                        {
                            rowData.nextDet  = nextDet && nextDet.sfid?nextDet.sfid:'';
                        }
                        rowData.current_address = addressDet;
                        rowData.plan            = planDet;
                        rowData.product_details = productDet;
                        rowData.bank_statement  = getStatementCount;
                        rowData.prevData        = prevObj;
                        rowData.nextData        = nextObj;
                        rowData.bureau_score    = breauDet && breauDet.bureau_score__c?breauDet.bureau_score__c:0,
                        rowData.opp_id          = opp_id;
                        rowData.opp_sfid        = opp_sfid;
                        return res.status(200).json({status:"success", message:'Success', data: rowData})
                    }else{
                        return res.status(400).json({ status:"error", message: "Account not found" })
                    }
                }else{
                    return res.status(400).json({ status:"error", message: "Account not found" })
                }
            } else {
               
            }
        } catch (error) {
            res.status(400).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

async function getDate(data){
    return new Promise(async (resolve, reject) =>{
        if(data)
        {
            let date = await moment(data).format('DD/MM/YYYY');
            resolve(date);
        }else{
            resolve('');
        }
    })
}
