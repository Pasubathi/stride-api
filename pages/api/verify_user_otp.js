// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'
import { prisma } from "./_base";
import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
const { serverRuntimeConfig } = getConfig();

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
 )
export default async function validateOtpHandler(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return validateOtpHandler();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function validateOtpHandler() {
        let dateVal = new Date()
        const { otp, logId } = req.body;
        if (otp == "" || otp == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "OTP is mandatory" })
        if (logId == "" || logId == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "logId is mandatory" })

            var logId1 = 0;
            if (logId == "" || logId == undefined){
                logId1 = 0;
            }
            logId1 = Number(logId);
            var otp1 = Number(otp);
            try {
                const log_det = await prisma.log_history.findUnique({
                    where: {
                        log_id: logId1
                    }
                });
                if (!log_det) {
                    return res.status(200).send({ responseCode: 200,status:"error", message: "OTP is invalid" })
                } else {
                    if (log_det.otp == otp1 && log_det.login_status == null) {
                        try {
                            const updateUser = await prisma.log_history.update({
                                where: {
                                    log_id: logId1
                                },
                                data: {
                                    login_status: 1
                                },
                            });
                            if (updateUser) {
                                return res.status(200).json({
                                    responseCode: 200,
                                    status: "success",
                                    message: 'Verified Successfully'
                                });
                            }else{
                                return res.status(200).send({ responseCode: 200, status:"error",message: "OTP is invalid. " })
                            }
                        } catch (e) {
                            res.status(500).send({ responseCode: 500, status:"error",message: e.message ? e.message : e })
                        }
                    } else {
                        return res.status(200).send({ responseCode: 200, status:"error",message: "OTP is invalid. " })
                    }

                }
            } catch (error) {
                res.status(500).send({ status:"error", message: error.message ? error.message : error })
            }
        }
}

