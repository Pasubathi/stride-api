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

export default async function lenderLoginHandler(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return lenderLoginHandler();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function lenderLoginHandler() {
            const { email, password } = req.body;
            if (email == "" || email == undefined)
                return res.status(500).send({ responseCode:500,message: "Email is mandatory" })
            if (password == "" || password == undefined)
                return res.status(500).send({ responseCode:500,message: "Password is mandatory" })
            let device_id = '';
            try {
                const accountDet = await prisma.account.findFirst({
                    where: {
                        email__c: email
                    }
                });
                const recordDet = await prisma.recordtype.findFirst({
                    where: {
                        name: "Lender",
                    },
                });
                
                let sfId = recordDet.sfid.toString();
                let RecordId = (accountDet && accountDet.recordtypeid !=undefined && accountDet.recordtypeid !=null)?accountDet.recordtypeid.toString():null;
                if (accountDet && sfId == RecordId) {
                     // create a jwt token that is valid for 7 days
                     if(password === accountDet.temp_password__c)
                     {
                        var otpVal = 1234;
                        const logDet = await createlogHistoryDetail(accountDet.phone, device_id, accountDet.id, otpVal)
                        const token = jwt.sign({ sub: logDet.log_id }, serverRuntimeConfig.secret, { expiresIn: '1d' });
                        return res.status(200).json({
                           responseCode:200,
                           message:"Login Successfully",
                           id: accountDet.id,
                           first_name: accountDet.first_name__c,
                           last_name:accountDet.last_name__c,
                           email:accountDet.email__c,
                           mobile: accountDet.phone,
                           sfid: accountDet.sfid,
                           token
                       })
                     }else{
                        return res.status(500).json({
                            responseCode:500,
                            message: "Invalid Login Credential",
                        })
                     }
                }else{
                    return res.status(500).json({
                        responseCode:500,
                        message: "Invalid Login Credential",
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


