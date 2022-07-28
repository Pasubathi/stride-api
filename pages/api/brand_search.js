import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function brandSearch(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return brandSearch();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function brandSearch() {
        const { search_name } = req.body;
       
        if (search_name == "" || search_name == undefined)
            return res.status(200).send({ status:"error",message: "Search name is mandatory" })
       
        try {
                const result = await prisma.product_brand__c.findMany({
                    where: {
                        name: {
                         search: search_name,
                        },
                    },
                })
                return res.status(200).json(result)
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

