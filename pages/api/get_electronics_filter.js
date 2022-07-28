
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getElectronicsFilter(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getElectronicsFilter();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getElectronicsFilter() {
        const { min_emi, max_emi, category, page, limit, user_sfid, sort_order, min_price, max_price, brands, color, processor, ram, size } = req.body;
        if (category == "" || category == undefined)
        return res.status(200).send({ status:"error", message: "Category is mandatory" })
        
        try {
            const catName = String(category);
            const userSfid = String(user_sfid);
            const pageNo = parseInt(page) || 1;
            const pagelimit = parseInt(limit) || 12;
            const startIndex = (pageNo - 1) * pagelimit;
            const catDet = await prisma.product_subcategory__c.findFirst({
                where: {
                    name: catName
                }
            });
            if(catDet)
            {
                let conObj = {};
                let merchentObj = {};
                conObj.product_subcategory__c = catDet.sfid;
                if(min_price && max_price && min_price !==undefined && max_price !==undefined)
                {
                    conObj.mrp__c = {
                        lt: Number(max_price),
                        gt: Number(min_price),
                    }
                }
                if(min_emi && max_emi && min_emi !==undefined && max_emi !==undefined)
                {
                    merchentObj.min_avi_emi__c = {
                        lt: Number(min_emi),
                        gt: Number(max_emi),
                    }
                }

                if(brands && Array.isArray(brands) && brands.length > 0)
                {
                    conObj.product_brand__c = { in: brands };
                }

                if(color && Array.isArray(color) && color.length > 0)
                {
                    conObj.color__c = { in: color };
                }

                if(processor && Array.isArray(processor) && processor.length > 0)
                {
                    conObj.processor__c = { in: processor };
                }

                if(ram && Array.isArray(ram) && ram.length > 0)
                {
                    conObj.ram__c = { in: ram };
                }

                if(size && Array.isArray(size) && size.length > 0)
                {
                    conObj.screen_size__c = { in: size };
                }

                /* let count = await prisma.product2.count({
                    where: conObj,
                }); */
               /*  let groupData = await prisma.merchant_product__c.aggregate({
                    _count: {
                        id:true
                    },
                    _max:{
                        min_avi_emi__c:true, 
                        loan_amount__c:true
                    },
                    _min:{
                        min_avi_emi__c:true,
                        loan_amount__c:true
                    }
                }); */
                let sortOrder = {};
                
                if(sort_order && sort_order ==="Assending" && sort_order !==undefined)
                {
                    sortOrder.mrp__c = "asc";
                }else if(sort_order && sort_order ==="Descending" && sort_order !==undefined)
                {
                    sortOrder.mrp__c = "desc";
                }else if(sort_order && sort_order ==="Newest" && sort_order !==undefined)
                {
                    sortOrder.id = "desc";
                }else{
                    sortOrder.id = "desc";
                }
               /*  let fetchData = await prisma.product2.findMany({
                    skip: startIndex,
                    take: pagelimit,
                    where: conObj,
                    orderBy: sortOrder,
                }); */
                let groupData = await prisma.merchant_product__c.aggregate({
                    where:{
                        product2:conObj
                    },
                     _count:{
                        id:true
                     },
                     _max:{
                        min_avi_emi__c:true,
                        loan_amount__c:true
                     },
                     _min:{
                        min_avi_emi__c:true,
                        loan_amount__c:true
                     }
                  });
                
                let fetchData = await prisma.merchant_product__c.findMany({
                  where:{
                    product2:conObj
                  },
                    select:{
                        id:true,
                        loan_amount__c:true,
                        min_avi_emi__c:true,
                        no_cost_emi__c:true,
                        productid__c:true,
                        product2:{
                            select:{
                                id:true,
                                sfid: true,
                                name:true,
                                description__c: true,
                                price__c:true,
                                mrp__c: true,
                                image_url__c:true,
                            },
                        }
                    },
                    orderBy:sortOrder
                });
                if (fetchData) {
                    let proData = [];
                    await Promise.all(fetchData.map(async element => {
                        const productDet = element.product2;
                        if(productDet)
                        {
                            let isFavorite = false;
                            if(user_sfid)
                            {
                                const favDet =  await prisma.favorite_products__c.findFirst({
                                    where:{
                                        account__id: userSfid,
                                        product__id: productDet.sfid,
                                    }
                                });
                                if(favDet)
                                {
                                    isFavorite = true
                                }
                            }
                            let rowData = {
                                id: productDet && productDet.id?productDet.id:'',
                                name: productDet && productDet.name?productDet.name:'',
                                description__c: productDet && productDet.description__c?productDet.description__c:'',
                                price__c: productDet && productDet.price__c?productDet.price__c:'',
                                mrp__c: element && element.loan_amount__c?element.loan_amount__c:'',
                                sfid: productDet && productDet.sfid?productDet.sfid:'',
                                image_url__c: productDet && productDet.image_url__c?productDet.image_url__c:'',
                            }
                            proData.push(rowData);
                        }
                    }));
                    return res.status(200).json({ responseCode: 200, status: 'success', data: proData, price_range: groupData})
                } else {
                    return res.status(400).json({ responseCode: 200, status: 'error', data: fetchData})
                }
            }else{
                return res.status(200).json({ status: 'error', message: "Category not found"})
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}
