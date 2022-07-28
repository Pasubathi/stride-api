
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function favProducts(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return favProducts();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function favProducts() {
        const { report_id } = req.body;
        if (report_id == "" || report_id == undefined)
        return res.status(200).send({ status:"error", message: "ID is mandatory" })
        try {
            const reportId = Number(report_id);
            await prisma.emailreport__c.delete({
                where:{
                    id: reportId
                }
            });
            return res.status(200).json({ status: "success", message: "Success" })
        } catch (error) {
            res.status(400).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

