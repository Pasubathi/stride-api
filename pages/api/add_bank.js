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
        const { bank_name, account_number, account_name, ifsc, branch, account_type, user_sfid, is_active } = req.body;
        if (bank_name == "" || bank_name == undefined)
            return res.status(200).send({ status:"error",message: "Bank name cannot be empty" })
        if (account_number == "" || account_number == undefined)
            return res.status(200).send({ status:"error",message: "Account number cannot be empty" })
        if (account_name == "" || account_name == undefined)
            return res.status(200).send({ status:"error",message: "Account name cannot be empty" })
        if (ifsc == "" || ifsc == undefined)
            return res.status(200).send({ status:"error",message: "Ifsc code cannot be empty" })
        if (branch == "" || branch == undefined)
            return res.status(200).send({ status:"error",message: "Branch cannot be empty" })
        if (account_type == "" || account_type == undefined)
            return res.status(200).send({ status:"error",message: "Account Type cannot be empty" })
       
        try {
            const bankName   = String(bank_name);
            const accNumber  = String(account_number);
            const accname    = String(account_name);
            const ifscCode   = String(ifsc);
            const branchName = String(branch);
            const accType    = String(account_type);
            const sfid       = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            if (accountDet) {
               await prisma.bank_account__c.create({
                    data: {
                        account_name__c: accname,
                        account_number__c: accNumber,
                        bank_name__c: bankName,
                        account_id__c: accountDet.sfid,
                        account_type__c: accType,
                        bank_account_holder_name__c: accname,
                        ifsc__c: ifscCode,
                        branch_name__c: branchName,
                        bank_txn_status__c: is_active?true:false,
                    }
                });
                return res.status(200).json({ status:"success", message:"Bank account added successfully"})
            } else {
                return res.status(200).json({ status:"error",message: "Detail is not updated" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

