import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function productStatusUpdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return productStatusUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function productStatusUpdate() {
        const { product_sfid, status } = req.body;
        if (product_sfid == "" || product_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Product Sfid is mandatory" })
        try {
            const sfid = String(product_sfid);
            const productDet = await prisma.product2.findFirst({
                where: {
                    sfid: sfid
                }
            });
           
            if(productDet)
            {
                await prisma.product2.update({
                    where: {
                        sfid: productDet.sfid
                    },
                    data: {
                        isactive: status?true:false,
                    },
                });
                return res.status(200).json({ status:"success", message: "Updated successfully"})
            }else{
                 return res.status(200).json({ status:"error",message: "Product not found!." })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}