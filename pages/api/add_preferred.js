import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function addPrefferedPayment(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return addPrefferedPayment();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function addPrefferedPayment() {
        const { user_sfid, payment_type, card_id, order_id, payment_id, upi_id } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "ID is mandatory" })
        if (payment_type == "" || payment_type == undefined)
            return res.status(200).send({ status:"error", message: "Payment Type is mandatory" })
        if (payment_id == "" || payment_id == undefined)
            return res.status(200).send({ status:"error", message: "Payment ID is mandatory" })
        if (order_id == "" || order_id == undefined)
            return res.status(200).send({ status:"error", message: "Order ID is mandatory" })
        if(payment_type =="Card" && (card_id == "" || card_id == undefined))
            return res.status(200).send({ status:"error", message: "Card ID is mandatory" })
        if(payment_type =="UPI" && (upi_id == "" || upi_id == undefined))
            return res.status(200).send({ status:"error", message: "Upi ID is mandatory" })
           
            try {
            const custId = String(user_sfid);
            const accountUser = await prisma.account.findFirst({
                where: {
                    sfid: custId
                }
            });
            if(accountUser)
            {
                if(payment_type =="UPI" || payment_type =="Card" || payment_type =="Net banking")
                {
                    let obj = {
                        payment_type: String(payment_type),
                        user_sfid: accountUser.sfid,
                        order_id: String(order_id),
                        payment_id: String(payment_id)
                    }
                    if(payment_type =="Card")
                    {
                        const cardDet = await prisma.account_cards__c.findFirst({
                            where: {
                                id: Number(card_id)
                            }
                        });
                        if(cardDet)
                        {
                            obj.card_id = cardDet.id
                        }else{
                            return res.status(200).json({ status:"error", message: "Card not found"})  
                        }
                    }else if(payment_type =="UPI")
                    {
                        const upiDet = await prisma.account_upi__c.findFirst({
                            where: {
                                id: Number(upi_id)
                            }
                        });
                        if(upiDet)
                        {
                            obj.upi_id = upiDet.id
                        }else{
                            return res.status(200).json({ status:"error", message: "Upi not found"})  
                        }
                    }

                    await prisma.account_payments__c.create({
                        data: obj,
                    });
                    return res.status(200).json({ status:"success", message: "Added Successfully"})
                }else{
                    return res.status(200).json({ status:"error", message: "Invalid Payment Type" })
                }
            }else{
                return res.status(200).json({ status:"error", message: "Account not found" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

