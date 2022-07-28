
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
import { PLANS_API_URL } from './api'; 
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchBanksData(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return fetchBanksData();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchBanksData() {
        try {
            const page = 1;
            const limit = 9;
            const startIndex = (page - 1) * limit;
            let whereCon = {
                isdeleted: false
            }
            let fetchData = await prisma.payment_plan__c.findMany({
                    skip: startIndex,
                    take: limit,
                    where: whereCon, 
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

