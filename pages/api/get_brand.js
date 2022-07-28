
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchBrand(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return fetchBrand();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchBrand() {
        try {
            let fetchData = await prisma.product_brand__c.findMany({
                select:{
                    isdeleted: true,
                    name: true,
                    icon__c: true,
                    sfid: true,
                    id: true
                },
                orderBy: {
                    id: 'desc',
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

