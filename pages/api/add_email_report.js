import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function addEmailReport(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return addEmailReport();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function addEmailReport() {
        const { group_id, lender_sfid, select_report, time_range, email_config, week_day, month_date} = req.body;
        if (group_id == "" || group_id == undefined)
            return res.status(200).send({ status:"error",message: "Group id cannot be empty" })
        if (lender_sfid == "" || lender_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Lender sfid cannot be empty" })
        if (select_report == "" || select_report == undefined)
            return res.status(200).send({ status:"error",message: "Select report cannot be empty" })
        if (time_range == "" || time_range == undefined)
            return res.status(200).send({ status:"error",message: "Time Range cannot be empty" })
       
        try {
                const groupId = await prisma.emailreport__c.create({
                    data: {
                        group_id: Number(group_id),
                        lender_sfid: String(lender_sfid),
                        select_report: String(select_report),
                        time_range: String(time_range),
                        week_day: week_day?String(week_day):null,
                        month_date: month_date?String(month_date):null,
                    }
                });
                return res.status(200).json({ status:"success", message:"Email report created successfully"});
            } catch (error) {
                res.status(200).send({ status:"error",message: error.message ? error.message : error })
            }
    }
}

