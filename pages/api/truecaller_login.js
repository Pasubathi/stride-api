// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
const { serverRuntimeConfig } = getConfig();
import initMiddleware from '../../lib/init-middleware'
import notification from "./notification"

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function truecallerLoginHandler(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return truecallerLoginHandler();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function truecallerLoginHandler() {
           // console.log(req.body);
            const { phoneNumber,firstName,lastName,email,device_id } = req.body;
            if (phoneNumber == "" || phoneNumber == undefined)
                return res.status(500).send({ responseCode:200,status:"error",message: "Mobile number mandatory" })
           
            try {
                const accountDet = await prisma.account.findFirst({
                    where: {
                        phone: phoneNumber
                    }
                });
                if (accountDet) {
                     // create a jwt token that is valid for 7 days
                    var otpVal = 0;
                    const logDet = await createlogHistoryDetail(accountDet.phone, device_id, accountDet.id, otpVal)
                    const token = jwt.sign({ sub: logDet.log_id }, serverRuntimeConfig.secret, { expiresIn: '1d' });
                    return res.status(200).json({
                        responseCode:200,
                        message:"Login Successfully",
                        id: accountDet.id,
                        status:"success",
                        mpin: accountDet.mpin__c,
                        first_name: accountDet.first_name__c,
                        last_name:accountDet.last_name__c,
                        email:accountDet.email__c,
                        mobile: accountDet.phone,
                        isNewUser: "No",
                        token
                    })
                    
                }else{
                    var otpVal = 0;
                    const createUser = await prisma.account.create({
                        data: {
                            phone: phoneNumber,
                            first_name__c:firstName,
                            last_name__c:lastName,
                            email__c:email
                        },
                    });
                    if (createUser) {
                        const logDet = await createlogHistoryDetail(phoneNumber, device_id, createUser.id, otpVal)
                        const token = jwt.sign({ sub: logDet.log_id }, serverRuntimeConfig.secret, { expiresIn: '1d' });
                        const accountDet = await prisma.account.findFirst({
                            where: {
                                id: createUser.id,
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
                                nach_provider__c: true,
                                client_nach_id__c: true,
                                is_nach_approved__c: true,
                                current_address_id__c: true,
                                account_partner__c:{
                                    select:{
                                        account_to__c: true,
                                        account_from__c: true
                                    }
                                }
                            }
                        });
                        return res.status(200).json({
                            responseCode: 200,
                            id: createUser.id,
                            first_name: accountDet.first_name__c,
                            sfid: accountDet.sfid,
                            message: "Verified Successfully",
                            status:"success",
                            token,
                            onBoard: 1,
                            data: accountDet
                        });
                    }
                }

            } catch (e) {
                res.status(500).send({ responseCode:200,status:"error",message: e.message ? e.message : e });
                return;
            }// update otp process
        }
    } catch (error) {
        res.status(500).send({responseCode:200, status:"error",message: error.message ? error.message : error })
    } // get mobile number process

}

function createlogHistoryDetail(mobile_no, device_id, cust_id, otpVal) {
    return new Promise((resolve, reject) => {
        try {
            const createDevice = prisma.log_history.create({
                data: {
                    mobile_no: mobile_no,
                    device_id: device_id,
                    cust_id: cust_id,
                    otp: otpVal
                },

            });
            resolve(createDevice)

        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}