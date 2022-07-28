import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { appRequest } from "./cashfree_extapi";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function payWallets(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return payWallets();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function payWallets() {
        const { id, amount, provider, mobile, return_url } = req.body;
        if (id == "" || id == undefined)
            return res.status(200).send({ status:"error", message: "ID is mandatory" })
        if (amount == "" || amount == undefined)
            return res.status(200).send({ status:"error", message: "Amount is mandatory" })
        if (provider == "" || provider == undefined)
            return res.status(200).send({ status:"error", message: "Provider is mandatory" })
        if (mobile == "" || mobile == undefined)
            return res.status(200).send({ status:"error", message: "Mobile is mandatory" })
        if (return_url == "" || return_url == undefined)
            return res.status(200).send({ status:"error", message: "Return Url is mandatory" })
       
        try {
            let cardId = Number(id);
            const accountUser = await prisma.account.findFirst({
                where: {
                    id: cardId
                }
            });
            if(accountUser)
            {
                    let obj = {
                        sfid: accountUser.sfid,
                        cust_email: accountUser.email__c,
                        cust_mobile: accountUser.phone,
                        amount: amount,
                        provider: provider,
                        phone: mobile,
                        return_url: return_url
                     }
                    const crdsPayObj = await appRequest(obj);
                    if(crdsPayObj && crdsPayObj.data !==undefined && crdsPayObj.data.cfPaymentId !==undefined)
                    {   
                        const getObj = crdsPayObj.data;
                        const order_id = crdsPayObj.order_id;
                        let obj = {
                            payment_type: "Wallet",
                            sfid: accountUser.sfid,
                            order_id: order_id,
                            payment_id: String(getObj.cfPaymentId)
                        }
                        await addCards(obj);
                        return res.status(200).json({status:"success", data: crdsPayObj.data, order_id: order_id})
                    }else{
                        return res.status(200).json({status:"error", message: crdsPayObj && crdsPayObj.status=="error"?crdsPayObj.message:"Something Went wrong", request: crdsPayObj.request, data:crdsPayObj.data})
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

