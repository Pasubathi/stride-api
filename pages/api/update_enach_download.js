import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function enachupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return enachupdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function enachupdate() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status: "error", message: "User sfid is mandatory" })
    
        const cust_id = String(user_sfid);
        try {
          
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id
                }
            });
         
            let data = {
                account_id: accountDet.sfid,
                download_status: 1,
            };

            const enachDet = await prisma.enach__c.findFirst({
                where: {
                    account_id: accountDet.sfid
                }
                
            });
            if(!enachDet)
            {
               await prisma.enach__c.create({
                    data: data
                });          
            
                 return res.status(200).json({ status: "success", message: "Downloaded successfully" })
            }
            else{
                res.status(200).send({ status: "error", message: "Already Downloaded" })
            }
        } catch (error) {
            res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

