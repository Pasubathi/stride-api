// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import notification from "./notification"
import { sendOtp } from "./eduvanz_api"
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function mobileLoginHandler(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return mobileLoginHandler();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function mobileLoginHandler() {
            const { mobile_no, device_id } = req.body;
            if (mobile_no == "" || mobile_no == undefined || mobile_no.length != 10)
                return res.status(200).send({ responseCode:200,status:"error",message: "Mobile number is mandatory" })
            
            //let otpVal = Math.floor(1000 + Math.random() * 9000);
            let otpVal = 1111;
            var minutesToAdd = 3;
            var currentDate = new Date();
            var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
            
            try {
                const accountDet = await prisma.account.findUnique({
                    where: {
                        phone: mobile_no,
                    }
                });
                const recordDet = await prisma.recordtype.findFirst({
                    where: {
                        name: "Customer Account",
                    },
                });
                var mpinVal;
                let sfId = recordDet.sfid.toString();
                let RecordId = (accountDet && accountDet.recordtypeid !=undefined && accountDet.recordtypeid !=null) ?accountDet.recordtypeid.toString():null;
                if (accountDet && sfId == RecordId) {
                   
                    let onBoarding;
                    let data = {
                        mobile: mobile_no,
                        otp: otpVal
                    }
                    //const smsRes = await sendOtp(data);
                    mpinVal = accountDet && accountDet.mpin__c ? accountDet.mpin__c : "";
                    const logDet = await createlogHistoryDetail(mobile_no, device_id, accountDet.id, otpVal)
                    return res.status(200).json({
                        responseCode:200,
                        verificationType: mpinVal ? "mPin" : "otp",
                        status:"success",
                        message: mpinVal ? "Use your mPin to login" : "OTP sent to your mobile number",
                        log_id:logDet.log_id,
                        id: mpinVal ? accountDet.id : logDet.log_id,
                        otp: mpinVal ? mpinVal : otpVal,
                        mobile_no:mobile_no,
                        isNewUser: false,
                        onBoard: onBoarding
                    })

                } else {
                    if(accountDet)
                    {
                        return res.status(500).send({ responseCode:500,message: "Invalid Login Crentials" });
                    }else{
                        const getData = await prisma.account.findFirst({ orderBy: { id: 'desc' } });
                        let tempid = (getData.id+1).toString();
                       /*  const createUser = await prisma.account.create({
                            data: {
                                phone: mobile_no,
                                heroku_external_id__c: tempid,
                                device_id__c: device_id,
                                first_name__c: "Eduvanz",
                                last_name__c: "User",
                                lastname: "User",
                                account_status__c: 'Partial User',
                                recordtypeid: recordDet.sfid.toString()
                            },
                        });
                        if (createUser) {
                            let data = {
                                mobile: mobile_no,
                                otp: otpVal
                            }
                            //const smsRes = await sendOtp(data);
                             const logDet = await createlogHistoryDetail(mobile_no, device_id, createUser.id, otpVal) */
                            const logDet = await createlogHistoryDetail(mobile_no, device_id, '', otpVal)
                            return res.status(200).json({
                                responseCode:200,
                                verificationType: mpinVal ? "mPin" : "otp",
                                message: mpinVal ? "Use your mPin to login" : "OTP sent to your mobile number",
                                id: logDet.log_id,
                                otp: mpinVal ? mpinVal : otpVal,
                                mobile_no: mobile_no,
                                log_id: logDet.log_id,
                                isNewUser: true,
                                status:"success",
                                onBoard: 0
                            })
                        /* } */
                    }
                }

            } catch (e) {
                res.status(200).send({ status:"error",responseCode:200,message: e.message ? e.message : e });
                return;
            }// update otp process
        }
    } catch (error) {
        res.status(200).send({responseCode:200,status:"error", message: error.message ? error.message : error })
    } // get mobile number process

}

function createlogHistoryDetail(mobile_no, device_id, cust_id, otpVal) {
    return new Promise((resolve, reject) => {
        try {
            const createDevice = prisma.log_history.create({
                data: {
                    mobile_no: mobile_no,
                    device_id: device_id,
                  //  cust_id: cust_id,
                    otp: otpVal
                },

            });
            resolve(createDevice)

        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}
