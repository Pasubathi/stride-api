import moment from "moment";
import { prisma } from "./_base";
var request = require('request');
import { CASHFREE_API_URL } from "./api";

export async function cardsPay(givenData) {
  return  new Promise(async (resolve, reject) => {
    try {
            const { return_url, amount, cust_sfid, cust_email, cust_mobile, card_number, card_name, expiry_mm, expiry_yy, card_cvv } = givenData
            
            const channel_id = process.env.MOB_CHANNEL_ID;
            const client_id = process.env.MOB_CLIENT_ID;
            const client_secret = process.env.MOB_CLIENT_SECRET;
            const redirect_url = process.env.CASHFREE_REDIRECT_URL;
            const transaction_id = Math.floor(100000 + Math.random() * 900000);
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            const getdate = await formatDate(tomorrow);
            var options = {
              'method': 'POST',
              'url': 'http://s-edvnz-payment-api.sg-s1.cloudhub.io/api/payment',
              'headers': {
                'transaction_id': 'asdasd',
                'client_id': '918e4acddf60379f8ef62a1a07ee4a14d807ab7e',
                'client_secret': 'e448ec974f91c73a23cf1d672b8ba548b34ec182',
                'channel_id': 'MOB',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "orderId": String(transaction_id),
                "orderAmount": Number(amount),
                "orderCurrency": "INR",
              
                "customerDetails": {
                  "customerId": cust_sfid,
                  "customerEmail": cust_email,
                  "customerPhone": cust_mobile,
                  "customerBankAccountNumber": "1518121112",
                  "customerBankIfsc": "CITI0000001"	
                },
                "orderMeta": {
                  "returnUrl": return_url?`${return_url}?order_id={order_id}&order_token={order_token}`:'',
                  "notifyUrl": "https://b8af79f41056.eu.ngrok.io/webhook.php"
                },
                "orderExpiryTime": `${getdate}T11:05:52+05:30`,
                "orderNote": "Test order",
                "orderTags": {
                  "additionalProp": "string"
                },
                  "paymentMethod": {
                        "card": {/* 
                          "channel": "link",
                          "cardNumber": card_number,
                          "cardHolderName": card_name,
                          "cardExpiryMM": expiry_mm,
                          "cardExpiryYY": expiry_yy,
                          "cardCVV": card_cvv,
                          "cardAlias": null,
                          "cardBankName": "RBL",
                          "emiTenure": 4, */
                          "channel": "link",
                          "cardNumber": "4111111111111111",
                          "cardHolderName": "Tushar Gupta",
                          "cardExpiryMM": "06",
                          "cardExpiryYY": "22",
                          "cardCVV": "900",
                            "emiTenure": "3",
                          "cardAlias": null,
                          "cardBankName": "ICICI" 
                        } 
                   }	
              }
              )
            };
            request(options, function (error, response) {
              if(error)
              {
                reject({status:"error", message:error, request: JSON.parse(options.body)});
              }else{
                const getData = JSON.parse(response.body);
                if(getData && getData.cfPaymentId !==undefined)
                {
                  resolve({status: "success", message: 'Success', data: getData, order_id: String(transaction_id)})
                }else{
                  resolve({status: "error", message: 'Faild', data: getData, request: JSON.parse(options.body) })
                }
              }
           });
        
    } catch (error) {
      resolve({status:"error", message: error.message ? error.message : error });
    }
  });
}

export async function netBankingPay(givenData) {
  return  new Promise(async (resolve, reject) => {
    try {
            const { sfid, bank_code, cust_mobile, cust_email, amount, return_url } = givenData

            const channel_id = process.env.MOB_CHANNEL_ID;
            const client_id = process.env.MOB_CLIENT_ID;
            const client_secret = process.env.MOB_CLIENT_SECRET;
            const redirect_url = process.env.CASHFREE_REDIRECT_URL;
            const transaction_id = Math.floor(100000 + Math.random() * 900000);
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            const getdate = await formatDate(tomorrow);
            var options = {
              'method': 'POST',
              'url': 'http://s-edvnz-payment-api.sg-s1.cloudhub.io/api/payment',
              'headers': {
                'transaction_id': 'asdasd',
                'client_id': '918e4acddf60379f8ef62a1a07ee4a14d807ab7e',
                'client_secret': 'e448ec974f91c73a23cf1d672b8ba548b34ec182',
                'channel_id': 'MOB',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "orderId": String(transaction_id),
                "orderAmount": Number(amount),
                "orderCurrency": "INR",
              
                "customerDetails": {
                  "customerId": sfid,
                  "customerEmail": cust_email,
                  "customerPhone": cust_mobile,
                  "customerBankAccountNumber": "1518121112",
                  "customerBankIfsc": "CITI0000001"	
                },
                "orderMeta": {
                  "returnUrl": return_url?`${return_url}?order_id={order_id}&order_token={order_token}`:'',
                  "notifyUrl": "https://b8af79f41056.eu.ngrok.io/webhook.php"
                },
                "orderExpiryTime": `${getdate}T11:05:52+05:30`,
                "orderNote": "Test order",
                "orderTags": {
                  "additionalProp": "string"
                },
                "paymentMethod": {
                  "netbanking": {
                          "channel": "link",
                          "netbankingBankCode": 3333, //Number(bank_code)
                      }
                }	
              }
              )
            };
            request(options, function (error, response) {
              if(error)
              {
                reject({status:"error", message:error, request: JSON.parse(options.body)});
              }else{
                const getData = JSON.parse(response.body);
                if(getData && getData.cfPaymentId !==undefined)
                {
                  resolve({status: "success", message: 'Success', data: getData, order_id: String(transaction_id)})
                }else{
                  resolve({status: "error", message: 'Faild', data: getData, request: JSON.parse(options.body) })
                }
              }
           });
        
    } catch (error) {
        return{  status:"error", message: error.message ? error.message : error };
    }
  });
}

