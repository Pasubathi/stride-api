import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { sendEmail, sendMessage } from "./eduvanz_api"
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function shareVcard(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return shareVcard();
        default:
            return res.status(500).send({ responseCode: 500, message: `Method ${req.method} Not Allowed` })
    }
    async function shareVcard() {
        try {
            const { user_sfid, send_via, card_number } = req.body;
            if (user_sfid == "" || user_sfid == undefined)
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Id is mandatory" })
            if (card_number == "" || card_number == undefined)
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Card Number is mandatory" })
            if (send_via == "" || send_via == undefined)
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Send Via is mandatory" })
           
            const sendVia     = String(send_via);
            const sfid        = String(user_sfid);
            const cardNumber  = String(card_number);
            const accountDet  = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            if(accountDet)
            {
                const cardDet = await prisma.virtual_cart__c.findFirst({
                    where:{
                        card_number__c: cardNumber
                    }
                });
                if(cardDet)
                {
                    if(sendVia == "Mail")
                    {
                        const obj = {
                            email: accountDet.email__c,
                            message: `Your virtual card number is ${cardDet.vcard_number__c}`,
                            subject: 'Eduvanz Virtual Card'
                        }
                        await sendEmail(obj); 
                        return res.status(200).send({ responseCode: 200, status:"success",  message: "Mail sent successfully"})
                    }else if(sendVia == "Message")
                    {
                        let data = {
                            mobile: accountDet.phone,
                            message: `Your+virtual+card+number+is+${cardDet.vcard_number__c?cardDet.vcard_number__c.replace(/\s/g, ''):'Test'}`
                        }
                        await sendMessage(data);
                        return res.status(200).send({ responseCode: 200, status:"success",  message: "Message sent successfully"})
                    }else if(sendVia == "WhatsApp")
                    {
                        return res.status(200).send({ responseCode: 200, status:"success",  message: "WhatsApp sent successfully"})
                    }else{
                        return res.status(200).send({ responseCode: 200, status:"error",  message: `Your request ${sendVia} send option not available` })
                    }
                }else{
                    return res.status(200).send({ responseCode: 200, status:"error",  message: "Card not found"})
                }
            }else{
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Account not found"})
            }
            
        } catch (error) {
            res.status(500).send({ responseCode: 500, message: error.message ? error.message : error })
        }
    }
}