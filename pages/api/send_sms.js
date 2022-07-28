// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware';
import { sendOtp } from "./eduvanz_api";

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function sendotpHandler(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return sendOtpHandler();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function sendOtpHandler() {
            const { mobile_no } = req.body;
            if (mobile_no == "" || mobile_no == undefined || mobile_no.length != 10)
                return res.status(200).send({ responseCode:200,status:"error",message: "Invalid mobile number" })  
            let device_id = '';
            let otpVal = Math.floor(1000 + Math.random() * 9000);
            //let otpVal = 1234;
            var minutesToAdd = 3;
            var currentDate = new Date();
            var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
            try {
                    let data = {
                        mobile: mobile_no,
                        otp: otpVal
                    }
                    const response = await sendOtp(data)
                    return res.status(200).json(response)
                    
            } catch (e) {
                res.status(200).send({ responseCode:200,status:"error",message: e.message ? e.message : e });
                return;
            }// update otp process
        }
    } catch (error) {
        res.status(200).send({responseCode:200,status:"error", message: error.message ? error.message : error })
    } // get mobile number process

}

function updatelogHistoryDetail(otpVal, log_id) {
    return new Promise((resolve, reject) => {
        try {
            const createDevice = prisma.log_history.update({
                where: {
                    log_id: Number(log_id)
                },
                data: {
                    otp: Number(otpVal)
                },

            });
            resolve(createDevice)

        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

