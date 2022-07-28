import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { d2c_bureaucheck } from "./mulesoft_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function paymentUpdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return paymentUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function paymentUpdate() {
        const { order_id, order_token } = req.body;
        if (order_token == "" || order_token == undefined)
            return res.status(200).send({ status:"error", message: "Order token is mandatory" })
        if (order_id == "" || order_id == undefined)
            return res.status(200).send({ status:"error", message: "Order id is mandatory" })
        try {
            const orderId = String(order_id);
            const orderToken = String(order_token);
            const paymentDet = await prisma.account_payments__c.findFirst({
                where: {
                    order_id: orderId
                }
            });
            if(paymentDet)
            {
                await prisma.account_payments__c.update({
                    where: {
                        order_id: orderId
                    },
                    data: {
                        order_token: orderToken,
                        status: true
                    },
                });
                return res.status(200).json({ status:"success", message: "Success" })
               
            }else{
                return res.status(200).json({ status:"error", message: "Detail is not found" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

