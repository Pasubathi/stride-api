// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function getUserBankDetails(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getUserBankDetails();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getUserBankDetails() {
            const { user_sfid } = req.body;
            if (user_sfid == "" || user_sfid == undefined)
                return res.status(200).send({ status: "error", message: "Id is mandatory" })
                
            const cust_id  = String(user_sfid);
            try {
                const accountData = await prisma.account.findFirst({
                    where: {
                        sfid: cust_id
                    }
                    
                });
                if(accountData)
                {
                    const bankData = await prisma.bank_name_details__c.findFirst({
                        where: {
                            bank_code__c: accountData.bank_name__c,
                        }
                    });
                    const obj = {
                        ifsc__c: accountData.ifsc__c,
                        bank_account_holder_name__c: accountData.first_name__c,
                        account_number__c: accountData.bank_account_number__c,
                        income_type: accountData.occupation__c,
                        bank_name: bankData && bankData.bank_code__c?bankData.bank_code__c:'',
                        bank_icon: bankData && bankData.bank_logo_url__c?bankData.bank_logo_url__c:'',
                    }
                    res.status(200).send({ status:'success',message: "Success", data: obj });
                }else{
                    res.status(200).send({ status:'error',message: "Details not found" });
                }
            } catch (e) {
                res.status(500).send({ responseCode:500,message: e.message ? e.message : e });
                return;
            }
        }
    } catch (error) {
        res.status(500).send({responseCode:500, message: error.message ? error.message : error })
    } 

}



