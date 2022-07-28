// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import getConfig from 'next/config';
import { SALES_FORCE } from "./api";
import { getAccount } from "./salesforce_api";
const { serverRuntimeConfig } = getConfig();
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function getLeadProfile(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getLeadProfile();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getLeadProfile() {
            const { user_sfid } = req.body;
            if (user_sfid == "" || user_sfid == undefined)
                return res.status(500).send({ message: "Id is mandatory" })

            try {
               /*  const accountDet = await prisma.account.findUnique({
                    where: {
                        sfid: user_sfid
                    }
                }); */
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
                const accountDet = await getAccount(salesForceToken, user_sfid);
                if(accountDet)
                {
                    let rowDet = await toLowerKeys(accountDet);
                    const getNotificationData = await prisma.custom_notification__c.findFirst({
                        where:{
                            account__c: user_sfid
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    const getProData = await prisma.account_products.findFirst({
                        where:{
                            OR: [
                                {
                                  //  cust_id: String(accountDet.Id),
                                    account__c: user_sfid,
                                }
                            ]
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    if(getProData && getProData.product_id)
                    {
                        const productDet = await prisma.product2.findFirst({
                            where:{
                                sfid: getProData.product_id
                            }
                        });
                        if(productDet)
                        {
                            rowDet.product_name = productDet.name;
                            rowDet.mrp__c = productDet.mrp__c;
                            rowDet.price__c = productDet.price__c;
                        }
                    }
                    return res.status(200).json({
                        responseCode:200,
                        status: "success",
                        message:"success",
                        data: rowDet,
                        notification: getNotificationData
                    })
                }
                else{
                    return res.status(200).json({
                        responseCode:200,
                        status: "error",
                        message: "Invalid Lead id",
                        data: accountDet
                    })
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

async function toLowerKeys(obj) {
    return new Promise(async (resolve, reject) => {
        try {
            const entries = Object.entries(obj);
            const objData = Object.fromEntries(
                await Promise.all(entries.map(([key, value]) => {
                    console.log("key -------->", key);
                return [key.toLowerCase(), value];
                })),
            );
            console.log("objData -------->", objData);
            /*  const objData = await Promise.all(Object.keys(obj).reduce((item, key) => {
                item[key.toLowerCase()] = obj[key];
                return item;
            }, {})); */
            resolve(objData);
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    });
}



