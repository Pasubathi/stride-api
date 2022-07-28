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
            let fetchData = await prisma.news_and_article__c.findMany({
                skip: startIndex,
                take: limit,
                orderBy: {
                  id: 'desc',
                },
            });
            return res.status(200).json(fetchData);
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}