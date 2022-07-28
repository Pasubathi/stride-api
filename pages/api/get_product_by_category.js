
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getProductsByCategory(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getProductsByCategory();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getProductsByCategory() {
        const { category, page, limit, user_sfid, sort_order, min_price, max_price, brands, color, processor, ram, size } = req.body;
        if (category == "" || category == undefined)
        return res.status(200).send({ status:"error", message: "Category is mandatory" })
        
        try {
            const cat = String(category);
            const userSfid = String(user_sfid);
            const pageNo = parseInt(page) || 1;
            const pagelimit = parseInt(limit) || 12;
            const startIndex = (pageNo - 1) * pagelimit;
            const catDet = await prisma.product_category__c.findFirst({
                where: {
                    name: cat
                }
            });
            const subCatDet = await prisma.product_subcategory__c.findFirst({
                where: {
                    name: cat
                }
            });
            if(catDet || subCatDet)
            {
                let conObj = {};
                if(catDet)
                {
                    conObj.product_category_lu__c = catDet.sfid;
                }else{
                    conObj.product_subcategory__c = subCatDet.sfid;
                }

                if(min_price && max_price && min_price !==undefined && max_price !==undefined)
                {
                    conObj.mrp__c = {
                        lte: Number(min_price),
                        gte: Number(max_price),
                    }
                }

                if(brands && Array.isArray(brands))
                {
                    conObj.product_brand__c = { in: brands };
                }

                if(color && Array.isArray(color))
                {
                    conObj.color__c = { in: color };
                }

                if(processor && Array.isArray(processor))
                {
                    conObj.processor__c = { in: processor };
                }

                if(ram && Array.isArray(ram))
                {
                    conObj.ram__c = { in: ram };
                }

                if(size && Array.isArray(size))
                {
                    conObj.screen_size__c = { in: size };
                }

                let count = await prisma.product2.count({
                    where: conObj,
                });
                let sortOrder = {};
                if(sort_order && sort_order ==="Assending" && sort_order !==undefined)
                {
                    sortOrder.mrp__c = "asc";
                }else if(sort_order && sort_order ==="Descending" && sort_order !==undefined)
                {
                    sortOrder.mrp__c = "desc";
                }else if(sort_order && sort_order ==="Newest" && sort_order !==undefined)
                {
                    sortOrder.createddate = "desc";
                }else{
                    sortOrder.id = "desc";
                }
                let fetchData = await prisma.product2.findMany({
                    skip: startIndex,
                    take: pagelimit,
                    where: conObj,
                    orderBy: sortOrder,
                });
                if (fetchData) {
                    let proData = [];
                    let no_cost_emi__c = false;
                    let min_avi_emi__c = 0;
                    await Promise.all(fetchData.map(async element => {
                        const getEmi = await prisma.merchant_product__c.findFirst({
                            where:{
                                productid__c: element.sfid
                            },
                            orderBy: {
                                id: 'asc',
                            },
                        });
                        if(getEmi)
                        {
                            no_cost_emi__c = getEmi.no_cost_emi__c;
                            min_avi_emi__c = getEmi.min_avi_emi__c
                        }
                        let isFavorite = false;
                        if(user_sfid)
                        {
                            const favDet =  await prisma.favorite_products__c.findFirst({
                                where:{
                                    account__id: userSfid,
                                    product__id: element.sfid,
                                }
                            });
                            if(favDet)
                            {
                                isFavorite = true
                            }
                        }
                        let rowData = {
                            id: element.id,
                            name: element.name,
                            price__c: element.price__c,
                            mrp__c: element.mrp__c,
                            sfid: element.sfid,
                            no_cost_emi__c:no_cost_emi__c,
                            min_avi_emi__c:min_avi_emi__c,
                            image_url__c: element.image_url__c,
                            product_category__c: subCatDet && subCatDet.name?subCatDet.name:'',
                            product_subcategory__c: subCatDet && subCatDet.name?subCatDet.name:'',
                        }
                        proData.push(rowData);
                    }));
                    return res.status(200).json({ responseCode: 200, status: 'success', data: proData, count: count})
                } else {
                    return res.status(400).json({ responseCode: 200, status: 'error', data: fetchData, count: count})
                }
            }else{
                return res.status(200).json({ status: 'error', message: "Category not found"})
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}