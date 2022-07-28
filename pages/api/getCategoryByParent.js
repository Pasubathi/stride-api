
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchCategoryByParent(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return fetchCategoryByParent();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchCategoryByParent() {
        const { id } = req.body;
        if (id == "" || id == undefined)
        return res.status(200).send({ status:"error", message: "Parent id is mandatory" })
        try {
            const parent_id = Number(id);
            let fetchData = await prisma.category.findMany({
                where:{
                    parent_id: parent_id
                },
                orderBy: {
                    category_id: 'desc',
                },
            });
            if (fetchData) {
                return res.status(200).json(fetchData)
            } else {
                return res.status(400).json({ responseCode: 400, message: "Detail is not updated" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

