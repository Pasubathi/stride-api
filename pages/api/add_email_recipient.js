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
        const { email, user_sfid} = req.body;
        if (email == "" || email == undefined)
            return res.status(200).send({ status:"error",message: "Email cannot be empty" })
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Id cannot be empty" })
       
        try {
                const accountDet = await prisma.account.findFirst({
                    where: {
                        sfid: user_sfid,
                    }
                });
                if(accountDet)
                {
                    const lender_sfid = accountDet.lender_id__c?accountDet.lender_id__c:accountDet.sfid;
                    const emailDet = await prisma.lender_email_recipient.findFirst({
                        where: {
                            lender_sfid: lender_sfid,
                            email: email
                        }
                    });
                    if(!emailDet)
                    {
                        await prisma.lender_email_recipient.create({
                            data: {
                                lender_sfid: lender_sfid,
                                email: String(email),
                                created_by: accountDet.sfid
                            }
                        });
                        return res.status(200).json({ status:"success", message:"Recipient created successfully"});
                    }
                    else {
                        return res.status(200).json({ status:"error",message: "Email already exist!" })
                    }
                }
                else {
                    return res.status(200).json({ status:"error",message: "Invalid account details!" })
                }
            
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

