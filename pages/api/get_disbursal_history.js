
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function disbursalsHistory(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return disbursalsHistory();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function disbursalsHistory() {
        const { duration, lender_sfid } = req.body;
        if (duration == "" || duration == undefined)
            return res.status(200).send({ status:"error", message: "Duration is mandatory" })
        if (lender_sfid == "" || lender_sfid == undefined)
            return res.status(200).send({ status:"error", message: "lender_sfid is mandatory" })
        try {
            const userSfid = String(lender_sfid);
            const type     = String(duration);
            const recordDet  = await prisma.recordtype.findFirst({
                where: {
                    name: "Transaction Application",
                },
            });
            let conObj = {
                NOT: [{ sfid: null }],
                recordtypeid: String(recordDet.sfid),
                lender_name__c: userSfid,
                stagename : 'Loan Disbursed'
            }
            console.log('conObj----->', conObj);
            const disbursalDet = await prisma.opportunity.groupBy({
                by: ['createddate', 'amount', 'id'],
                where: conObj,
                _count:{
                    id: true
                },
                _sum: {
                    amount: true,
                },
              })
              console.log('disbursalDet----->', disbursalDet);
            let obj = [
                {
                    months: "Jan 2021",
                    disbursals: 100,
                    amount: 40000
                },
                {
                    months: "Feb 2021",
                    disbursals: 110,
                    amount: 40000
                },
                {
                    months: "Mar 2021",
                    disbursals: 110,
                    amount: 40000
                },
                {
                    months: "Apr 2021",
                    disbursals: 220,
                    amount: 320000
                },
                {
                    months: "May 2021",
                    disbursals: 110,
                    amount: 120000
                },
                {
                    months: "Jun 2021",
                    disbursals: 110,
                    amount: 120000
                },
                {
                    months: "Jul 2021",
                    disbursals: 110,
                    amount: 120000
                }
            ]
            res.status(200).send({ status:'success', message: 'Success', data: obj, disbursalDet:disbursalDet })
           
        } catch (error) {
           return res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}
