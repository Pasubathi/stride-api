import Cors from 'cors';
import moment from 'moment';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
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
            const { stage, lender_sfid, time_range, date_from, date_to } = req.body;
            if (lender_sfid == "" || lender_sfid == undefined)
                return res.status(200).send({ status:"error", message: "Id is mandatory" })
            if (stage == "" || stage == undefined)
                return res.status(200).send({ status:"error", message: "Search is mandatory" })
            if (time_range == "" || time_range == undefined)
                return res.status(200).send({ status:"error", message: "Time Range is mandatory" })

            const userSfid   = String(lender_sfid);
            const recordDet  = await prisma.recordtype.findFirst({
                where: {
                    name: "Transaction Application",
                },
            });
            let obj = {
                NOT: [{ sfid: null }],
                recordtypeid: String(recordDet.sfid),
                lender_name__c: userSfid
            }
            let countObj = obj;
            if(stage && Array.isArray(stage) && stage.length > 0 &&  stage[0] !=='All Leads')
            {
                obj.stagename = { in: stage };
            }
            if(time_range =="Today")
            {
                let lastDay = moment().subtract(1, 'day');
                lastDay = new Date(lastDay).toISOString();
                obj.createddate = {
                    gte: lastDay,
                };
            }else if(time_range =="Last 7 days")
            {
                let lastDay = moment().subtract(7, 'day');
                lastDay = new Date(lastDay).toISOString();
                obj.createddate = {
                    gte: lastDay,
                };
            }else if(time_range =="Last 30 days")
            {
                let dateFrom = new Date();
                let lastMonthDay = moment(dateFrom).subtract(1,'months').endOf('month');
                lastMonthDay = new Date(lastMonthDay).toISOString();
                obj.createddate = {
                    gte: lastMonthDay,
                };
            }else if(time_range =="Last quarter")
            {
                let dateFrom = new Date();
                var futureMonth = moment(dateFrom).subtract(3, 'M');
                var futureMonthEnd = moment(futureMonth).endOf('month');
                futureMonthEnd = new Date(futureMonthEnd).toISOString();
                obj.createddate = {
                    gte: futureMonthEnd,
                };
            }else if(time_range =="Last Year")
            {
                let dateFrom = new Date();
                var futureMonth = moment(dateFrom).subtract(12, 'M');
                var futureMonthEnd = moment(futureMonth).endOf('month');
                futureMonthEnd = new Date(futureMonthEnd).toISOString();
                obj.createddate = {
                    gte: futureMonthEnd,
                };
            }
            else if(time_range =="Custom Date")
            {
                let fromDate = new Date(date_from).toISOString();
                let toDate   = new Date(date_to).toISOString();
                obj.createddate = {
                    gte: fromDate,
                    lte: toDate
                };
            }
            const leadDet = await prisma.opportunity.findMany({
                where: obj,
                orderBy: {
                  id: 'desc',
                }
            });

            if(leadDet){
                let proData = [];
                await Promise.all(leadDet.map(async (element, index) => {
                    let rowDet = {
                        opp_id: element.sfid,
                        created_at: await getDate(element.createddate),
                        status: element.stagename,
                        amount : element.amount
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
                return res.status(200).json({status:"success", message:'Success', data: proData})
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