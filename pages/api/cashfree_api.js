import { prisma } from "./_base";
import { CASHFREE_URL } from "./api";

export async function createOrder(givenData) {
    try {
            const { sfid, email, phone, amount} = givenData
            const app_id = process.env.USER_CASHFREE_APP_ID;
            const secret_key = process.env.USER_CASHFREE_SECRET_KEY;
            const transaction_id = Math.floor(100000 + Math.random() * 900000);
            const headers = new Headers();
            headers.append('x-client-secret', secret_key);
            headers.append('x-client-id', app_id);
            headers.append('x-api-version', '2022-01-01');
            headers.append('Content-Type', 'application/json');
            console.log("test");
            const token = await generateString(8);
            let data =   {
                "order_id": `order_${transaction_id}`,
                "order_amount": amount,
                "order_currency": "INR",
                "customer_details": {
                    "customer_id": sfid,
                    "customer_email": email,
                    "customer_phone": phone
                },
               /*  'order_meta': { 
                    "return_url": `https://eduvanz-web.herokuapp.com?order_id=order_${transaction_id}&order_token=${token}`,
                    "payment_methods": null
                } */
              }

            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            };
            const getdata = await fetch(CASHFREE_URL+'orders', init).then((response) => response.json())
            .then((response) => {
                return response;
            });
            console.log("Order Details", getdata);
            if(getdata.cf_order_id !== undefined)
            {
                return {status: "success", message: 'Success', data: getdata};
            }else{
                return {status:"error", message:getdata.message};
            }
        
        
    } catch (error) {
        return{  status:"error", message: error.message ? error.message : error };
    }
}

export async function cardsPay(givenData) {
    try {
            const { order_id, token, card_number, card_name, expiry_mm, expiry_yy, card_cvv} = givenData
            const headers = new Headers();
            headers.append('x-api-version', '2022-01-01');
            headers.append('Content-Type', 'application/json');
            
            let data =   {
                "order_token": token,
                "payment_method" : {
                    "card" : { 
                        "channel": "link",
                        "card_number": card_number,
                        "card_holder_name": card_name,
                        "card_expiry_mm" : expiry_mm,
                        "card_expiry_yy" : expiry_yy,
                        "card_cvv" : card_cvv                      
                    }
                },
                'order_meta': { return_url: `http://localhost:8122/process_return?cf_id=${order_id}&cf_token=${token}` }
            }

            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            };
            const getdata = await fetch(CASHFREE_URL+'orders/pay', init).then((response) => response.json())
            .then((response) => {
                return response;
            });
            console.log("Card pay", getdata);
            if(getdata.cf_payment_id !== undefined)
            {
                return {status: "success", message: 'Success', data: getdata};
            }else{
                return {status:"error", message:getdata.message};
            }
        
        
    } catch (error) {
        return{  status:"error", message: error.message ? error.message : error };
    }
}

export async function cardVaultPay(givenData) {
    try {
            const { token, card_alias, card_name, card_cvv} = givenData
            const headers = new Headers();
            headers.append('x-api-version', '2022-01-01');
            headers.append('Content-Type', 'application/json');
            
            let data =   {
                "order_token": token,
                "payment_method": {
                    "card": {
                        "channel": "link",
                        "card_holder_name": card_name, 
                        "card_cvv": card_cvv,
                        "card_alias": card_alias
                    }
                }
            }

            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            };
            const getdata = await fetch(CASHFREE_URL+'orders/pay', init).then((response) => response.json())
            .then((response) => {
                return response;
            });
            console.log("Card Vault Pay", getdata);
            if(getdata.cf_payment_id !== undefined)
            {
                return {status: "success", message: 'Success', data: getdata};
            }else{
                return {status:"error", message:getdata.message};
            }
        
        
    } catch (error) {
        return{  status:"error", message: error.message ? error.message : error };
    }
}

