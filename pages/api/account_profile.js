import Cors from 'cors';
import { prisma } from "./_base";
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
export default async function profileupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return profileUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function profileUpdate() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Customer id cannot be empty" })
       
        try {
            const userSfid = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: userSfid,
                },
                select: {
                    first_name__c: true,
                    last_name__c: true,
                    date_of_birth_applicant__c: true,
                    ipa_basic_bureau__c: true,
                    pan_verified__c: true,
                    pan_number__c: true,
                    email__c: true,
                    is_qde_1_form_done__c:true,
                    is_photo_verified__c:true,
                    is_bank_detail_verified__c:true,
                    is_name_match__c:true,
                    account_status__c:true,
                    is_qde_2_form_done__c:true,
                    is_address_document_verified__c:true,
                    is_address_document_uploaded__c: true,
                    is_pan_document_uploaded__c: true,
                    id:true,
                    customer_account_status__c:true,
                    is_pan_document_verified__c:true,
                    is_kyc_document_verified__c: true,
                    is_photo_uploaded__c: true,
                    approved_pin_code__c: true,
                    gender__c: true,
                    phone: true,
                    resident_type__c: true,
                    rent_amount__c: true,
                    employer_type__c: true,
                    monthly_income__c: true,
                    occupation__c: true,
                    employer_name__c: true,
                    industry: true,
                    sfid: true,
                    is_pan_confirm__c: true,
                    is_limit_confirm__c: true,
                    nach_provider__c: true,
                    client_nach_id__c: true,
                    is_nach_approved__c: true,
                    current_address_id__c: true,
                    mpin__c: true,
                    account_partner__c:{
                        select:{
                            account_to__c: true,
                            account_from__c: true
                        }
                    }
                }
            });
            if(accountDet)
            {
                return res.status(200).json({ status:"success",accountDet})
            }else{
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
                    let accountDet  = await toLowerKeys(resData);
                    accountDet.sfid = accountDet.id;
                    accountDet.id   = '';
                    return res.status(200).json({ status:"success",accountDet})
                }else{
                    return res.status(200).json({ status:"error",message: "Detail not found", data: resData })
                }
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