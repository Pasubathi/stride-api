
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getLeads(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return getLeads();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getLeads() {
        try {
            let fetchData = await prisma.role__c.findMany();
            if (fetchData) {
                return res.status(200).json({ status: 'success', message: "Success", data: fetchData})
            } else {
                return res.status(200).json({ status: 'error', message: "Record not found"})
            }
        } catch (error) {
            res.status(200).send({ status: 'error', message: error.message ? error.message : error })
        }

    }
}

