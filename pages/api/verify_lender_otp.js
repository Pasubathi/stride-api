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
                        log_id: logId1                    }
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
                                // create a jwt token that is valid for 7 days
                                const token = jwt.sign({ sub: updateUser.log_id }, serverRuntimeConfig.secret, { expiresIn: '1d' });
                                const accountDet = await prisma.account.findFirst({
                                    where: {
                                        id: updateUser.cust_id,
                                    },
                                    select:{
                                        first_name__c:true,
                                        sfid:true,
                                        pan_verified__c:true,
                                        pan_number__c:true,
                                        email__c:true,
                                        is_qde_1_form_done__c:true,
                                        is_photo_verified__c:true,
                                        is_bank_detail_verified__c:true,
                                        is_name_match__c:true,
                                        account_status__c:true,
                                        is_qde_2_form_done__c:true,
                                        id:true,
                                        customer_account_status__c:true,
                                        is_pan_document_verified__c:true,
                                        date_of_birth_applicant__c:true,
                                        is_address_document_verified__c:true,
                                        is_pan_confirm__c: true,
                                        is_limit_confirm__c: true,
                                        nach_provider__c: true,
                                        client_nach_id__c: true,
                                        is_nach_approved__c: true,
                                        temp_password__c: true,
                                    }
                                });
                                let setPassword = false;
                                if(accountDet && accountDet.temp_password__c)
                                {
                                    setPassword = true;
                                }
                            
                                // return basic user details and token
                                let onBoarding;
                                return res.status(200).json({
                                    responseCode: 200,
                                    id: updateUser.cust_id,
                                    setPassword: setPassword,
                                    first_name: accountDet.first_name__c,
                                    sfid: accountDet.sfid,
                                    mpin:accountDet.mpin__c,
                                    data: accountDet,
                                    message: "Verified Successfully",
                                    status: "success",
                                    token,
                                    onBoard: onBoarding,
                                    data: accountDet
                                });
                            }
                        } catch (e) {
                            res.status(500).send({ responseCode: 500, status:"error",message: e.message ? e.message : e })
                        }
                    } else {
                        return res.status(200).send({ responseCode: 200, status:"error",message: "otp is invalid. " })
                    }

                }
            } catch (error) {
                res.status(500).send({ status:"error", message: error.message ? error.message : error })
            }
        }
}