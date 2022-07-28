import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { createCustomer, createOrder } from "./razorpay_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function enashPay(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return enashPay();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function enashPay() {
        const { user_sfid, type } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "User sfid is mandatory" })
        if (type == "" || type == undefined)
            return res.status(200).send({ status:"error", message: "Payment Type is mandatory" })
       
        try {
            const cust_id = String(user_sfid);
            const accountUser = await prisma.account.findFirst({
                where: {
                    sfid: cust_id
                }
            });
            let customer_id = '';
            let getObj = '';
            if(accountUser)
            {
                if(!accountUser.client_nach_id__c)
                {
                    /* let data = {
                        "name": `${accountUser.first_name__c} ${accountUser.last_name__c}`,
                        "email": accountUser.email__c,
                        "contact": accountUser.phone,
                        "fail_existing": "1",
                        "notes":{
                          "note_key_1": "Tea. Earl grey. Hot.",
                          "note_key_2": "Tea. Earl grey. Decaf."
                        }
                      } */

                      let data = {
                        "name": "Gaurav Kumar",
                        "email": "gaurav.kumar1@example.com",
                        "contact": "9894204012",
                        "fail_existing": "0",
                        "notes":{
                          "note_key_1": "Tea. Earl grey. Hot.",
                          "note_key_2": "Tea. Earl grey. Decaf."
                        }
                     }
                       
                     const getCustData = await createCustomer(data);
                     getObj = getCustData;
                     if(getCustData && getCustData.id)
                     {
                        customer_id = getCustData.id
                        await prisma.account.update({
                            where:{
                               id: accountUser.id
                            },
                            data: {
                                client_nach_id__c: getCustData.id 
                            }
                        })
                     }
                }else{
                    customer_id = accountUser.client_nach_id__c
                }
                const bankData = await prisma.bank_account__c.findFirst({
                    where: {
                        account_id__c: accountUser.sfid,
                    },
                    orderBy:{
                        id: 'desc'
                    }
                });
                let otpVal = Math.floor(1000 + Math.random() * 9000);
                let obj = {
                    "amount": 0,
                    "currency": "INR",
                    "method": "emandate",
                    "payment_capture": "1",
                    "customer_id": customer_id,
                    "token": {
                        "auth_type": type =="NetBanking"?"netbanking":"debitcard",
                        "max_amount": 9999900,
                        "expire_at": 2147483647,
                        "bank_account": {
                            "beneficiary_name": accountUser.first_name__c,
                            "account_number": accountUser.bank_account_number__c,
                            "account_type": "savings",
                           // "account_type": bankData && bankData.account_type__c?bankData.account_type__c:"savings",
                            "ifsc_code": accountUser.ifsc__c
                        }
                    },
                    "receipt": String(otpVal)
                }
                const getorderData = await createOrder(obj);
                if(getorderData && getorderData.id)
                {   
                    let resData = {
                        customer_id: customer_id,
                        order_id: getorderData.id
                    }
                    return res.status(200).json({status:"success", message: "Success", data: resData, order: getorderData})
                }else{
                    return res.status(200).json({ status:"error", message: "Something went wrong", order:getorderData, obj: obj, getObj: getObj})
                }
            }else{
                return res.status(200).json({ status:"error", message: "Account not found" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

function addCards(getData) {
    return new Promise((resolve, reject) => {
        try {
            const createPayment = prisma.account_payments__c.create({
                data: getData,
            });
            resolve(createPayment)

        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

