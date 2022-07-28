
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchStore(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return fetchStore();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchStore() {
        try {
            let fetchData = await prisma.account.findMany({
                where:{
                    merchant_virtual_card_eligibility__c: true
                },
                orderBy: {
                    id: 'asc',
                },
            });
            if (fetchData) {
                let store = [];
                await Promise.all(fetchData.map(async element => {
                    let rowData = {
                        id: element.id,
                        sfid: element.sfid,
                        name: element.first_name__c,
                        icon: element.merchant_logo_url__c,
                        url: element.website
                    }
                    store.push(rowData);
                }));
                return res.status(200).json(store)
            } else {
                return res.status(400).json({ responseCode: 400, message: "Detail is not updated" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

