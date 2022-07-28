// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'
import { generateToken } from "./cashfree_extapi";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
 )
export default async function cashfreeAuth(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return cashfreeAuth();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function cashfreeAuth() {
        const { order_id, order_amount } = req.body;
        if (order_id == "" || order_id == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "Order ID Is required" })
        if (order_amount == "" || order_amount == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "Order Amount Is required" })
        try {
                let data = { 
                    order_id: order_id,
                    order_amount:order_amount
                }
                const getData = await generateToken(data);
                res.status(200).send(getData)
               
            } catch (error) {
                res.status(200).send({ status:"error", message: error.message ? error.message : error })
            }
        }
}

