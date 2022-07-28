
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";

const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getSearchHistory(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getSearchHistory();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getSearchHistory() {
        try {
            const { user_sfid } = req.body;
            if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "Id is mandatory" })    
            const cust_id = String(user_sfid); 
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id,
                }
            });
            if(accountDet)
            {
                let fetchData = await prisma.user_search_history__c.findMany({
                    where:{
                        account__c: accountDet.sfid
                    }
                });
                return res.status(200).json({ status: "success", message: "Success", data: fetchData })
            }else{
                return res.status(200).json({ status: "error", message: "Detail not found" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}