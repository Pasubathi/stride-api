
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
        const { parent_id } = req.body;
        if (parent_id == "" || parent_id == undefined)
         return res.status(200).send({ status:"error", message: "Category Id is mandatory" })
         
        try {
             const category_id = String(parent_id);
            let fetchData = await prisma.product_subcategory__c.findMany({
                where:{
                    product_category__c: category_id
                },
                orderBy: {
                    id: 'desc',
                },
            });
            if (fetchData) {
                let categoryData = [];
                await Promise.all(fetchData.map(async element => {
                    let rowData = {
                        category_id: element.id,
                        category_name: element.name,
                        sfid: element.sfid,
                        category_image: element.logo__c
                    }
                    categoryData.push(rowData);
                }));
                return res.status(200).json(categoryData)
            } else {
                return res.status(400).json({ responseCode: 400, message: "Detail is not updated" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}