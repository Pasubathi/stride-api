
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getLeads(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getLeads();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getLeads() {
        try {
            const { user_sfid } = req.body;
            if(user_sfid == "" || user_sfid == undefined)
                return res.status(200).json({ status: 'error', message: 'User sfid cannot be empty' });

                const accountDet = await prisma.account.findFirst({
                    where: {
                        sfid: user_sfid,
                    }
                });
                if(accountDet)
                {
                    const lender_sfid = accountDet.lender_id__c?accountDet.lender_id__c:accountDet.sfid;
                    const fetchData = await prisma.lender_email_recipient.findMany({
                        where: {
                            lender_sfid: lender_sfid
                        }
                    });
                    return res.status(200).json({ status: 'success', message: "Success", data: fetchData})
                }else {
                    return res.status(200).json({ status: 'error', message: "Invalid account details"})
                }
        } catch (error) {
            res.status(200).send({ status: 'error', message: error.message ? error.message : error })
        }

    }
}

