
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { SALES_FORCE } from "./api";
import { createTransApp } from "./salesforce_api";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function createLead(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return createLead();
        default:
            return res.status(500).send({ responseCode: 500, message: `Method ${req.method} Not Allowed` })
    }
    async function createLead() {
        try {
            const { product_sfid, user_sfid } = req.body;
            if (product_sfid == "" || product_sfid == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Product is mandatory" })
            if (user_sfid == "" || user_sfid == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "User is mandatory" })
           
            const product_id  = String(product_sfid);
            const sfid     = String(user_sfid);
            const accountDet  = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });

            const recordDet = await prisma.recordtype.findFirst({
                where: {
                    name: "Transaction Application",
                },
            });

            const merchantDet  = await prisma.merchant_product__c.findFirst({
                where: {
                    productid__c: product_id,
                }
            });
           
            if(accountDet)
            {
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
                let obj = {
                    accountid: accountDet.sfid,
                    stagename: 'Application Pending',
                    merchant_product__c: merchantDet?merchantDet.sfid:null,
                    merchant_name__c: merchantDet?merchantDet.accountid__c:null,
                    name: accountDet.first_name__c,
                    recordtypeid: String(recordDet.sfid),
                    closeDate: new Date(),
                }
                const getData = await createTransApp(salesForceToken, obj);
               /*  const createAccount = await prisma.opportunity.create({
                    data: {
                        accountid: accountDet.sfid,
                        stagename: 'Application Pending',
                        merchant_product__c: merchantDet?merchantDet.sfid:null,
                        merchant_name__c: merchantDet?merchantDet.accountid__c:null,
                        name: accountDet.first_name__c,
                        recordtypeid: String(recordDet.sfid)
                    },
                }); */
                return res.status(200).send({ responseCode: 200, status:"success",  message: "Success", getData})
            }else{
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Details not found", })
            }
            
        } catch (error) {
            res.status(500).send({ responseCode: 500, message: error.message ? error.message : error })
        }
    }
}