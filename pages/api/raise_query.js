import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function raiseQuery(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return raiseQuery();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function raiseQuery() {
        const { user_sfid, subject, description } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Id cannot be empty" })
        if (subject == "" || subject == undefined)
            return res.status(200).send({ status:"error",message: "Subject cannot be empty" })
        if (description == "" || description == undefined)
            return res.status(200).send({ status:"error",message: "Description cannot be empty" })
       
        try {
            const sfid   = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            if (accountDet) {
                await prisma.case__c.create({
                    data: {
                        accountid: accountDet.sfid,
                        subject: subject,
                        description: description
                    }
                });
                return res.status(200).json({ status:"success",message: "Query raised successfully" })
            } else {
                return res.status(200).json({ status:"error",message: "Account not found" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

