import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function categoryBrandSearch(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return categoryBrandSearch();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function categoryBrandSearch() {
        const { search_name, category } = req.body;
        if (search_name == "" || search_name == undefined)
            return res.status(200).send({ status:"error",message: "Search name is mandatory" })
        if (category == "" || category == undefined)
            return res.status(200).send({ status:"error",message: "Category is mandatory" })
       
        try {
                const catName = String(category);
                const catDet = await prisma.product_category__c.findFirst({
                    where: {
                        name: catName
                    }
                });
                const subCatDet = await prisma.product_subcategory__c.findFirst({
                    where: {
                        name: catName
                    }
                });
                if(catDet)
                {
                   const fetchData = await prisma.product_brand__c.findMany({
                       select:{
                           name: true,
                       },
                        where: {
                            name: {
                                search: search_name,
                            },
                            product2: {
                                product_category_lu__c: {
                                  contains: catDet.sfid,
                                },
                            },
                        },
                    });
                    return res.status(200).json({ status: "success", message: "Success", data: fetchData })
                }else if(subCatDet)
                {
                    const fetchData = await prisma.product_brand__c.findMany({
                        select:{
                            name: true,
                        },
                        where: {
                            name: {
                            search: search_name,
                            },
                            product2: {
                                product_subcategory__c: {
                                  contains: subCatDet.sfid,
                                },
                            },
                        },
                    });
                    return res.status(200).json({ status: "success", message: "Success", data: fetchData })
                }else{
                    return res.status(200).json({ status: "error", message: "Category not found" })
                }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

