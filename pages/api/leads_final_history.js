
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function leadsHistory(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return leadsHistory();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function leadsHistory() {
        try {
            const { lender_sfid } = req.body;
            if (lender_sfid == "" || lender_sfid == undefined)
                return res.status(200).send({ status:"error", message: "Lender sfid is mandatory" })

                const recordDet  = await prisma.recordtype.findFirst({
                    where: {
                        name: "Transaction Application",
                    },
                });
                let conObj = {
                    NOT: [{ sfid: null }],
                    recordtypeid: String(recordDet.sfid),
                    lender_name__c: lender_sfid
                }
                const disbursalDet = await getDisbursal(conObj);
                const repaymentDet = await getRepayments(conObj);
                const pendingDet   = await getPending(conObj);
                const rejectDet    = await getRejected(conObj);
            let obj = {
                disbursal: disbursalDet,
                repayments:repaymentDet,
                pending: pendingDet,
                rejected: rejectDet,
            }
            res.status(200).send({ status:'success', message: 'Success', data: obj })
           
        } catch (error) {
           return res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}


async function getDisbursal(conObj){
    return new Promise(async (resolve, reject) =>{
        try{
            conObj.stagename = 'Loan Disbursed';
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
            console.log("Disbursal disbursedDet --------->", disbursalDet);
            const row           = disbursalDet && disbursalDet.length > 0?disbursalDet[0]:null;
            const countDet = row && row._count?row._count.id:0;
            const sumDet   = row && row._sum?row._sum.amount:0;
            let obj = {
                amount : sumDet,
                cases: countDet,
                avg_ticket_size: 0
            }
            resolve(obj);
        }catch (error) {
            reject(error.message ? error.message : error);
        }
    })
}

async function getRepayments(conObj){
    return new Promise(async (resolve, reject) =>{
        try{
            conObj.stagename = 'Loan Repayments';
            const repaymentDet = await prisma.opportunity.groupBy({
                by: ['stagename'],
                where: conObj,
                _count:{
                    id: true
                },
                _sum: {
                    amount: true,
                },
            });
            console.log("Repayment repaymentDet --------->", repaymentDet);
            const row      = repaymentDet && repaymentDet.length > 0?repaymentDet[0]:null;
            const countDet = row && row._count?row._count.id:0;
            const sumDet   = row && row._sum?row._sum.amount:0;
            let obj = {
                amount : sumDet,
                cases: countDet,
                avg_ticket_size: 0
            }
            console.log("Repayments obj --------->", obj);
            resolve(obj);
        }catch (error) {
            reject(error.message ? error.message : error);
        }
    })
}

async function getPending(conObj){
    return new Promise(async (resolve, reject) =>{
        try{
            conObj.stagename = 'Ready to disburse';
            const disbursalCount = await prisma.opportunity.count({
                where: conObj,
            });
            conObj.stagename = 'Approval Pending';
            const approvalCount = await prisma.opportunity.count({
                where: conObj,
            });
            let obj = {
                approval: approvalCount,
                disbursal: disbursalCount,
                pending_mount: 0
            }
            console.log("Pending obj --------->", obj);
            resolve(obj);
        }catch (error) {
            reject(error.message ? error.message : error);
        }
    })
}

async function getRejected(conObj){
    return new Promise(async (resolve, reject) =>{
        try{
            conObj.stagename = 'Loan Declined';
            const declinedCount = await prisma.opportunity.count({
                where: conObj,
            });
            conObj.stagename = 'Loan Dropped';
            const droppedCount = await prisma.opportunity.count({
                where: conObj,
            });
            let obj = {
                declined: declinedCount,
                dropped: droppedCount,
                rejected_rmount: 0
            }
            console.log("Rejected obj --------->", obj);
            resolve(obj);
        }catch (error) {
            reject(error.message ? error.message : error);
        }
    })
}
