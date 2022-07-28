
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchUpis(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return fetchUpis();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchUpis() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined )
            return res.status(200).send({ responseCode: 200, status:"error",  message: "Id is mandatory" })
           
        try {
            const sfid = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            if(accountDet)
            {
                let fetchData = await prisma.account_upi__c.findMany({
                     where: {
                        account__c: accountDet.sfid
                     },
                     select:{
                        upi_id__c: true,
                        id: true
                     },
                     orderBy: {
                       id: 'desc',
                     }
                 });
                 if (fetchData) {
                     return res.status(200).json({ status:"success", data: fetchData })
                 }else {
                     return res.status(200).json({ status:"error",message: "Record not found" })
                 }
            }else {
                return res.status(200).json({ status:"error",message: "Account not found" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

