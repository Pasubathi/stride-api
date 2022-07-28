
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getLeadsCount(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return getLeadsCount();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getLeadsCount() {
        try {
            const { sfid, stage } = req.query;
            if (sfid == "" || sfid == undefined)
            return res.status(500).send({ responseCode:500,message: "ID is mandatory" })
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
            let fetchData = await prisma.opportunity.count({
                where: conObj
            });
            return res.status(200).json(fetchData)
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

