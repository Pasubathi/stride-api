
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchUsersData(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return fetchUsersData();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchUsersData() {
        try {
            const query = req.query;
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const { id } = req.body;
            if (id == "" || id == undefined)
            {
                return res.status(200).send({ responseCode: 200,status:"error", message: "Unauthorized access" })
            }
            
            let fetchData = await prisma.users.findMany({
                skip: startIndex,
                take: limit,
               where: {
                  owner: id,
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

