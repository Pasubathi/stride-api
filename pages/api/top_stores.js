
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";

const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function topStores(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return topStores();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function topStores() {
        try {
                const page = 1;
                const limit = 10;
                const startIndex = (page - 1) * limit;
                const fetchData = await prisma.store__c.findMany({
                    skip: startIndex,
                    take: limit,
                    orderBy: {
                      id: 'desc',
                    }
                });
                return res.status(200).json({ status: "success", message: "Success", data: fetchData })
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}
