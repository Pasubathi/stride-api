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
            const { stage, lender_sfid, search } = req.body;
            if (lender_sfid == "" || lender_sfid == undefined)
                return res.status(200).send({ status:"error", message: "Id is mandatory" })
            if (search == "" || search == undefined)
                return res.status(200).send({ status:"error", message: "Search is mandatory" })
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
            if(stage)
            {
                obj.stagename = String(stage);
            }
            const leadDet = await prisma.opportunity.findMany({
                where: obj,
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
                let contDet;
                if(stage == "" || stage == undefined)
                {
                    const approvalDet   = await approvalPending(countObj)
                    const disbursalDet  = await disbursalPending(countObj)
                    const disbursalData = await disbursedData(countObj)
                    const closedDet     = await closedLoan(countObj)
                    contDet = {approval: approvalDet, disbursal_pending: disbursalDet, disbursal: disbursalData, closed: closedDet};
                }else if(stage == "Approval Pending")
                {
                    const approvalDet   = await approvalPending(countObj)
                    contDet = {approval: approvalDet}
                }else if(stage == "Ready to disburse")
                {
                    const disbursalDet  = await disbursalPending(countObj)
                    contDet = {disbursal_pending: disbursalDet}
                }else if(stage == "Loan Declined")
                {
                    const declineData  = await declinedDet(countObj)
                    contDet = {declined: declineData}
                }else if(stage == "Closed")
                {
                    const closedDet     = await closedLoan(countObj)
                    contDet = {closed: closedDet}
                }else if(stage == "Dropped")
                {
                    const closedDet     = await droppedLoan(countObj)
                    contDet = {dropped: closedDet}
                }else if(stage == "Loan Disbursed")
                {
                    const disbursalData     = await disbursedData(countObj)
                    contDet = {disbursal: disbursalData}
                }
                return res.status(200).json({status:"success", message:'Success', data: proData, contDet: contDet})
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

async function approvalPending(conObj){
    return new Promise(async (resolve, reject) =>{
        try{
            conObj.stagename = 'Approval Pending';
            const approvalDet = await prisma.opportunity.groupBy({
                by: ['stagename'],
                where: conObj,
                _count:{
                    id: true
                },
                _sum: {
                    amount: true,
                },
            });
            console.log("Aproved approvalDet --------->", approvalDet);
            const row      = approvalDet && approvalDet.length > 0?approvalDet[0]:null;
            const countDet = row && row._count?row._count.id:0;
            const sumDet   = row && row._sum?row._sum.amount:0;
            const obj      = { total: countDet, amount: sumDet };
            resolve(obj);
        }catch (error) {
            reject(error.message ? error.message : error);
        }
    })
}

async function disbursalPending(conObj){
    return new Promise(async (resolve, reject) =>{
        try{
            conObj.stagename = 'Ready to disburse';
            const disbursalDet = await prisma.opportunity.groupBy({
                by: ['stagename'],
                where: conObj,
                _count:{
                    id: true
                },
                _sum: {
                    amount: true,
                },
            });
            console.log("Disbursal disbursalDet --------->", disbursalDet);
            const row      = disbursalDet && disbursalDet.length > 0?disbursalDet[0]:null;
            const countDet = row && row._count?row._count.id:0;
            const sumDet   = row && row._sum?row._sum.amount:0;
            const obj      = { total: countDet, amount: sumDet };
            resolve(obj);
        }catch (error) {
            reject(error.message ? error.message : error);
        }
    })
}

async function declinedDet(conObj){
    return new Promise(async (resolve, reject) =>{
        try{
            conObj.stagename = 'Loan Declined';
            const declinedDet = await prisma.opportunity.groupBy({
                by: ['stagename'],
                where: conObj,
                _count:{
                    id: true
                },
                _sum: {
                    amount: true,
                },
            });
            console.log("Declined declinedDet --------->", declinedDet);
            const row      = declinedDet && declinedDet.length > 0?declinedDet[0]:null;
            const countDet = row && row._count?row._count.id:0;
            const sumDet   = row && row._sum?row._sum.amount:0;
            const obj      = { total: countDet, amount: sumDet };
            resolve(obj);
        }catch (error) {
            reject(error.message ? error.message : error);
        }
    })
}


async function disbursedData(conObj){
    return new Promise(async (resolve, reject) =>{
        try{
            conObj.stagename = 'Loan Disbursed';
            let dateFrom = new Date();
            let lastDay = moment().subtract(1, 'day');
            let lastMonthDay = moment(dateFrom).subtract(1,'months').endOf('month');
            lastDay = new Date(lastDay).toISOString();
            lastMonthDay = new Date(lastMonthDay).toISOString();
            var futureMonth = moment(dateFrom).subtract(3, 'M');
            var futureMonthEnd = moment(futureMonth).endOf('month');
            futureMonthEnd = new Date(futureMonthEnd).toISOString();
            const disbursalDet = await prisma.opportunity.groupBy({
                by: ['stagename'],
                where: conObj,
                _count:{
                    id: true
                },
                _sum: {
                    amount: true,
                },
            });
            conObj.createddate = {
                gte: lastDay,
              };
            const todayDet = await prisma.opportunity.groupBy({
                by: ['stagename'],
                where: conObj,
                _count:{
                    id: true
                },
                _sum: {
                    amount: true,
                },
            });
            conObj.createddate = {
                gte: lastMonthDay,
              };
            const thisMonthDet = await prisma.opportunity.groupBy({
                by: ['stagename'],
                where: conObj,
                _count:{
                    id: true
                },
                _sum: {
                    amount: true,
                },
            });
            conObj.createddate = {
                gte: futureMonthEnd,
              };
            const thisQuatDet = await prisma.opportunity.groupBy({
                by: ['stagename'],
                where: conObj,
                _count:{
                    id: true
                },
                _sum: {
                    amount: true,
                },
            });
            console.log("Disbursal disbursedDet --------->", disbursalDet);
            const row           = disbursalDet && disbursalDet.length > 0?disbursalDet[0]:null;
            const toDay         = todayDet && todayDet.length > 0?todayDet[0]:null;
            const thisMonth     = thisMonthDet && thisMonthDet.length > 0?thisMonthDet[0]:null;
            const thisQuat      = thisQuatDet && thisQuatDet.length > 0?thisQuatDet[0]:null;
            const todayCount    = toDay && toDay._count?toDay._count.id:0;
            const todayAmount   = toDay && toDay._sum?toDay._sum.amount:0;
            const thisMonCount  = thisMonth && thisMonth._count?thisMonth._count.id:0;
            const thisMonAmt    = thisMonth && thisMonth._sum?thisMonth._sum.amount:0;
            const thisQuatCount = thisQuat && thisQuat._count?thisQuat._count.id:0;
            const thisQuatAmt   = thisQuat && thisQuat._sum?thisQuat._sum.amount:0;
            const countDet = row && row._count?row._count.id:0;
            const sumDet   = row && row._sum?row._sum.amount:0;
            const obj      = { total: countDet, amount: sumDet, today:{ total: todayCount, amount: todayAmount }, thisMon: { total: thisMonCount, amount: thisMonAmt }, thisQuat: { total: thisQuatCount, amount: thisQuatAmt } };
            resolve(obj);
        }catch (error) {
            reject(error.message ? error.message : error);
        }
    })
}

async function closedLoan(conObj){
    return new Promise(async (resolve, reject) =>{
        try{
            conObj.stagename = 'Closed';
            const closedDet = await prisma.opportunity.groupBy({
                by: ['stagename'],
                where: conObj,
                _count:{
                    id: true
                },
                _sum: {
                    amount: true,
                },
            });
            console.log("Disbursal closedDet --------->", closedDet);
            const row      = closedDet && closedDet.length > 0?closedDet[0]:null;
            const countDet = row && row._count?row._count.id:0;
            const sumDet   = row && row._sum?row._sum.amount:0;
            const obj      = { total: countDet, amount: sumDet };
            resolve(obj);
        }catch (error) {
            reject(error.message ? error.message : error);
        }
    })
}

async function droppedLoan(conObj){
    return new Promise(async (resolve, reject) =>{
        try{
            conObj.stagename = 'Dropped';
            const droppedDet = await prisma.opportunity.groupBy({
                by: ['stagename'],
                where: conObj,
                _count:{
                    id: true
                },
                _sum: {
                    amount: true,
                },
            });
            console.log("Dropped droppedDet --------->", droppedDet);
            const row      = droppedDet && droppedDet.length > 0?droppedDet[0]:null;
            const countDet = row && row._count?row._count.id:0;
            const sumDet   = row && row._sum?row._sum.amount:0;
            const obj      = { total: countDet, amount: sumDet };
            resolve(obj);
        }catch (error) {
            reject(error.message ? error.message : error);
        }
    })
}
