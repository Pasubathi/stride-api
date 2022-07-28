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
export default async function validateHandler(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return validateOtp();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function validateOtp() {
        let dateVal = new Date()
        const { otp, otpId } = req.body;
        if (otp == "" || otp == undefined || typeof otp != 'number')
            return res.status(500).send({ message: "OTP is mandatory" })
        if (otpId == "" || otpId == undefined || typeof otpId != 'number')
            return res.status(500).send({ message: "OTP id is mandatory" })
        try {
            const user = await prisma.tmpuser.findUnique({
                where: {
                    userid: otpId
                }
            });
            if (!user) {
                return res.status(500).send({ message: "otp id is invalid" })
            } else {
                if (user.otp == otp && user.otp_status == 0 && dateVal <= new Date(user.otp_Expiry_On)) {
                    try {
                        const updateUser = await prisma.tmpuser.update({
                            where: {
                                userid: user.userid
                            },
                            data: {
                                otp_status: 1
                            },
                        });
                        if (updateUser) {
                            // create a jwt token that is valid for 7 days
                            const token = jwt.sign({ sub: updateUser.userid }, serverRuntimeConfig.secret, { expiresIn: '1d' });

                            // return basic user details and token
                            return res.status(200).json({
                                id: updateUser.userid,
                                email: updateUser.email,
                                firstName: updateUser.first_name,
                                lastName: updateUser.last_name,
                                mobileNumber: updateUser.mobile_number,
                                token
                            });
                        }
                    } catch (e) {
                        res.status(500).send({ message: e.message ? e.message : e })
                    }
                } else {
                    return res.status(500).send({ message: "otp is invalid." })
                }

            }
        } catch (error) {
            res.status(500).send({ message: error.message ? error.message : error })
        }
    }
}

