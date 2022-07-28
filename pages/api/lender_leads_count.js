
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function lenderLeadsCount(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return lenderLeadsCount();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function lenderLeadsCount() {
        try {
            const { stage } = req.query;
            if (stage == "" || stage == undefined)
                return res.status(200).send({ status:"error", message: "Stage is mandatory" })
            const recordDet = await prisma.recordtype.findFirst({
                where: {
                    name: "Transaction Application",
                },
            });
            if(stage =="all")
            {
                const approvalCount = await prisma.opportunity.count({
                    where: {
                        NOT: [{ sfid: null }],
                        recordtypeid: String(recordDet.sfid),
                        stagename: "Approval Pending"
                    }
                });
                const disbursalCount = await prisma.opportunity.count({
                    where: {
                        NOT: [{ sfid: null }],
                        recordtypeid: String(recordDet.sfid),
                        stagename: "Disbursal Pending"
                    }
                });
                const loanDisbursedCount = await prisma.opportunity.count({
                    where: {
                        NOT: [{ sfid: null }],
                        recordtypeid: String(recordDet.sfid),
                        stagename: "Loan Disbursed"
                    }
                });
                const loanClosedCount = await prisma.opportunity.count({
                    where: {
                        NOT: [{ sfid: null }],
                        recordtypeid: String(recordDet.sfid),
                        stagename: "Loan Closed"
                    }
                });
                let obj = {
                    approval_pending: approvalCount,
                    disbursal_pending: disbursalCount,
                    disbursed_loans: loanDisbursedCount,
                    closed_loans: loanClosedCount
                }
                res.status(200).send({ status: 'success', message: "Success", data: obj })
            }else{
                res.status(200).send({ status: 'error', message: "Stage not found" })
            }
            
            return res.status(200).json(fetchData)
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

