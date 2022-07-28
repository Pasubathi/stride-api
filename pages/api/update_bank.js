import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function bankupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return bankUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function bankUpdate() {
        const { bank, ifsc, name, account_number, user_sfid, account_type, branch_name } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(500).send({ status: "error", message: "id is mandatory" })
        if (bank == "" || bank == undefined)
            return res.status(500).send({ status: "error", message: "Bank is mandatory" })
        if (ifsc == "" || ifsc == undefined)
            return res.status(500).send({ status: "error", message: "IFSC is mandatory" })
        if (account_number == "" || account_number == undefined)
            return res.status(500).send({ status: "error", message: "Account Number is mandatory" })
        if (name == "" || name == undefined)
            return res.status(500).send({ status: "error", message: "Account Holder Name is mandatory" })
        try {
            const cust_id = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id,
                }
            });
            if(accountDet)
            {
                const addressDet = await prisma.bank_account__c.findFirst({
                    where: {
                        account_id__c: accountDet.sfid,
                    }
                });
                if(!addressDet)
                {
                    await prisma.bank_account__c.create({
                        data: {
                            account_id__c: accountDet.sfid,
                            bank_name__c: String(bank),
                            bank_account_holder_name__c: String(name),
                            ifsc__c: String(ifsc),
                            account_number__c: String(account_number),
                            account_type__c: account_type?String(account_type):null,
                            branch_name__c: branch_name?String(branch_name): null
                        },
                    });
                    await prisma.account.update({
                        where: {
                            sfid: cust_id
                        },
                        data: {
                            bank_name__c: String(bank),
                            ifsc__c: String(ifsc),
                            bank_account_number__c: String(account_number),
                            is_bank_detail_verified__c: true
                        }
                    });
                    return res.status(200).json({  status: "success", message: "Updated successfully" })
                }else{
                    await prisma.bank_account__c.update({
                        where: {
                            account_id__c: accountDet.sfid,
                        },
                        data: {
                            bank_name__c: String(bank),
                            bank_account_holder_name__c: String(name),
                            ifsc__c: String(ifsc),
                            account_number__c: String(account_number),
                            account_type__c: account_type?String(account_type):null,
                            branch_name__c: branch_name?String(branch_name): null
                        },
                    });
                    await prisma.account.update({
                        where: {
                            sfid: cust_id
                        },
                        data: {
                            bank_name__c: String(bank),
                            ifsc__c: String(ifsc),
                            bank_account_number__c: String(account_number),
                            is_bank_detail_verified__c: true
                        }
                    });
                    return res.status(200).json({ status: "success", message: "Updated successfully" })
                }
            }else{
                return res.status(200).json({ status: "error", message: "Account  not found" })
            }
        } catch (error) {
            res.status(500).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

