import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getTopProducts(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return getTopProducts();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getTopProducts() {
        try {
            const query = req.query;
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const startIndex = (page - 1) * limit;
            let fetchData = await prisma.deals__c.findMany({
                skip: startIndex,
                take: limit,
                include: {
                    product2: true
                },
                orderBy: {
                  id: 'desc',
                },
            });
            if (fetchData) {
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
                        let brandDet;
                        if(producDet.product_brand__c)
                        {
                            brandDet = await prisma.product_brand__c.findFirst({
                                where: {
                                    sfid: producDet.product_brand__c
                                }
                            });
                        }
                        let rowData = {
                            id: producDet.id,
                            name: producDet.name,
                            price__c: producDet.price__c,
                            mrp__c: producDet.mrp__c,
                            sfid: producDet.sfid,
                            isactive: producDet.isactive,
                            product_category__c: catDet && catDet.name?catDet.name:'',
                            product_sub_category__c: subCatDet && subCatDet.name?subCatDet.name:'',
                            loan_amount__c: element.loan_amount__c,
                            image_url__c: producDet.image_url__c,
                            brand_name: brandDet && brandDet.name?brandDet.name:'',
                            brand_icon: brandDet && brandDet.icon__c?brandDet.icon__c:'',
                        }
                        proData.push(rowData);
                    }
                }));
                return res.status(200).json(proData)
            } else {
                return res.status(400).json({ responseCode: 400, message: "Detail is not updated" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}