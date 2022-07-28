import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function addCard(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return addCard();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function addCard() {
        const { user_sfid, upi_id } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Id cannot be empty" })
       
        try {
            const sfid   = String(user_sfid);
            const upiId  = String(upi_id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            if (accountDet) {
                const upiDet = await prisma.account_upi__c.findFirst({
                    where: {
                        account__c: accountDet.sfid,
                        upi_id__c: upiId
                    }
                });
                if(!upiDet)
                {
                    await prisma.account_upi__c.create({
                        data: {
                            account__c: accountDet.sfid,
                            upi_id__c: upiId
                        }
                    });
                    return res.status(200).json({ status:"success", message:"Upi added successfully"});
                }else{
                    return res.status(200).json({ status:"success", message:"Upi already exist"})
                }
            } else {
                return res.status(200).json({ status:"error",message: "Account not found" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

