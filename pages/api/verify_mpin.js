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
export default async function validatempinHandler(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return validateMpin();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function validateMpin() {
        let dateVal = new Date()
        var logId1 = 0
        try {
            const { mpin, logId, account_profile_id } = req.body;
            if (mpin == "" || mpin == undefined)
                return res.status(200).send({ responseCode: 200, status:"error", message: "Mpin is mandatory" })
            if (logId == "" || logId == undefined)
                return res.status(200).send({ responseCode: 200,status:"error", message: "Log Id id is mandatory" })
            if (account_profile_id == "" || account_profile_id == undefined)
                return res.status(200).send({ responseCode: 200,status:"error", message: "Account profile id is mandatory" })
                var account_profile_id1 = Number(account_profile_id);
                const profile_log = await prisma.account.findUnique({
                    where: {
                        id: account_profile_id1
                    }
                });
                 logId1 = Number(logId);
                const log_history = await prisma.log_history.findUnique({
                    where: {
                        log_id: logId1
                    }
                });
            if (!profile_log || !log_history) {
                return res.status(200).send({ responseCode: 200,status:"error", message: "Account profile id is invalid" })
            } else {
                if (profile_log.mpin__c == mpin && log_history.login_status == null) {
                    try {
                        const updateUser = await prisma.log_history.update({
                            where: {
                                log_id: logId1
                            },
                            data: {
                                login_status: 1,
                                // login_date:new Date()
                            },
                        });
                        if (updateUser) {
                            // create a jwt token that is valid for 7 days
                            const token = jwt.sign({ sub: updateUser.log_id }, serverRuntimeConfig.secret, { expiresIn: '1d' });
                            const accountDet = await prisma.account.findFirst({
                                where: {
                                    id: profile_log.id,
                                },
                                select:{
                                    first_name__c: true,
                                        last_name__c: true,
                                        date_of_birth_applicant__c: true,
                                        ipa_basic_bureau__c: true,
                                        pan_verified__c: true,
                                        pan_number__c: true,
                                        email__c: true,
                                        is_qde_1_form_done__c:true,
                                        is_photo_verified__c:true,
                                        is_bank_detail_verified__c:true,
                                        is_name_match__c:true,
                                        account_status__c:true,
                                        is_qde_2_form_done__c:true,
                                        is_address_document_verified__c:true,
                                        id:true,
                                        customer_account_status__c:true,
                                        is_pan_document_verified__c:true,
                                        is_kyc_document_verified__c: true,
                                        gender__c: true,
                                        phone: true,
                                        pin_code__c: true,
                                        approved_pin_code__c: true,
                                        resident_type__c: true,
                                        rent_amount__c: true,
                                        employer_type__c: true,
                                        monthly_income__c: true,
                                        occupation__c: true,
                                        employer_name__c: true,
                                        industry: true,
                                        sfid: true,
                                        is_pan_confirm__c: true,
                                        is_limit_confirm__c: true,
                                        is_nach_approved__c: true,
                                        current_address_id__c: true,
                                        mpin__c: true,
                                        account_partner__c:{
                                            select:{
                                                account_to__c: true,
                                                account_from__c: true
                                            }
                                        }
                                }
                            });
                            // return basic user details and token
                            let onBoarding;
                            
                            return res.status(200).json({
                                responseCode: 200,
                                id: accountDet.id,
                                first_name: accountDet.first_name__c,
                                sfid: accountDet.sfid,
                                message: "Verified Successfully",
                                status:"success",
                                token,
                                onBoard: onBoarding,
                                data: accountDet
                            });
                        }
                    } catch (e) {
                        res.status(200).send({ responseCode: 200,status:"error", message: e.message ? e.message : e })
                    }
                } else {
                    return res.status(200).send({ responseCode: 200,status:"error", message: "Mpin is invalid." })
                }

            }
        } catch (error) {
            res.status(200).send({ responseCode: 200,status:"error",message: error.message ? error.message : error })
        }
    }
}

