import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function productStatusUpdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return productStatusUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function productStatusUpdate() {
        const { account_sfid, status } = req.body;
        if (account_sfid == "" || account_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Account sfid is mandatory" })
        try {
            const sfid = String(account_sfid);
            const productDet = await prisma.bank_account__c.findFirst({
                where: {
                    sfid: sfid
                }
            });
           
            if(productDet)
            {
                await prisma.bank_account__c.update({
                    where: {
                        sfid: productDet.sfid
                    },
                    data: {
                        bank_txn_status__c: status?true:false,
                    },
                });
                return res.status(200).json({ status:"success", message: "Updated successfully"})
            }else{
                 return res.status(200).json({ status:"error",message: "Account not found!" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}