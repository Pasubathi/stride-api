
import Cors from 'cors';
import moment from 'moment';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getLenderLeadsCase(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getLenderLeads();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getLenderLeads() {
        try {
            const { stage, lender_sfid, oppertunity_id, case_type} = req.body;
            if (lender_sfid == "" || lender_sfid == undefined)
                return res.status(200).send({ status:"error", message: "Id is mandatory" })
            if (oppertunity_id == "" || oppertunity_id == undefined)
                return res.status(200).send({ status:"error", message: "Lead id is mandatory" })
            if (case_type == "" || case_type == undefined)
                return res.status(200).send({ status:"error", message: "Case Type is mandatory" })
            const recordDet  = await prisma.recordtype.findFirst({
                where: {
                    name: "Transaction Application",
                },
            });
            let obj = {
                NOT: [{ sfid: null }],
                recordtypeid: String(recordDet.sfid),
                lender_name__c: userSfid,
            }
            if(case_type =="next")
            {
                obj.id = {
                    gt: Number(oppertunity_id),
                  }
            }else{
                obj.id = {
                    lt: Number(oppertunity_id),
                }
            }
            if(stage)
            {
                obj.stagename = String(stage);
            }
            const leadDet = await prisma.opportunity.findFirst({
                where: obj,
                orderBy: {
                  id: 'desc',
                }
            });

            if(leadDet){
                const opp_id    = leadDet.id;
                const user_sfid = leadDet && leadDet.accountid?leadDet.accountid:null;
                const plan_id   = leadDet && leadDet.payment_plan__c?leadDet.payment_plan__c:null;
                let prevObj = obj;
                let nextObj = obj;
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
                        const getStatementCount = await prisma.contentversion.count({
                            where:{
                                firstpublishlocationid: user_sfid,
                                document_type__c: "Bank Statement"
                            }
                        });
                        prevObj.id = {
                            lt: Number(opp_id),
                        }
                        const prevDet = await prisma.opportunity.findFirst({
                            where: prevObj,
                            orderBy: {
                              id: 'desc',
                            }
                        });
                        nextObj.id = {
                            gt: Number(opp_id),
                          }
                        const nextDet = await prisma.opportunity.findFirst({
                            where: nextObj,
                            orderBy: {
                              id: 'desc',
                            }
                        });
                        rowData.current_address = addressDet;
                        rowData.plan            = planDet;
                        rowData.bank_statement  = getStatementCount;
                        rowData.nextDet         = nextDet && nextDet.id?true:false;
                        rowData.prevDet         = prevDet && prevDet.id?true:false;
                        rowData.opp_id          = opp_id;
                        return res.status(200).json({status:"success", message:'Success', data: rowData})
                    }else{
                        return res.status(400).json({ status:"error", message: "Account not found" })
                    }
                }else{
                    return res.status(400).json({ status:"error", message: "Account not found" })
                }
            } else {
                return res.status(400).json({ status:"error", message: "Detail is not updated" })
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

