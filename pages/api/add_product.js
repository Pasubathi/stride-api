
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function createProduct(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return createProduct();
        default:
            return res.status(500).send({ responseCode: 500, message: `Method ${req.method} Not Allowed` })
    }
    async function createProduct() {
        try {
            const { category, sub_category, brand_name, product_name, amount, merchant_id } = req.body;
           
            if (merchant_id == "" || merchant_id == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Id is mandatory" })
           
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: merchant_id,
                }
            });
           
            if(accountDet)
            {
                const createAccount = await prisma.product2.create({
                    data: {
                        name: product_name,
                        product_category__c: category,
                        product_sub_category__c: sub_category,
                        price__c: amount,
                        mrp__c: amount,
                      //  brand__c: brand_name,
                    },
                });
                let isSfid = createAccount.sfid;
                while(isSfid == null)
                {
                    const ac = await prisma.product2.findFirst({
                        where: {
                            id: createAccount.id
                        }
                    });
                    isSfid = ac.sfid;
                }

                const merchatPro = await prisma.merchant_product__c.create({
                    data:{
                        productid__c: isSfid,
                        createdbyid: merchant_id,
                        accountid__c: merchant_id,
                        loan_amount__c: amount,
                    }
                });
              return res.status(200).send({ responseCode: 200, status:"success",  message: "Product Created Successfully", product: createAccount, data: merchatPro})
                
            }else{
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Details not found", })
            }
            
        } catch (error) {
            res.status(500).send({ responseCode: 500, message: error.message ? error.message : error })
        }
    }
}
