// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'
import { prisma } from "./_base";
import getConfig from 'next/config';
import { sendOtp } from "./eduvanz_api";
const { serverRuntimeConfig } = getConfig();

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
 )
export default async function resendLoginOtpHandler(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return resendLoginOtpHandler();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function resendLoginOtpHandler() {
        let dateVal = new Date()
        const { logId } = req.body;
        if (logId == "" || logId == undefined){
            return res.status(200).send({ responseCode: 200,status:"error", message: "OTP sent failed" })
        }

             let otpVal = Math.floor(1000 + Math.random() * 9000);
             // let otpVal = 1234;
             var logId1 = Number(logId);
            try {
                const log_det = await prisma.log_history.findUnique({
                    where: {
                        log_id: logId1
                    }
                });
                if (!log_det) {
                    return res.status(200).send({ responseCode: 200,status:"error", message: "OTP sent failed" })
                } else {
                    let data = {
                        mobile: log_det.mobile_no,
                        otp: otpVal
                    }
                    await sendOtp(data);
                   
                    try {
                        console.log("ssss");
                        const updateUser = await prisma.log_history.update({
                            where: {
                                log_id: logId1
                            },
                            data: {
                                otp: otpVal
                            },
                        });
                        
                        if (updateUser) {
                            // create a jwt token that is valid for 7 days
                            const accountDet = await prisma.account.findFirst({
                                where: {
                                    id: updateUser.cust_id,
                                }
                            });
                            // return basic user details and token
                            return res.status(200).json({
                                responseCode:200,
                                status:'success',
                                verificationType: "otp",
                                message: "OTP sent to your mobile number",
                                id: log_det.log_id,
                                otp: otpVal,
                                isNewUser: false
                            })
                        }
                    } catch (e) {
                        res.status(200).send({ responseCode: 200, status:"error",message: e.message ? e.message : e })
                    }
                    res.status(200).send({ responseCode: 200, status:"error",message: e.message ? e.message : e })

                }
            } catch (error) {
                res.status(200).send({ status:"error", message: error.message ? error.message : error })
            }
        }
}

