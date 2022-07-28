import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function addCard(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return addCard();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function addCard() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Id cannot be empty" })
       
        try {
            const sfid       = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            if (accountDet) {
                const ratingDet = await prisma.account_feedback__c.findFirst({
                    where: {
                        user_sfid: sfid,
                        type__c: 2
                    }
                });
                return res.status(200).json({ status:"success", message:"Success", data: ratingDet});
                
            } else {
                return res.status(200).json({ status:"error",message: "Account not found" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

