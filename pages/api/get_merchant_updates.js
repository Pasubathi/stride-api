import Cors from 'cors';
import { prisma } from "./_base";
import { SALES_FORCE } from "./api";
import { getAccount } from "./salesforce_api";
import { apiHandler } from '../../helpers/api';
import initMiddleware from '../../lib/init-middleware';
// export default apiHandler(profileupdate);
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function profileupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return profileUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function profileUpdate() {
        const { user_id } = req.body;
        if (user_id == "" || user_id == undefined)
            return res.status(200).send({ status:"error",message: "Customer id cannot be empty" })
       
        try {
            const cust_id = Number(user_id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id,
                },
                select: {
                    first_name__c: true,
                    last_name__c: true,
                    pan_number__c: true,
                    email__c: true,
                    account_status__c:true,
                    id:true,
                    approved_pin_code__c: true,
                    gender__c: true,
                    phone: true,
                    sfid: true,
                }
            });
            if(accountDet)
            {
                return res.status(200).json({ status:"success", accountDet})
            }else{
                return res.status(200).json({ status:"error", message: "Detail not found" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}