export async function upiLinkPay(givenData) {
    try {
            const { token } = givenData
            const headers = new Headers();
            headers.append('x-api-version', '2022-01-01');
            headers.append('Content-Type', 'application/json');
            
            let data =   {
                "order_token": token,
                "payment_method" : {
                    "upi" : { 
                        "channel": "link"
                    }
                }
            }

            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            };
            const getdata = await fetch(CASHFREE_URL+'orders/pay', init).then((response) => response.json())
            .then((response) => {
                return response;
            });
            console.log("Upi Link Pay", getdata);
            if(getdata.cf_payment_id !== undefined)
            {
                return {status: "success", message: 'Success', data: getdata};
            }else{
                return {status:"error", message:getdata.message};
            }
        
        
    } catch (error) {
        return{  status:"error", message: error.message ? error.message : error };
    }
}

export async function upiQrPay(givenData) {
    try {
            const { token } = givenData
            const headers = new Headers();
            headers.append('x-api-version', '2022-01-01');
            headers.append('Content-Type', 'application/json');
            
            let data =   {
                "order_token": token,
                "payment_method" : {
                    "upi" : { 
                        "channel": "qrcode"
                    }
                }
            }

            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            };
            const getdata = await fetch(CASHFREE_URL+'orders/pay', init).then((response) => response.json())
            .then((response) => {
                return response;
            });
            console.log("Upi Qr Pay", getdata);
            if(getdata.cf_payment_id !== undefined)
            {
                return {status: "success", message: 'Success', data: getdata};
            }else{
                return {status:"error", message:getdata.message};
            }
        
        
    } catch (error) {
        return{  status:"error", message: error.message ? error.message : error };
    }
}

export async function upiCollectRequest(givenData) {
    try {
            const { token, upi_id } = givenData
            const headers = new Headers();
            headers.append('x-api-version', '2022-01-01');
            headers.append('Content-Type', 'application/json');
            
            let data =   {
                "order_token": token,
                "payment_method" : {
                    "upi" : { 
                        "channel": "collect",
                        "upi_id": upi_id
                    }
                }
            }

            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            };
            const getdata = await fetch(CASHFREE_URL+'orders/pay', init).then((response) => response.json())
            .then((response) => {
                return response;
            });
            console.log("Upi Collect Pay", getdata);
            if(getdata.cf_payment_id !== undefined)
            {
                return {status: "success", message: 'Success', data: getdata};
            }else{
                return {status:"error", message:getdata.message};
            }
        
        
    } catch (error) {
        return{  status:"error", message: error.message ? error.message : error };
    }
}

export async function netBankingPay(givenData) {
    try {
            const { token, bank_code } = givenData
            const headers = new Headers();
            headers.append('x-api-version', '2022-01-01');
            headers.append('Content-Type', 'application/json');
            
            let data =   {
                "order_token": token,
                "payment_method": {
                    "netbanking": {
                        "channel": "link",
                        "netbanking_bank_code": bank_code
                    }
                }
            }

            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            };
            const getdata = await fetch(CASHFREE_URL+'orders/pay', init).then((response) => response.json())
            .then((response) => {
                return response;
            });
            console.log("Upi Netbank Pay", getdata);
            if(getdata.cf_payment_id !== undefined)
            {
                return {status: "success", message: 'Success', data: getdata};
            }else{
                return {status:"error", message:getdata.message};
            }
        
        
    } catch (error) {
        return{  status:"error", message: error.message ? error.message : error };
    }
}

export async function appRequest(givenData) {
    try {
            const { token, phone, provider } = givenData
            const headers = new Headers();
            headers.append('x-api-version', '2022-01-01');
            headers.append('Content-Type', 'application/json');
            
            let data =   {
                "order_token": token,
                "payment_method": {
                    "app": {
                    "channel": "link",
                    "provider": provider, // gpay, phonepe, ola, paytm, amazon, airtel, freecharge, mobikwik, jio
                    "phone": phone
                    }
                }
            }

            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            };
            const getdata = await fetch(CASHFREE_URL+'orders/pay', init).then((response) => response.json())
            .then((response) => {
                return response;
            });
            console.log("Upi App Pay", getdata);
            if(getdata.cf_payment_id !== undefined)
            {
                return {status: "success", message: 'Success', data: getdata};
            }else{
                return {status:"error", message:getdata.message};
            }
        
        
    } catch (error) {
        return{  status:"error", message: error.message ? error.message : error };
    }
}

// program to generate random strings
function generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

