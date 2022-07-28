// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware'
import { sendOtp, sendEmail } from "./eduvanz_api"

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function sendEmailOtpHandler(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return sendEmailOtpHandler();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function sendEmailOtpHandler() {
            const { email, user_sfid } = req.body;
            if (email == "" || email == undefined)
                return res.status(200).send({ responseCode:200,status:"error",message: "Email is required" })
            if ( user_sfid == "" || user_sfid == undefined )
                return res.status(200).send({ responseCode:200,status:"error",message: "Id is required" })
            
            let otpVal1   = Math.floor(1000 + Math.random() * 9000);
            let otpVal2   = Math.floor(1000 + Math.random() * 9000);
           /*  let otpVal1 = 1111;
            let otpVal2 = 2222; */
            const cust_id = String(user_sfid);
            const email_c  = String(email);
            try {
                    const accountDet = await prisma.account.findFirst({
                        where: {
                            sfid: cust_id,
                        }
                    });
                    if(accountDet)
                    {
                        const data = {
                            mobile: accountDet.phone,
                            otp: otpVal1
                        }
                        const obj = {
                            email: email_c,
                            message: `Your one time passowrd id ${otpVal2}`,
                            subject: 'One Time Password'
                        }
                        await sendEmail(obj);
                        await sendOtp(data);
                        const logMobileDet = await createlogHistoryDetail(accountDet.id, otpVal1, accountDet.phone);
                        const logEmailDet  = await createlogHistoryDetail(accountDet.id, otpVal2, accountDet.phone);
                        return res.status(200).json({
                            responseCode:200,
                            verificationType: "otp",
                            message: "OTP sent Successfully",
                            mobile_otp: otpVal1,
                            email_otp: otpVal2,
                            mobile_log: logMobileDet.log_id,
                            email_log: logEmailDet.log_id,
                            status:"success"
                        })
                    }else{
                        return  res.status(200).send({ responseCode:200,status:"error",message: 'Account not found'});
                    }
                    
            } catch (e) {
                res.status(200).send({ responseCode:200,status:"error",message: e.message ? e.message : e });
                return;
            }// update otp process
        }
    } catch (error) {
        res.status(200).send({responseCode:200,status:"error", message: error.message ? error.message : error })
    } // get mobile number process

}


function createlogHistoryDetail(cust_id, otp, mobile) {
    return new Promise((resolve, reject) => {
        try {
            const createDevice = prisma.log_history.create({
                data: {
                    cust_id: Number(cust_id),
                    otp: Number(otp),
                    mobile_no: String(mobile),
                }
            });
            resolve(createDevice)

        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

