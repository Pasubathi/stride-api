
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getMerchantProductsByStatus(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getMerchantProducts();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getMerchantProducts() {
        const { merchant_id, status } = req.body
        if(merchant_id =="" || merchant_id ==undefined)
            return res.status(200).send({ status:"error" , message: "Merchant id is mandatory " })
        if(status =="" || status ==undefined)
            return res.status(200).send({ status:"error" , message: "Status is mandatory " })
       
        try {
            const cust_id = Number(merchant_id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id
                }
            });
            if(accountDet)
            {
                let fetchData = [];
                if(status =="active")
                {
                    fetchData = await prisma.merchant_product__c.findMany({
                        where:{
                            accountid__c: accountDet.sfid,
                            NOT: {
                                product2: {
                                    isactive: true
                                },
                            }
                            
                        },
                    });
                    /* 
                    console.log("active Query--------->", `SELECT product2.* from merchant_product__c LEFT JOIN product2 ON product2.sfid = merchant_product__c.productid__c WHERE merchant_product__c.accountid__c = '${accountDet.sfid}' AND product2.isactive = 'true' ;`);
                     fetchData = await prisma.$queryRaw`SELECT product2.* from merchant_product__c LEFT JOIN product2 ON product2.sfid = merchant_product__c.productid__c WHERE merchant_product__c.accountid__c = '${accountDet.sfid}' AND product2.isactive = 'true' ;`;
                    */
                   console.log("active fetchData--------->", fetchData); 
                }else if(status =="inactive")
                {
                    fetchData = await prisma.merchant_product__c.findMany({
                        where:{
                            accountid__c: accountDet.sfid,
                        },
                        include:{
                            product2: {
                                where: {
                                    isactive: true,
                                  },
                            },
                        },
                    });
                   /*  console.log("active Query--------->", `SELECT product2.* from merchant_product__c LEFT JOIN product2 ON product2.sfid = merchant_product__c.productid__c WHERE merchant_product__c.accountid__c = '${accountDet.sfid}' AND product2.isactive = 'false' ;`);
                    fetchData = await prisma.$queryRaw`SELECT product2.* from merchant_product__c LEFT JOIN product2  ON product2.sfid = merchant_product__c.productid__c WHERE merchant_product__c.accountid__c = '${accountDet.sfid}' AND product2.isactive = 'false' ;`; */
                    console.log("inactive fetchData--------->", fetchData);
                }else if(status =="offer")
                {
                    fetchData = await prisma.$queryRaw`SELECT p.* from deals__c d LEFT JOIN product2 p ON p.sfid = d.productid__c WHERE d.merchantid__c = '${accountDet.sfid}';`;
                    console.log("offer fetchData--------->", fetchData);

                }else{
                    return res.status(200).json({ status: 'error', message: "Status is not found" })
                }
                
                let proData = [];
                await Promise.all(fetchData.map(async element => {
                    if(element.product2)
                    {
                        const producDet = element.product2;
                        const catDet = await prisma.product_category__c.findFirst({
                            where: {
                                sfid: producDet.product_category_lu__c
                            }
                        });
                        const subCatDet = await prisma.product_subcategory__c.findFirst({
                            where: {
                                sfid: producDet.product_subcategory__c
                            }
                        });
                        let rowData = {
                            id: producDet.id,
                            name: producDet.name,
                            price__c: producDet.price__c,
                            mrp__c: producDet.mrp__c,
                            sfid: producDet.sfid,
                            isactive: producDet.isactive,
                            product_category__c: catDet?catDet.name:'',
                            product_sub_category__c: subCatDet?subCatDet.name:'',
                            loan_amount__c: element.loan_amount__c,
                        }
                        proData.push(rowData);
                    }
                }));
                return res.status(200).json(proData)
            } else {
                return res.status(200).json({ status: 'error', message: "Detail is not found" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

