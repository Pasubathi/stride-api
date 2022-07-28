
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchSubCategory(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return fetchSubCategory();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchSubCategory() {
        const { category } = req.body;
        if (category == "" || category == undefined)
         return res.status(200).send({ status:"error", message: "Category is mandatory" })
         
        try {
             const category_name = String(category);
             const categoryDet = await prisma.product_category__c.findFirst({
                where:{
                    name: category_name
                }
             });
             if(categoryDet)
             {
                let fetchData = await prisma.product_subcategory__c.findMany({
                    where:{
                        product_category__c: categoryDet.sfid
                    },
                    orderBy: {
                        id: 'desc',
                    },
                });
                if (fetchData) {
                    return res.status(200).json({ status:"success", message: "Success", data: fetchData })
                } else {
                    return res.status(400).json({ status:"error", message: "Record not found" })
                }
             }else {
                return res.status(400).json({ status:"error", message: "Category not found" })
            }
           
        } catch (error) {
            res.status(400).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

