
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function repPaymentHistory(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return repPaymentHistory();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function repPaymentHistory() {
        const { duration } = req.body;
        if (duration == "" || duration == undefined)
        return res.status(200).send({ status:"error", message: "Duration is mandatory" })
        try {
            const type = String(duration);
            let obj = [
                {
                    months: "Jan 2021",
                    repayments: 100,
                    amount: 50000
                },
                {
                    months: "Feb 2021",
                    repayments: 50,
                    amount: 50000
                },
                {
                    months: "Mar 2021",
                    repayments: 110,
                    amount: 50000
                },
                {
                    months: "Apr 2021",
                    repayments: 220,
                    amount: 740000
                },
                {
                    months: "May 2021",
                    repayments: 110,
                    amount: 920000
                },
                {
                    months: "Jun 2021",
                    repayments: 110,
                    amount: 1120000
                },
                {
                    months: "Jul 2021",
                    repayments: 110,
                    amount: 1220000
                }
            ]
            res.status(200).send({ status:'success', message: 'Success', data: obj })
           
        } catch (error) {
           return res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}
