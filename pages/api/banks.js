
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchBanksData(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return fetchBanksData();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchBanksData() {
        try {
            let fetchData = await prisma.bank_name_details__c.findMany({
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
                where:{
                    NOT: {
                        bank_logo_url__c: null,
                    }
                }
            });
            if (fetchData) {
                let bankData = [];
                await Promise.all(fetchData.map(async element => {
                    let rowData = {
                        bank_name: element.bank_code__c,
                        bank_id: element.id,
                        sfid: element.sfid,
                        bank_icon: element.bank_logo_url__c,
                        bank_code: element.cashfree_code__c,
                    }
                    bankData.push(rowData);
                }));
                return res.status(200).json(bankData)
            } else {
                return res.status(400).json({ responseCode: 400, message: "Detail is not updated" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

