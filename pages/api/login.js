// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
/* import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { serverRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`; */
import notification from "./notification"
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function loginHandler(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return login();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function login() {
            const { mobileNumber } = req.body;
            if (mobileNumber == "" || mobileNumber == undefined || typeof mobileNumber != 'number')
                return res.status(500).send({ message: "Mobile Number is mandatory" })
            try {
                const user = await prisma.tmpuser.findUnique({
                    where: {
                        mobile_number: mobileNumber
                    }
                });
                if (!user) {
                    return res.status(500).send({ message: "mobile number is incorrect" })
                } else {
                    let otpVal = Math.floor(1000 + Math.random() * 9000);
                    var minutesToAdd = 3;
                    var currentDate = new Date();
                    var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
                    try {
                        const updateUser = await prisma.tmpuser.update({
                            where: {
                                userid: user.userid
                            },
                            data: {
                                otp: otpVal,
                                otp_Expiry_On: futureDate,
                                otp_status: 0
                            },

                        });

                        notification.sendOtp()
                        if (updateUser) {
                            return res.status(200).json({
                                otpId: updateUser.userid,
                                message: "Message sent to your whatsapp number",
                                otp: updateUser.otp
                            })
                        }
                    } catch (e) {
                        res.status(500).send({ message: e.message ? e.message : e });
                        return;
                    }
                }
            } catch (e) {
                res.status(500).send({ message: e.message ? e.message : e });
                return;
            }// update otp process
        }
    } catch (error) {
        res.status(500).send({ message: error.message ? error.message : error })
    } // get mobile number process

}

