import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { entitySearch} from "./eduvanz_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function bankSearch(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return bankSearch();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function bankSearch() {
        const { search_name } = req.body;
       
        if (search_name == "" || search_name == undefined)
            return res.status(200).send({ status:"error",message: "Search name is mandatory" })
       
        try {
                const result = await prisma.bank_name_details__c.findMany({
                    select:{
                        bank_logo_url__c: true,
                        account_aggregator__c: true,
                        name: true,
                        status__c: true,
                        bank_code__c: true,
                        cashfree_code__c: true,
                        id: true,
                        sfid: true
                    },
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

