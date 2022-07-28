import Cors from 'cors';
import { prisma } from "./_base";
import moment from 'moment';
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
export default async function merchantProfile(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return merchantProfile();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function merchantProfile() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Customer id cannot be empty" })
       
        try {
            const userSfid = String(user_sfid);
            const userDet = await prisma.account.findFirst({
                where: {
                    sfid: userSfid,
                },
                select: {
                    id: true
                }
            });
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
            const resData = await getAccount(salesForceToken, user_sfid);
            if(resData && resData.Id !==undefined)
            {
               const categoryDet = await prisma.merchant_category__c.findFirst({
                    where: {
                        account__c: user_sfid
                    }
                });
                const brandDet = await prisma.merchant_brand__c.findFirst({
                    where: {
                        accountid__c: user_sfid,
                    },
                    orderBy:{
                        id: 'desc'
                    }
                });
                let addressDet;
                if(resData && resData.Current_Address_Id__c)
                {
                    addressDet = await prisma.address__c.findFirst({
                        where: {
                            id: Number(resData.Current_Address_Id__c)
                        }
                    });
                }
                let accountDet  = await toLowerKeys(resData);
                accountDet.sfid = accountDet.id;
                accountDet.id   = '';
                accountDet.category   = categoryDet;
                accountDet.brand   = brandDet;
                accountDet.address = addressDet;
                let onboard = await formatDate(accountDet.createddate);
                accountDet.createddate = onboard;
                return res.status(200).json({ status:"success",accountDet})
            }else{
                return res.status(200).json({ status:"error",message: "Detail not found", data: resData })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

async function toLowerKeys(obj) {
    return new Promise(async (resolve, reject) => {
        try {
            const entries = Object.entries(obj);
            const objData = Object.fromEntries(
                await Promise.all(entries.map(([key, value]) => {
                  //  console.log("key -------->", key);
                return [key.toLowerCase(), value];
                })),
            );
           // console.log("objData -------->", objData);
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

function formatDate(DateFormat) {
    return new Promise ((resolve, reject)=>{
        try{
            let date = moment.utc(DateFormat).format('YYYY-MM-DD');
            resolve(date);
        }catch (err){
            reject(err.message ? err.message : err)
        }
    });
}