
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
import { SALES_FORCE } from "./api";
import { softtPull } from './mulesoft_api';
import { getPanProfile, checkPanStatus } from "./mulesoft_api";
import { createAccount, updateAccount } from "./salesforce_api";
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
            const { fname, lname, email, mobile, product, product_price, loan_amount, id } = req.body;
            if (fname == "" || fname == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "First Name is mandatory" })
            if (lname == "" || lname == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Last Name is mandatory" })
            if (email == "" || email == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Email is mandatory" })
            if (mobile == "" || mobile == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Mobile is mandatory" })
            if (product == "" || product == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Product is mandatory" })
           if (product_price == "" || product_price == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Product price is mandatory" })
            if (loan_amount == "" || loan_amount == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Loan amount is mandatory" })
            if (id == "" || id == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Id is mandatory" })
            let product_id = String(product);
            let amount = parseFloat(loan_amount);
            let cust_id = Number(id);
            const accountEmailDet = await prisma.account.findFirst({
                where: {
                    email__c: email,
                }
            });
            const accountPhoneDet = await prisma.account.findFirst({
                where: {
                    phone: mobile,
                }
            });
            const merchantAccountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id,
                }
            });
            const recordDet = await prisma.recordtype.findFirst({
                where: {
                    name: "Customer Account",
                },
            });

            const transDet = await prisma.recordtype.findFirst({
                where: {
                    name: "Transaction Application",
                },
            });

            const merchantDet  = await prisma.merchant_product__c.findFirst({
                where: {
                    productid__c: product_id,
                    accountid__c: merchantAccountDet.sfid,
                }
            });
            let sfId = recordDet.sfid.toString();
            if(!accountEmailDet && !accountPhoneDet)
            {
               // let tempid =  await generateExternalId(18);
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
                const obj = {
                    token: salesForceToken,
                    mobile: mobile,
                    recordId: sfId,
                    lname: lname,
                    fname: fname,
                    email: email,
                    source: "Merchant Dashboard",
                    accountStatus: "Partial User"
                }
                const getData = await createAccount(obj);
                if(getData && getData.success)
                {
                    /*  const createAccount = await prisma.account.create({
                        data: {
                        // heroku_external_id__c: tempid,
                            createdbyid: merchantAccountDet.sfid,
                            first_name__c: fname,
                            last_name__c: lname,
                            //email__c: email,
                            phone: mobile,
                            accountsource: 'Merchant Dashboard',
                            account_status__c: 'Partial User',
                            recordtypeid: sfId
                        },
                    }); */
                    const userSfid = getData.id
                    await prisma.account_products.create({
                        data: {
                           // cust_id: createAccount.id,
                            account__c: userSfid,
                            product_id: product_id,
                            loan_amount: amount,
                        },
                    });
                   /*  let isSfid = createAccount.sfid;
                    while(isSfid == null)
                    {
                        const ac = await prisma.account.findFirst({
                            where: {
                                id: createAccount.id
                            }
                        });
                        isSfid = ac.sfid;
                    } */
                    const oppDet = await prisma.opportunity.create({
                        data: {
                            accountid: userSfid,
                            stagename: 'Select Plan',
                            merchant_product__c: merchantDet?merchantDet.sfid:null,
                            merchant_name__c: merchantDet?merchantDet.accountid__c:null,
                            name: fname,
                            recordtypeid: String(transDet.sfid)
                        },
                    });
                    let softData = {
                        id: '',
                        first_name: fname,
                        last_name: lname,
                        mobile: mobile,
                        sfid: userSfid,
                        tempid: ''
                    }
                
                    console.log("softpull Data", softData);
                    const softpullData = await softtPull(softData);
                    console.log("softpull Return Data", softpullData);
                    if(softpullData.status =="success" )
                    {   
                        let obj = softpullData.data;
                        let limit_data = Number(obj.limit?obj.limit:0);
                        console.log("obj data", obj);
                       /*  await prisma.account.update({
                            where: {
                                sfid: userSfid
                            },
                            data: {
                                ipa_basic_bureau__c: limit_data,
                                pan_number__c: obj.pan?obj.pan:null
                            },
                        }); */
                        const updateObj = {
                            PAN_Number__c:  obj.pan?obj.pan:null,
                            IPA_Basic_Bureau__c: limit_data
                        }
                        const getUpdate = await updateAccount(updateObj);
                        if(obj.pan)
                        {
                            const accountDet = await prisma.account.findFirst({
                                where: {
                                    sfid: userSfid,
                                }
                            });
                            let subData = {
                                pan: obj.pan,
                                name: fname,
                                cust_id: accountDet.id,
                                sfid: accountDet.sfid,
                                tempId: ''
                            }
                            //console.log("subData", subData);
                            getPanProfile(subData);
                            //console.log("profiledata", profiledata);
                            checkPanStatus(subData);
                        }
                    }
                    const accountDet = await prisma.account.findFirst({
                        select:{
                            id: true,
                            sfid: true
                        },
                        where: {
                            sfid: userSfid,
                        }
                    });
                    return res.status(200).send({ responseCode: 200, status:"success",  message: "Lead Created Successfully", data: accountDet , mulesoft: softpullData })
                }else{
                    return res.status(200).send({status:"error",  message: getData})
                }
            }else{
                let id = '';
                let sfid = '';
                let name = '';
                if(accountEmailDet)
                {
                    id = accountEmailDet.id;
                    sfid = accountEmailDet.sfid;
                    name = accountEmailDet.first_name__c;
                }else{
                    id = accountPhoneDet.id;
                    sfid = accountPhoneDet.sfid;
                    name = accountPhoneDet.first_name__c;
                }
                
                const oppDet = await prisma.opportunity.create({
                    data: {
                        accountid:sfid,
                        stagename: 'Registration Incomplete',
                        merchant_product__c: merchantDet?merchantDet.sfid:null,
                        merchant_name__c: merchantDet?merchantDet.accountid__c:null,
                        recordtypeid: String(transDet.sfid),
                        name: name,
                    },
                });
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Account Already Exist", user_id: sfid})
            }
            
        } catch (error) {
            res.status(500).send({ responseCode: 500, message: error.message ? error.message : error })
        }
    }
}

function generateExternalId(length) {
    return new Promise((resolve, reject) => {
        try {
            let result = '';
            const characters ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const charactersLength = characters.length;
            for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            resolve(result)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}
/* 
async function checkSfid(external_id)
{
    return new Promise(async (resolve, reject) => {
        try {
            let i =  0;
            let startcount = true;
            let callCount = 0;
            const intervalId =  setInterval(async function() {
                i = i+1;
                console.log("i------->", i);
                if(i ==25)
                {
                    callCount = callCount+1;
                    startcount = false;
                    const updateSfid1 = await updateSfid(external_id);
                    console.log("updateSfid =====>", updateSfid1);
                    if(updateSfid1)
                    {
                        i =  0;
                        clearInterval(intervalId);
                        resolve(true);
                    }else{
                        if(callCount < 5)
                        {
                            i = 0;
                        }else{
                            clearInterval(intervalId);
                            resolve(true);
                        }
                    }
                }
            }, 1000);
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
} */
/* 
async function updateSfid(external_id)
{
    return new Promise(async (resolve, reject) => {
        try {
            const getData = await prisma.account.findFirst({ where: { heroku_external_id__c: external_id } });
           if(getData.sfid)
            {
                const bureauDet = await prisma.bureau_response__c.findFirst({ where: { heroku_external_id__c: external_id }})
                console.log("bureauDet", bureauDet);
                console.log("id", bureauDet.id);
                if(bureauDet)
                {
                    await prisma.bureau_response__c.update({
                        where:{
                            id: bureauDet.id
                        },
                        data:{
                            account__c: getData.sfid
                        }
                    });
                }
                const apiloggerDet = await prisma.api_logger__c.findFirst({ where: { heroku_external_id__c: external_id }})
                if(apiloggerDet)
                {
                    await prisma.api_logger__c.update({
                        where:{
                            id: apiloggerDet.id
                        },
                        data:{
                            account__c: getData.sfid
                        }
                    });
                }

                const errorLoggerDet = await prisma.custom_error__c.findFirst({ where: { heroku_external_id__c: external_id }})
                if(errorLoggerDet)
                {
                    await prisma.custom_error__c.update({
                        where:{
                            id: errorLoggerDet.id
                        },
                        data:{
                            account__c: getData.sfid
                        }
                    });
                }

                const opportunityDet = await prisma.opportunity.findFirst({ where: { heroku_external_id__c: external_id }})
                if(opportunityDet)
                {
                    await prisma.opportunity.update({
                        where:{
                            id: opportunityDet.id
                        },
                        data:{
                            accountid: getData.sfid
                        }
                    });
                }
               
                resolve(true)
            }else{
                resolve(false)
            }
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

 */