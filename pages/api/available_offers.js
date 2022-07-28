import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function availableOffer(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return availableOffer();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function availableOffer() {
        const { product_sfid } = req.body;
        if (product_sfid == "" || product_sfid == undefined)
            return res.status(200).send({ status:"error", message: "Product Id is mandatory" })
        try {
            const productId = String(product_sfid);
            const offerDet = await prisma.deals__c.findMany({
                where: {
                    productid__c: productId
                },
                include:{
                    product2: true,
                }
            });
            return res.status(200).json({ status:"success", message: "Success", data: offerDet })
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

