import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getPreferedPayment(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getPreferedPayment();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function getPreferedPayment() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "ID is mandatory" })
        try {
            const custId = String(user_sfid);
            const accountUser = await prisma.account.findFirst({
                where: {
                    sfid: custId
                }
            });
            if(accountUser)
            {
                const cardDet = await prisma.account_payments__c.findFirst({
                    where: {
                        user_sfid: accountUser.sfid
                    },
                    orderBy: {
                        id: "desc"
                    }
                });
                if(cardDet)
                {
                    let data = {};
                    if(cardDet.payment_type =="Card")
                    {
                        data = await prisma.account_cards__c.findFirst({
                            where: {
                                id: cardDet.card_id
                            },
                        });
                    }else if(cardDet.payment_type =="UPI")
                    {
                        data = await prisma.account_upi__c.findFirst({
                            where: {
                                id: cardDet.upi_id
                            },
                        });
                    }

                    let obj = {
                        type: cardDet.payment_type,
                        data: data
                    }
                    return res.status(200).json({ status:"success", message: "Success", data:  obj})
                }else{
                    return res.status(200).json({ status:"error", message: "No Record found"})  
                }
            }else{
                return res.status(200).json({ status:"error", message: "Account not found" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

