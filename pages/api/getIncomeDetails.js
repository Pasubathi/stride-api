import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getIncome(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getIncome();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function getIncome() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(500).send({ status:"error", message: "User sfid is mandatory" })
        try {
                const cust_id = String(user_sfid);
                const accountUser = await prisma.account.findFirst({
                    where: {
                        sfid: cust_id
                    },
                    select: {
                        id: true,
                        phone: true,
                        employer_type__c: true,
                        monthly_income__c: true,
                        occupation__c: true,
                        employer_name__c: true,
                        industry: true,
                    },
                });
                if(accountUser)
                {
                    return res.status(200).json({ status:"success", data:accountUser, message: "Success" })
                }else{
                    return res.status(200).json({ status:"error", message: "Account not found" })
                }
            
        } catch (error) {
            return res.status(500).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

