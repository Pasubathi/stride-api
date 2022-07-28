import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
// export default apiHandler(profileupdate);
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
        const { card_number, card_name, card_expiry, card_cvv, isSaved, user_sfid, upi_id } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Customer id cannot be empty" })
        if (card_number == "" || card_number == undefined)
            return res.status(200).send({ status:"error",message: "Card number cannot be empty" })
        if (card_name == "" || card_name == undefined)
            return res.status(200).send({ status:"error",message: "Card name cannot be empty" })
        if (card_expiry == "" || card_expiry == undefined)
            return res.status(200).send({ status:"error",message: "Card expiry cannot be empty" })
        if (card_cvv == "" || card_cvv == undefined)
            return res.status(200).send({ status:"error",message: "Card cvv cannot be empty" })
       
        try {
            const sfid       = String(user_sfid);
            const cardNumber = String(card_number);
            const cardName   = String(card_name);
            const cardExpiry = String(card_expiry);
            const cardCvv    = String(card_cvv);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            let is_saved = false;
            if(isSaved =="true" || isSaved == true)
            {
                is_saved = true;
            }
            console.log("is_saved", is_saved);
            if (accountDet) {
               await prisma.account_cards__c.create({
                    data: {
                        card_number__c: cardNumber,
                        card_name__c: cardName,
                        card_expiry__c: cardExpiry,
                        cvv: cardCvv,
                        isSave: is_saved,
                        sfid: accountDet.sfid
                    }
                });
                return res.status(200).json({ status:"success", message:"Card added successfully"})
            } else {
                return res.status(200).json({ status:"error",message: "Detail is not updated" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

