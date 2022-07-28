// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function updateUserStatus(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return updateUserStatus();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function updateUserStatus() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(500).send({ message: "User sfid is mandatory" })

        try {
                const cust_id = String(user_sfid);
                const accountDet = await prisma.account.findFirst({
                    where: {
                        sfid: cust_id
                    }
                });
               if (accountDet) {
                    await prisma.account.update({
                        where:{
                            sfid: cust_id
                        },
                        data: {
                            account_status__c: "Full User",
                            is_nach_approved__c: true,
                            nach_register_date__c: new Date()
                        }
                    });
                    return res.status(200).send({  status:"success", "message":"Success" });
                } else {
                    return res.status(500).send({ message: "Account doesnot exists" })
                }
           
            } catch (error) {
                res.status(500).send({ message: error.message ? error.message : error })
            }
    }
}



