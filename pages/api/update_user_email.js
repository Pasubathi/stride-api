import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function updateUserPhone(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return incomeUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function incomeUpdate() {
        const { user_sfid, mobile_otp, email_otp, mobile_id, email_id, email } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status: "error", message: "id is mandatory" })
        if (mobile_otp == "" || mobile_otp == undefined)
            return res.status(200).send({ status: "error", message: "Mobile Otp is mandatory" })
        if (email_otp == "" || email_otp == undefined)
            return res.status(200).send({ status: "error", message: "Email Otp is mandatory" })
        if (mobile_id == "" || mobile_id == undefined)
            return res.status(200).send({ status: "error", message: "Mobile id is mandatory" })
        if (email_id == "" || email_id == undefined)
            return res.status(200).send({ status: "error", message: "Email id is mandatory" })
        if (email == "" || email == undefined)
            return res.status(200).send({ status: "error", message: "Email is mandatory" })
        try {
            const sfid      = String(user_sfid);
            const mobileOtp = Number(mobile_otp);
            const emailOtp  = Number(email_otp);
            const mobileId  = Number(mobile_id);
            const emailId   = Number(email_id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            if(accountDet)
            {
                const mobileDet = await prisma.log_history.findUnique({
                    where: {
                        log_id: mobileId 
                    }
                });

                const emailDet = await prisma.log_history.findUnique({
                    where: {
                        log_id: emailId 
                    }
                });
                if(mobileDet && mobileDet.otp == mobileOtp && emailDet && emailDet.otp == emailOtp)
                {
                    await prisma.account.update({
                        where:{
                            sfid: accountDet.sfid,
                        },
                        data: {
                            secondary_email__c: email 
                        }
                    });
                    return res.status(200).json({ status: "success", message: "Updated successfully" })
                }else{
                    return res.status(200).json({ status: "error", message: "Invalid Otp" })
                }
                
            }else{
                return res.status(200).json({ status: "error", message: "Details not found" })
            }
        } catch (error) {
            res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

