import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function addEmailRecipient(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return addEmailRecipient();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function addEmailRecipient() {
        const { email, recipient_id} = req.body;
        if (email == "" || email == undefined)
            return res.status(200).send({ status:"error",message: "Email cannot be empty" })
        if (recipient_id == "" || recipient_id == undefined)
            return res.status(200).send({ status:"error",message: "Id cannot be empty" })
       
        try {
                const emailDet = await prisma.lender_email_recipient.findFirst({
                    where: {
                        recipient_id: Number(recipient_id),
                    }
                });
                if(emailDet)
                {
                    const emailDet = await prisma.lender_email_recipient.update({
                        data:{
                            email: String(email),
                        },
                        where: {
                            recipient_id: Number(recipient_id),
                        }
                    });
                    return res.status(200).json({ status:"success", message:"Recipient updated successfully"});
                }else {
                    return res.status(200).json({ status:"error",message: "Invalid recipient details!" })
                }
            
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

