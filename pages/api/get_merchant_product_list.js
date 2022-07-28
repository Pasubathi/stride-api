
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
import { GET_DOCUMENT_BY_ID, SALES_FORCE } from "./api";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getMerchatProductsList(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getMerchatProductsList();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getMerchatProductsList() { 
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
            console.log("accountDet", accountDet);
            if(accountDet)
            {
                let fetchData = await prisma.merchant_product__c.groupBy({
                    by: ['productid__c', 'id'],
                    where:{
                        accountid__c: accountDet.sfid,
                        NOT: [
                                { productid__c: null },
                          ],
                    },
                    orderBy: { id: 'desc' },
                });
                if(fetchData)
                {
                    const selectedProducts = await getProductsOnly(fetchData);
                    const getProductsData = await prisma.product2.findMany({
                        select:{
                            id: true,
                            name: true,
                            price__c: true,
                            mrp__c: true,
                         //   brand__c: true,
                            product_category__c: true,
                            image_url__c: true,
                            sfid: true,
                        },
                        where: {
                            NOT: {
                                sfid: {
                                    in: selectedProducts,
                                }
                            }
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    return res.status(200).json(getProductsData)
                } else {
                    return res.status(200).json([])
                }
            }else{
                return res.status(200).json({ status:"error", message: "Detail is not found" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

async function getProductsOnly(getData) {
    return new Promise(async (resolve, reject) => {
        try {
            let productData = ["0"];
            await Promise.all(getData.map(async element => {
                productData.push(element.productid__c);
            }));
            resolve(productData)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

