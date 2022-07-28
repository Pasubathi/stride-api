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
export default async function registerHandler(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return doRegister();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function doRegister() {
        const { mobileNumber, first_name, last_name, email } = req.body;
        if (mobileNumber == "" || mobileNumber == undefined)
            return res.status(500).send({ message: "Mobile Number is mandatory" })
        if (first_name == "" || first_name == undefined)
            return res.status(500).send({ message: "First Name is mandatory" })
        if (last_name == "" || last_name == undefined)
            return res.status(500).send({ message: "Last Name is mandatory" })
        if (email == "" || email == undefined)
            return res.status(500).send({ message: "Email is mandatory" })
        try {
            const user = await prisma.account.findUnique({
                where: {
                    phone: mobileNumber
                }
            });
            const emailUser = await prisma.account.findFirst({
                where: {
                    email__c: email
                }
            });
            if (!user) {
               // let otpVal = Math.floor(1000 + Math.random() * 9000);
               if (!emailUser) {
                    let otpVal = 1111;
                    var minutesToAdd = 3;
                    var currentDate = new Date();
                    var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
                    var device_id = '';
                    let data = {
                        mobile: mobileNumber,
                        otp: otpVal
                    }
                  //  const smsRes = await sendOtp(data);
                    try {
                        const recordDet = await prisma.recordtype.findFirst({
                            where: {
                                name: "Merchant",
                            },
                        });
                        const getData = await prisma.account.findFirst({ orderBy: { id: 'desc' } });
                        let tempid = (getData.id+1).toString();
                        const createUser = await prisma.account.create({
                            data: {
                                phone: mobileNumber,
                                heroku_external_id__c: tempid,
                                first_name__c: first_name,
                                last_name__c: last_name,
                                email__c: email,
                                accountsource: 'Merchant Dashboard',
                                recordtypeid: recordDet.sfid.toString()
                            },
                        });
                        notification.sendOtp()
                        if (createUser) {
                            const logDet = await createlogHistoryDetail(mobileNumber, device_id, createUser.id, otpVal)
                            return res.status(200).json({
                                responseCode: 200,
                                verificationType: "otp",
                                message: "OTP sent to your mobile number",
                                id: logDet.log_id,
                                otp: otpVal,
                                isNewUser: true,
                            })
                        }
                    } catch (e) {
                        res.status(500).send({ message: e.message ? e.message : e })
                    }
                } else {
                    return res.status(500).send({ message: "Email is present so please try with login" })
                }
            } else {
                return res.status(500).send({ message: "Mobile number is present so please try with login" })
            }
        } catch (error) {
            res.status(500).send({ message: error.message ? error.message : error })
        }
    }
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

