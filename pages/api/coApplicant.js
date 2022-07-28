// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import notification from "./notification"
import { sendEmail } from "./eduvanz_api"
import { SALES_FORCE } from "./api";
import { createAccount } from "./salesforce_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function coApplicantHandler(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return coApplicantHandler();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function coApplicantHandler() {
        const { mobileNumber, first_name, last_name, email, pan, relation, sfid } = req.body;
        if (mobileNumber == "" || mobileNumber == undefined)
            return res.status(200).send({ status:'error', message: "Mobile Number is mandatory" })
        if (first_name == "" || first_name == undefined)
            return res.status(200).send({ status:'error', message: "First Name is mandatory" })
        if (last_name == "" || last_name == undefined)
            return res.status(200).send({ status:'error', message: "Last Name is mandatory" })
        if (email == "" || email == undefined)
            return res.status(200).send({ status:'error', message: "Email is mandatory" })
        if (pan == "" || pan == undefined)
            return res.status(200).send({ status:'error', message: "Pan is mandatory" })
        if (sfid == "" || sfid == undefined)
            return res.status(200).send({ status:'error', message: "ID is mandatory" })
        try {
            const user = await prisma.account.findUnique({
                where: {
                    phone: mobileNumber
                }
            });
            const emailUser = await prisma.account.findFirst({
                where: {
                    email__c: email
                }
            });
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid
                }
            });
            if(accountDet)
            {
                const partnerDet = await prisma.account_partner__c.findFirst({
                    where: {
                        account_from__c: accountDet.sfid
                    }
                });
                if(!partnerDet)
                {
                    if (!emailUser && !user) {
                            try {
                                let tempid =  await generateExternalId(18);
                                const getData = await prisma.account.findFirst({ orderBy: { id: 'desc' } });
                                const recordDet = await prisma.recordtype.findFirst({
                                    where: {
                                        name: "Customer Account",
                                    },
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
                                const recordId = recordDet.sfid.toString();
                                const obj = {
                                    token: salesForceToken,
                                    mobile: mobileNumber,
                                    recordId: recordId,
                                    lname: last_name,
                                    fname: first_name,
                                    source: "Website",
                                    accountStatus: "Partial User"
                                }
                                const createUser = await createAccount(obj);
                               /*  const createUser = await prisma.account.create({
                                    data: {
                                        phone: mobileNumber,
                                        heroku_external_id__c: tempid,
                                        first_name__c: first_name,
                                        last_name__c: last_name,
                                        email__c: email,
                                    },
                                }); */
                                notification.sendOtp()
                                if (createUser && createUser.success) {
                                    let msgData = {
                                        pname: first_name,
                                        uname: accountDet.first_name__c
                                    }
                                    const msg = await composeMessage(msgData);
                                    const obj = {
                                        email: email,
                                        message: msg,
                                        subject: 'Co-Applicant Request'
                                    }
                                    const partnerDet = await prisma.account_partner__c.create({
                                        data: { 
                                           account_from__c: sfid,
                                           name: first_name,
                                           role__c: 'Co-Borrower',
                                           account_to__c: createUser.id
                                         }
                                    })
                                    const getData = await sendEmail(obj);
                                    return res.status(200).send({ status:'success', message: "Success" })
                                }else{
                                    return res.status(200).send({ status:'error', message: "Faild", data: createUser })
                                }
                            } catch (e) {
                                res.status(200).send({ status:'error',  message: e.message ? e.message : e })
                            }
                        } else {
                                const account_to = emailUser?emailUser.sfid:user.sfid;
                                let msgData = {
                                    pname: first_name,
                                    uname: accountDet.first_name__c
                                }
                                const msg = await composeMessage(msgData);
                                const obj = {
                                    email: email,
                                    message: msg,
                                    subject: 'Co-Applicant Request'
                                }
                                const partnerDet = await prisma.account_partner__c.create({
                                    data: { 
                                       account_from__c: sfid,
                                       name: first_name,
                                       role__c: 'Co-Borrower',
                                       account_to__c: account_to
                                     }
                                })
                                const getData = await sendEmail(obj);
                                return res.status(200).send({ status:'success', message: partnerDet })
                        }
                }else{
                    return res.status(200).send({ status:'error', message: "Co-Applicant already exist" })
                }
            }else{
                return res.status(200).send({ status:'error', message: "Account does not exist" })
            }
        } catch (error) {
            res.status(200).send({ status:'error', message: error.message ? error.message : error })
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

async function checkSfid(getData)
{
    return new Promise(async (resolve, reject) => {
        try {
            let i =  0;
            let startcount = true;
            let callCount = 0;
            const intervalId =  setInterval(async function() {
                callCount = callCount+1;
                startcount = false;
                const updateSfid1 = await updateSfid(getData);
                console.log("updateSfid =====>", updateSfid1);
                console.log("callCount =====>", callCount);
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
            }, 25000);
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function updateSfid(getObjData)
{
    const { external_id  } = getObjData
    return new Promise(async (resolve, reject) => {
        try {
            const getData = await prisma.account.findFirst({ where: { heroku_external_id__c: external_id } });
           if(getData.sfid)
            {
                const partnerDet = await createAccountPartner(getObjData, getData.sfid);
                console.log("partnerDet", partnerDet);
                resolve(true)
            }else{
                resolve(false)
            }
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function createAccountPartner(getData, sfid) {
    const { name, account_from  } = getData
    return new Promise( async (resolve, reject) => {
        try {
            const partnerDet = await prisma.account_partner__c.create({
                data: { 
                   account_from__c: account_from,
                   name: name,
                   role__c: 'Co-Borrower',
                   account_to__c: sfid
                 }
            })
            resolve(partnerDet)

        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function composeMessage(getData) {
    const { pname, uname  } = getData
    return new Promise( async (resolve, reject) => {
        try {
            const message = '<p>Dear '+pname+',</p> </br> <p> you have invited by '+uname+' to complete your purchase</p></br> <p>Thanks</p> </br> <p>Eduvanz Support Team </p> </br>';
            resolve(message)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

