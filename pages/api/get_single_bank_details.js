import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
// export default apiHandler(profileupdate);
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function addBank(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return addBank();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function addBank() {
        const { bank_sfid } = req.body;
        if (bank_sfid == "" || bank_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Bank sfid cannot be empty" })
       
        try {
            const sfid   = String(bank_sfid);
            const accountDet = await prisma.bank_account__c.findFirst({
                select:{
                    account_name__c: true,
                    account_number__c: true,
                    bank_name__c: true,
                    account_type__c: true,
                    bank_account_holder_name__c: true,
                    ifsc__c: true,
                    branch_name__c: true,
                    bank_txn_status__c: true,
                    sfid: true,
                    id: true,
                },
                where: {
                    sfid: sfid,
                }
            });
            if (accountDet) {
                return res.status(200).json({ status:"success", message:"Success", data: accountDet})
            } else {
                return res.status(200).json({ status:"error",message: "Detail is not updated" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

