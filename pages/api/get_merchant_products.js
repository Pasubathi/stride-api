
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getMerchantProducts(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getMerchantProducts();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getMerchantProducts() {
        const { merchant_id } = req.body
        if(merchant_id =="" || merchant_id ==undefined)
        return res.status(200).send({ status:"error" , message: "Merchant id is mandatory " })
       
        try {
            const cust_id = Number(merchant_id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id
                }
            });
            if(accountDet)
            {
                let fetchData = await prisma.merchant_product__c.findMany({
                    where:{
                        accountid__c: accountDet.sfid
                    },
                    include: {
                        product2: true
                    },
                });
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

