
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getLenderLeadsCount(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getLenderLeadsCount();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getLenderLeadsCount() {
        try {
            const { stage, lender_sfid } = req.body;
            if (lender_sfid == "" || lender_sfid == undefined)
                return res.status(200).send({ status:"error", message: "Id is mandatory" })
                const userSfid   = String(lender_sfid);
            const recordDet = await prisma.recordtype.findFirst({
                where: {
                    name: "Transaction Application",
                },
            });
            let obj = {
                NOT: [{ sfid: null }],
                recordtypeid: String(recordDet.sfid),
                lender_name__c: userSfid
            }
            if(stage)
            {
                obj.stagename = String(stage);
            }
            let fetchData = await prisma.opportunity.count({
                where: obj
            });
            return res.status(200).json(fetchData)
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

