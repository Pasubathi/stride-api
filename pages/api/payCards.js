import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { cardsPay } from "./cashfree_extapi";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function payCards(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return payCards();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function payCards() {
        const { user_sfid, card_id, cvv, amount, return_url } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "ID is mandatory" })
        if (card_id == "" || card_id == undefined)
            return res.status(200).send({ status:"error", message: "Card ID is mandatory" })
        if (cvv == "" || cvv == undefined)
            return res.status(200).send({ status:"error", message: "CVV is mandatory" })
        if (amount == "" || amount == undefined)
            return res.status(200).send({ status:"error", message: "Amount is mandatory" })
        if (return_url == "" || return_url == undefined)
            return res.status(200).send({ status:"error", message: "Return Url is mandatory" })
        try {
            let cardId    = Number(card_id);
            let sfid      = String(user_sfid);
            const accountUser = await prisma.account.findFirst({
                where: {
                    sfid: sfid
                }
            });
            if(accountUser)
            {
                const cardDet = await prisma.account_cards__c.findFirst({
                    where: {
                        id: cardId
                    }
                });
                if(cardDet && cardDet.cvv == cvv)
                {
                    let expiry =  cardDet.card_expiry__c;
                    let arrobj = expiry.toString().split('');
                    let obj = {
                        cust_sfid: accountUser.sfid,
                        cust_email: accountUser.email__c,
                        cust_mobile: accountUser.phone,
                        amount: amount,
                        card_number: cardDet.card_number__c,
                        card_name: cardDet.card_name__c,
                        expiry_mm: `${arrobj[0]}${arrobj[1]}`,
                        expiry_yy: `${arrobj[2]}${arrobj[3]}`,
                        card_cvv: cardDet.cvv,
                        return_url: return_url
                     }
                    const getOrder = await cardsPay(obj);
                    if(getOrder && getOrder.status =="success")
                    {
                        const getObj = getOrder.data;
                        const order_id = getOrder.order_id;
                        let obj = {
                            card_id: Number(cardDet.id),
                            payment_type: "Card",
                            user_sfid: accountUser.sfid,
                            order_id: order_id,
                            payment_id: String(getObj.cfPaymentId)
                        }
                        await addCards(obj);
                        return res.status(200).json(getOrder)
                    }else{
                        return res.status(200).json(getOrder)
                    }
                }else{
                    return res.status(200).json({ status:"error", message: "Invalid cvv" })
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

