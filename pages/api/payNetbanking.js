import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { netBankingPay } from "./cashfree_extapi";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function payNetBanking(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return payNetBanking();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function payNetBanking() {
        const { user_sfid, amount, bank_code, return_url } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "ID is mandatory" })
        if (amount == "" || amount == undefined)
            return res.status(200).send({ status:"error", message: "Amount is mandatory" })
        if (bank_code == "" || bank_code == undefined)
            return res.status(200).send({ status:"error", message: "BankCode is mandatory" })
        if (return_url == "" || return_url == undefined)
            return res.status(200).send({ status:"error", message: "Return Url is mandatory" })
       
        try {
            const sfid = String(user_sfid);
            const accountUser = await prisma.account.findFirst({
                where: {
                    sfid: sfid
                }
            });
            if(accountUser)
            {
                    let obj = {
                        sfid: accountUser.sfid,
                        cust_email: accountUser.email__c,
                        cust_mobile: accountUser.phone,
                        bank_code: bank_code,
                        amount: amount,
                        return_url: return_url
                     }
                    const crdsPayObj = await netBankingPay(obj);
                    if(crdsPayObj.status == "success")
                    {   
                        const getObj = crdsPayObj.data;
                        const order_id = crdsPayObj.order_id;
                        let objData = {
                            payment_type: "Net banking",
                            user_sfid: accountUser.sfid,
                            order_id: order_id,
                            payment_id: String(getObj.cfPaymentId)
                        }
                        await addCards(objData);
                        return res.status(200).json(crdsPayObj)
                    }else{
                        return res.status(200).json(crdsPayObj)
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

