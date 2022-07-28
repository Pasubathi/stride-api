
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getAllSubCategories(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getAllSubCategories();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getAllSubCategories() {
        const { parent_id } = req.body;
         
        try {
            if(parent_id && parent_id.length > 0)
            {
                let fetchData = await prisma.product_subcategory__c.findMany({
                    where:{
                        product_category__c: { in: parent_id },
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
                    return res.status(400).json({ responseCode: 400, message: "Record not found" })
                }
            }else{
                return res.status(400).json({ responseCode: 400, message: "Parent Id is mandatory" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}