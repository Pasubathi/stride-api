import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getTopBrand(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getTopBrand();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getTopBrand() {
        try {
            const { category } = req.body;
                let fetchData;
                if(category)
                {
                    const category_name = String(category);
                    const catDet = await prisma.product_category__c.findFirst({
                        where: {
                            name: category_name
                        }
                    });
                    fetchData = await prisma.product2.groupBy({
                        by: ['product_subcategory__c'],
                        where:{
                            product_category_lu__c: catDet?catDet.sfid:'none-cat',
                            product_subcategory__c: {
                                notIn: ['']
                            }
                        }
                    });
                }else{
                    fetchData = await prisma.product2.groupBy({
                        by: ['product_subcategory__c'],
                        where:{
                            product_subcategory__c: {
                                notIn: ['']
                            }
                        }
                    });
                }
                if(fetchData)
                {
                    let proData = [];
                    await Promise.all(fetchData.map(async element => {
                        let conObj = {
                            product_subcategory__c: element.product_subcategory__c,
                        }
                        if(element && element.product_category_lu__c)
                        {
                            conObj.product_category_lu__c = element.product_category_lu__c
                        }
                        const proDet = await prisma.product2.findFirst({
                            where: conObj,
                            orderBy:{
                                id: 'desc'
                            }
                        });
                        if(proDet)
                        {
                            let catDet;
                            let subCatDet;
                            let brandDet;
                            if(proDet && proDet.product_brand__c)
                            {
                                brandDet = await prisma.product_brand__c.findFirst({
                                    where: {
                                        sfid: proDet.product_brand__c
                                    }
                                });
                            }
                            if(proDet && proDet.product_category_lu__c)
                            {
                                catDet = await prisma.product_category__c.findFirst({
                                    where: {
                                        sfid: proDet.product_category_lu__c
                                    }
                                });
                            }
                            if(proDet && proDet.product_subcategory__c)
                            {
                                subCatDet = await prisma.product_subcategory__c.findFirst({
                                    where: {
                                        sfid: proDet.product_subcategory__c
                                    }
                                });
                            }
                            const getImg = await prisma.contentversion.findFirst({
                                where:{
                                    firstpublishlocationid: proDet.sfid
                                },
                                orderBy: {
                                    id: 'asc',
                                },
                            });
                            let rowData = {
                                id: proDet.id,
                                name: proDet.name,
                                price__c: proDet.price__c,
                                mrp__c: proDet.mrp__c,
                                sfid: proDet.sfid,
                                image_url__c: proDet.image_url__c,
                                brand_image__c: brandDet && brandDet.icon__c?brandDet.icon__c:'',
                                brand__c: brandDet && brandDet.name?brandDet.name:'',
                                product_sub_category__c: subCatDet && subCatDet.name?subCatDet.name:'',
                                product_category__c: catDet && catDet.name?catDet.name:'',
                            }
                            proData.push(rowData);
                        }
                    }));
                    return res.status(200).json(proData)
                } else {
                    return res.status(400).json({ responseCode: 400, message: "Record not found" })
                }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}