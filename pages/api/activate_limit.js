import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { d2c_bureaucheck } from "./mulesoft_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function activateLimit(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return activateLimit();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function activateLimit() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "User sfid is mandatory" })
        try {
            const cust_id = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id
                }
            });
            if(accountDet)
            {
                const accountPro = await prisma.account.update({
                    where: {
                        sfid: cust_id
                    },
                    data:{
                        is_limit_confirm__c: true
                    }
                });
                return res.status(200).json({ status:"success", message: "Limit Activated successfully", })
            }else{
                return res.status(200).json({ status:"error", message: "Detail is not updated" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

