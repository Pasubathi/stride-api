// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import { SALES_FORCE } from "./api";
import { updateAccount } from "./salesforce_api";
import initMiddleware from '../../lib/init-middleware';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function updateLimit(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return updateLimit();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function updateLimit() {
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
                    const init = {
                        method: 'POST'
                    };
                    const getdata = await fetch(SALES_FORCE, init).then((response) => response.json())
                    .then((response) => {
                            return response;
                    });
                    let salesForceToken = '';
                    if(getdata && getdata.access_token)
                    {
                        salesForceToken = getdata.access_token
                    }
                    const updateObj = {
                        IPA_Basic_Bureau__c: 150000
                    }
                    await updateAccount(updateObj, salesForceToken, accountDet.sfid);
                    await prisma.account.update({
                        where:{
                            sfid: cust_id
                        },
                        data: {
                            ipa_basic_bureau__c: 150000
                        }
                    });
                    return res.status(200).send({  status:"success", "message":"Success","ipabureau":"150000" });
                } else {
                    return res.status(500).send({ message: "Account doesnot exists" })
                }
           
            } catch (error) {
                res.status(500).send({ message: error.message ? error.message : error })
            }
    }
}



