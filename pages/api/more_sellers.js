import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function moreSellers(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return moreSellers();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function moreSellers() {
        const { product_sfid } = req.body;
        if (product_sfid == "" || product_sfid == undefined)
            return res.status(200).send({ status:"error", message: "Product Id is mandatory" })
        try {
            const productId = String(product_sfid);
            const sellerDet = await prisma.merchant_product__c.findMany({
                where: {
                    productid__c: productId
                },
                include:{
                    product2: true,
                }
            });
            let sellerObj = [];
            await Promise.all(sellerDet.map(async element => {
                const productDet = element && element.product2?element.product2:null;
                const userSfid   = element && element.accountid__c?element.accountid__c:null;
                let rowObj = {
                    amount: productDet && productDet.mrp__c?productDet.mrp__c:0
                }
                if(userSfid)
                {
                    const accountDet = await prisma.account.findFirst({
                        where: {
                            sfid: userSfid,
                        }
                    });
                    rowObj.seller_name = accountDet && accountDet.name?accountDet.name:'';
                }
                sellerObj.push(rowObj);
            }));
            return res.status(200).json({ status:"success", message: "Success", data: sellerObj })
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

