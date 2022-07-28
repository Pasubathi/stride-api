import Cors from 'cors';
import moment from 'moment';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getMyLeads(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return getMyLeads();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getMyLeads() {
        try {
            const { sfid, stage } = req.query;
            if (sfid == "" || sfid == undefined)
             return res.status(500).send({ responseCode:500,message: "ID is mandatory" })
            const query = req.query;
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const merchant_id = String(sfid);
            const recordDet = await prisma.recordtype.findFirst({
                where: {
                    name: "Transaction Application",
                },
            });
            let conObj = {
                NOT: [{ sfid: null }],
                merchant_name__c: merchant_id,
                recordtypeid: String(recordDet.sfid)
            }
            if(stage && stage !==undefined && stage =="Pre Approval")
            {
                conObj.stagename = 'Pre-Approval FI Pending';
            }else if(stage && stage !==undefined && stage =="Post Approval")
            {
                conObj.stagename = 'Post Approval Deviation Pending';
            }else if(stage && stage !==undefined && stage =="Whitelisting Request")
            {
                conObj.is_whitelisted__c = true;
            }
            const leadDet = await prisma.opportunity.findMany({
                skip: startIndex,
                take: limit,
                where: conObj,
                orderBy: {
                  id: 'desc',
                }
            });

            if(leadDet){
                let proData = [];
                await Promise.all(leadDet.map(async element => {
                    let rowDet = {
                        opp_id: element.sfid, 
                        created_at: await getDate(element.createddate),
                        status: element.stagename
                    };
                    const getProData = await prisma.account.findFirst({
                        where:{
                            sfid: element.accountid
                        }
                    });
                    if(getProData)
                    {
                        rowDet.name = `${getProData.first_name__c}  ${getProData.last_name__c}`;
                        rowDet.mobile = getProData.phone;
                        rowDet.id = getProData.id;
                        rowDet.sfid = getProData.sfid;
                    }
                    const merchatProDet = await prisma.merchant_product__c.findFirst({
                        where:{
                            sfid: element.merchant_product__c
                        },
                        include: {
                            product2: true
                        }
                    });
                    if(merchatProDet)
                    {
                        const productDet = merchatProDet && merchatProDet.product2?merchatProDet.product2:null;
                        rowDet.product_name  = productDet?productDet.name:'';
                        rowDet.product_price = productDet?productDet.price__c:'';
                        rowDet.product_mrp   = productDet?productDet.mrp__c:'';
                    }
                    proData.push(rowDet);
                }));
                return res.status(200).json(proData)
            } else {
                return res.status(400).json({ responseCode: 400, message: "Detail is not updated" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
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