export async function upiCollectRequest(givenData) {
    return  new Promise(async (resolve, reject) => {
        try {
            const { upi_id, cust_mobile, cust_email, amount, sfid, return_url } = givenData
            const channel_id = process.env.MOB_CHANNEL_ID;
            const client_id = process.env.MOB_CLIENT_ID;
            const client_secret = process.env.MOB_CLIENT_SECRET;
            const redirect_url = process.env.CASHFREE_REDIRECT_URL;
            const transaction_id = "edz_"+Math.floor(100000 + Math.random() * 900000);
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            const getdate = await formatDate(tomorrow);
            var options = {
                'method': 'POST',
                'url': 'http://s-edvnz-payment-api.sg-s1.cloudhub.io/api/payment',
                'headers': {
                  'transaction_id': 'asdasd',
                  'client_id': '918e4acddf60379f8ef62a1a07ee4a14d807ab7e',
                  'client_secret': 'e448ec974f91c73a23cf1d672b8ba548b34ec182',
                  'channel_id': 'MOB',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "orderId": String(transaction_id),
                  "orderAmount": Number(amount),
                  "orderCurrency": "INR",
                  "customerDetails": {
                    "customerId": sfid, /* "00171000007nTOHAA2", */
                    "customerEmail":  String(cust_email),
                    "customerPhone": String(cust_mobile),
                    "customerBankAccountNumber": "1518121112",
                    "customerBankIfsc": "CITI0000001"
                  },
                  "orderMeta": {
                    "returnUrl": return_url?`${return_url}?order_id={order_id}&order_token={order_token}`:'',
                    "notifyUrl": "https://b8af79f41056.eu.ngrok.io/webhook.php",
                    "paymentMethods": "upi"
                  },
                  "orderExpiryTime": `${getdate}T11:05:52+05:30`,
                  "orderNote": "Test order",
                  "orderTags": {
                    "additionalProp": "string"
                  },
                  "paymentMethod": {
                    "upi": {
                      "authorization": {
                        "startTime": "2022-09-21T12:34:34Z",
                        "approveBy": "2022-07-02T10:20:12+05:30",
                        "endTime": "2022-10-22T12:34:34Z"
                      },
                      "channel": "collect",
                      "upiId": String(upi_id),
                      "authorizeOnly": false
                    }
                  }
                })
              
              };
              request(options, function (error, response) {
                if(error)
                reject({status:"error", message:error, request: JSON.parse(options.body)});
                resolve({status: "success", message: 'Success', data: JSON.parse(response.body), order_id: String(transaction_id) })
             });
        } catch (error) {
            resolve({  status:"error", message: error.message ? error.message : error });
        }
    });
}

