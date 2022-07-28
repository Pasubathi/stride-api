
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function createMerchantProduct(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return createMerchantProduct();
        default:
            return res.status(500).send({ responseCode: 500, message: `Method ${req.method} Not Allowed` })
    }
    async function createMerchantProduct() {
        try {
            const { product_id, price, merchant_id } = req.body;
            if (product_id == "" || product_id == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Product is mandatory" })
            if (price == "" || price == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Price is mandatory" })
            if (merchant_id == "" || merchant_id == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Id is mandatory" })
           
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: merchant_id,
                }
            });
           
            if(accountDet)
            {
                const amount = Number(price);
                let obj = { 
                    amount: amount,
                    product_id: product_id,
                    merchant_id: merchant_id,
                }
                const productMerchant = await createMerchant(obj);
                return res.status(200).send({ responseCode: 200, status:"success",  message: "Product Added Successfully", data: productMerchant})          
            }else{
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Details not found", })
            }
            
        } catch (error) {
            res.status(500).send({ responseCode: 500, message: error.message ? error.message : error })
        }
    }
}

async function createMerchant(getData)
{
    const { amount, product_id, merchant_id } = getData
    return new Promise(async (resolve, reject) => {
        try {
            const merchatPro = await prisma.merchant_product__c.create({
                data:{
                    productid__c: product_id,
                    createdbyid: merchant_id,
                    accountid__c: merchant_id,
                    loan_amount__c: amount,
                }
            });
            resolve(merchatPro);
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    });
}


