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

export default async function sendUserOtp(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return sendUserOtp();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`);
        }
        async function sendUserOtp() {
            const { user_sfid } = req.body;
            if (user_sfid == "" || user_sfid == undefined)
                return res.status(500).send({ responseCode:500,message: "User sfid is mandatory" })
            
            let device_id = '';
            //let otpVal = Math.floor(1000 + Math.random() * 9000);
            let otpVal = 1111;
            const new_id = String(user_sfid);
            var minutesToAdd = 3;
            var currentDate = new Date();
            var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
            try {
                const accountDet = await prisma.account.findUnique({
                    where: {
                        sfid: new_id,
                    }
                });
                if(accountDet){
                    let data = {
                        mobile: accountDet.phone,
                        otp: otpVal
                    }
                   // await sendOtp(data);
                   const logDet = await createlogHistoryDetail(accountDet.phone, device_id, accountDet.id, otpVal)
                    return res.status(200).json({
                        status: 'success',
                        otp:otpVal,
                        logId: logDet.log_id
                    })

                } else {
                    return res.status(200).json({
                        status: 'error',
                        message: 'Account not found'
                    })
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