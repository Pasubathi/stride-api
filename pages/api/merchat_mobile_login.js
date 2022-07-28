// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware'
import notification from "./notification"
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
                        name: "Merchant",
                    },
                });
                var mpinVal;
                var mpinId;
               
                let sfId = recordDet.sfid.toString();
                let RecordId = (accountDet && accountDet.recordtypeid !=undefined && accountDet.recordtypeid !=null)?accountDet.recordtypeid.toString():null;
                if (accountDet && sfId == RecordId) {
                    let data = {
                        mobile: mobile_no,
                        otp: otpVal
                    }
                    const smsRes = await sendOtp(data);
                    mpinVal = accountDet && accountDet.mpin__c ? accountDet.mpin__c : "";
                    const logDet = await createlogHistoryDetail(mobile_no, device_id, accountDet.id, otpVal)
                    return res.status(200).json({
                        responseCode:200,
                        verificationType: "otp",
                        message: "OTP sent to your mobile number",
                        id: logDet.log_id,
                        otp:otpVal,
                        isNewUser: false,
                    })

                } else {
                    res.status(500).send({ responseCode:500,message: "Mobile number does not exist" });
                    return;
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