// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'
import { prisma } from "./_base";
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
 )
export default async function getUserBankList(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getUserBankList();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function getUserBankList() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "ID is mandatory" })
            const id = String(user_sfid);
            try {
                const accountDet = await prisma.account.findFirst({
                    where: {
                        sfid: id                    
                    }
                });
                if(accountDet)
                {
                    const getdata = await prisma.bank_account__c.findMany({
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
                        where:{
                            account_id__c: accountDet.sfid
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    if(getdata)
                        return res.status(200).json({ status:'success', message: "success", data: getdata })
                        return res.status(400).json({ status:'error', message: "Bank Details not found" })
                } else {
                    return res.status(200).send({ status:"error",message: "Details not found" })
                }
            } catch (error) {
                res.status(500).send({ status:"error", message: error.message ? error.message : error })
            }
        }
}

