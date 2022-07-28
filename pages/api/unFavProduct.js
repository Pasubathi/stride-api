
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function unFavProducts(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return unFavProducts();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function unFavProducts() {
        const { user_id, product_id } = req.body;
        if (user_id == "" || user_id == undefined)
        return res.status(200).send({ status:"error", message: "ID is mandatory" })
        if (product_id == "" || product_id == undefined)
        return res.status(200).send({ status:"error", message: "Product is mandatory" }) 
        try {
            const productId = String(product_id);
            const cust_id = Number(user_id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id,
                }
            });
            if(accountDet)
            {
                await prisma.favorite_products__c.deleteMany({
                    where:{
                        account__id: accountDet.sfid,
                        product__id: productId,
                    }
                });
                return res.status(200).json({ status: "success", message: "Success" })
            }else{
                return res.status(200).json({ status: "error", message: "Detail not found" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

