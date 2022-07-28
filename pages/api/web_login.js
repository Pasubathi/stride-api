// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware'
import { sendOtp } from "./eduvanz_api"

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function webLoginHandler(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return webLoginHandler();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function webLoginHandler() {
            const { mobile_no } = req.body;
            if (mobile_no == "" || mobile_no == undefined || mobile_no.length != 10)
                return res.status(500).send({ responseCode:500,message: "Mobile Number is mandatory" })
            
            let device_id = '';
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
                let RecordId = (accountDet && accountDet.recordtypeid !=undefined && accountDet.recordtypeid !=null)?accountDet.recordtypeid.toString():null;
               
                if (accountDet &&  sfId == RecordId) {
                   
                    mpinVal = accountDet && accountDet.mpin__c ? accountDet.mpin__c : "";
                    const logDet = await createlogHistoryDetail(mobile_no, device_id, accountDet.id, otpVal)
                    if(!mpinVal)
                    {
                        let data = {
                            mobile: mobile_no,
                            otp: otpVal
                        }
                    }
                    return res.status(200).json({
                        responseCode:200,
                        verificationType: mpinVal ? "mPin" : "otp",
                        message: mpinVal ? "Use your mpin to login" : "OTP sent to your mobile number",
                        id: mpinVal ? accountDet.id:logDet.log_id,
                        otp: mpinVal ? mpinVal : otpVal,
                        logId: logDet.log_id,
                        isNewUser: false
                    })

                } else {
                        if(accountDet)
                        {
                            return res.status(500).send({ responseCode:500,message: "Invalid Login Crentials" });
                        }else{
                            const getData = await prisma.account.findFirst({ orderBy: { id: 'desc' } });
                            let tempid = (getData?getData.id+1:1).toString();
                            /* const createUser = await prisma.account.create({
                                data: {
                                    phone: mobile_no,
                                    heroku_external_id__c: tempid,
                                    first_name__c: "Eduvanz",
                                    last_name__c: "User",
                                    lastname: "User",
                                    accountsource: 'Website',
                                    account_status__c: 'Partial User',
                                    recordtypeid: recordDet.sfid.toString()
                                },
                            }); */
                            /* if (createUser) {
                                let data = {
                                    mobile: mobile_no,
                                    otp: otpVal
                                } */
                              //  const logDet = await createlogHistoryDetail(mobile_no, device_id, createUser.id, otpVal)
                                const logDet = await createlogHistoryDetail(mobile_no, device_id, '', otpVal)
                                return res.status(200).json({
                                    responseCode:200,
                                    verificationType: mpinVal ? "mPin" : "otp",
                                    message: mpinVal ? "Use your mpin to login" : "OTP sent to your mobile number",
                                    id: logDet.log_id,
                                    otp: mpinVal ? mpinVal : otpVal,
                                    logId: logDet.log_id,
                                    isNewUser: true,
                                })
                            /* } */
                        } 
                }

            } catch (e) {
                res.status(500).send({ responseCode:500,message: e.message ? e.message : e });
                return;
            }// update otp process
        }
    } catch (error) {
        res.status(500).send({responseCode:500, message: error.message ? error.message : error })
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