export async function appRequest(givenData) {
    return  new Promise(async (resolve, reject) => {
    try {
            const { return_url, cust_mobile, cust_email, amount, sfid, provider, phone } = givenData
            const channel_id = process.env.MOB_CHANNEL_ID;
            const client_id = process.env.MOB_CLIENT_ID;
            const client_secret = process.env.MOB_CLIENT_SECRET;
            const redirect_url = process.env.CASHFREE_REDIRECT_URL;
            const transaction_id = Math.floor(100000 + Math.random() * 900000);
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            const getdate = await formatDate(tomorrow);
            var options = {
                'method': 'POST',
                'url': 'http://s-edvnz-payment-api.sg-s1.cloudhub.io/api/payment',
                'headers': {
                  'client_id': '918e4acddf60379f8ef62a1a07ee4a14d807ab7e',
                  'client_secret': 'e448ec974f91c73a23cf1d672b8ba548b34ec182',
                  'channel_id': 'MOB',
                  'transaction_id': 'asdasd',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "orderId": String(transaction_id),
                  "orderAmount": Number(amount),
                  "orderCurrency": "INR",
                  "customerDetails": {
                    "customerId": sfid,
                    "customerEmail": cust_email,
                    "customerPhone": cust_mobile,
                    "customerBankAccountNumber": "1518121112",
                    "customerBankIfsc": "CITI0000001"
                  },
                  "orderMeta": {
                    "returnUrl": return_url?`${return_url}?order_id={order_id}&order_token={order_token}`:'',
                    "notifyUrl": "https://b8af79f41056.eu.ngrok.io/webhook.php",
                    "paymentMethods": "app"
                  },
                  "orderExpiryTime": `${getdate}T11:05:52+05:30`,
                  "orderNote": "Test order",
                  "orderTags": {
                    "additionalProp": "string"
                  },
                  "paymentMethod": {
                    "app": {
                      "channel":"gpay",
                      "phone": "8474090552"
                    }
                  }
                })
              
              };
              request(options, function (error, response) {
                if(error)
                reject({status:"error", message:error, request: JSON.parse(options.body)});
                resolve({status: "success", message: 'Success', data: JSON.parse(response.body), order_id: String(transaction_id), request: JSON.parse(options.body) })
             });
    } catch (error) {
       resolve({status:"error", message: error.message ? error.message : error });
    }
  });
}

export async function upiQrPay(givenData) {
    return  new Promise(async (resolve, reject) => {
    try {
          const { cust_mobile, cust_email, amount, sfid, return_url } = givenData
            const channel_id = process.env.MOB_CHANNEL_ID;
            const client_id = process.env.MOB_CLIENT_ID;
            const client_secret = process.env.MOB_CLIENT_SECRET;
            const transaction_id = Math.floor(100000 + Math.random() * 900000);
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            const getdate = await formatDate(tomorrow);
            var options = {
                'method': 'POST',
                'url': 'http://s-edvnz-payment-api.sg-s1.cloudhub.io/api/payment',
                'headers': {
                  'client_id': '918e4acddf60379f8ef62a1a07ee4a14d807ab7e',
                  'client_secret': 'e448ec974f91c73a23cf1d672b8ba548b34ec182',
                  'channel_id': 'MOB',
                  'transaction_id': 'asdasd',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "orderId":String(transaction_id),
                  "orderAmount": Number(amount),
                  "orderCurrency": "INR",
                  "customerDetails": {
                    "customerId": sfid,
                    "customerEmail": cust_email,
                    "customerPhone": cust_mobile,
                    "customerBankAccountNumber": "1518121112",
                    "customerBankIfsc": "CITI0000001"
                  },
                  "orderMeta": {
                    "returnUrl": return_url?`${return_url}?order_id={order_id}&order_token={order_token}`:'',
                    "notifyUrl": "https://b8af79f41056.eu.ngrok.io/webhook.php",
                    "paymentMethods": "nb"
                  },
                  "orderExpiryTime": `${getdate}T11:05:52+05:30`,
                  "orderNote": "Test order",
                  "orderTags": {
                    "additionalProp": "string"
                  },
                  "paymentMethod": {
                    "upi": {
                      "channel": "qrcode"
                    }
                  }
                })
              
              };

             request(options, function (error, response) {
                if(error)
                reject({status:"error", message: error, request: JSON.parse(options.body), data: JSON.parse(response.body),});
                resolve({status: "success", message: 'Success', data: JSON.parse(response.body), order_id: String(transaction_id), request: JSON.parse(options.body) })
             });
    } catch (error) {
        resolve({  status:"error", message: error.message ? error.message : error });
    }
  });
}

export async function generateToken(givenData) {
    try {
            const { order_id, order_amount } = givenData
            const app_id = process.env.CLIENT_CASHFREE_APP_ID;
            const secret_key = process.env.CLIENT_CASHFREE_APP_SECRET;
            const headers = new Headers();
            headers.append('x-client-secret', secret_key);
            headers.append('x-client-id', app_id);
            headers.append('x-api-version', '2022-01-01');
            headers.append('Content-Type', 'application/json');
            let data =   {
                "orderId": order_id,
                "orderAmount": order_amount,
                "orderCurrency": "INR",
            }

            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            };
            const getdata = await fetch("https://test.cashfree.com/api/v2/cftoken/order", init).then((response) => response.json())
            .then((response) => {
                return response;
            });
            console.log("Order Details", getdata);
            if(getdata && getdata.cftoken !== undefined)
            {
                return {status: "success", message: 'Success', data: getdata};
            }else{
                return {status:"error", message:getdata.message};
            }
        
        
    } catch (error) {
        return{  status:"error", message: error.message ? error.message : error };
    }
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