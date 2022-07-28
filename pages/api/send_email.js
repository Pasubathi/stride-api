// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware'
import { sendEmail } from "./eduvanz_api"
/* 
import { SMTPClient } from 'emailjs'; */

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function sendUserEmail(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return sendUserEmail();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function sendUserEmail() {
            
            const username = process.env.USER_SMTP_USERNAME
            const password = process.env.USER_SMTP_PASSWORD
            const host = process.env.USER_SMTP_HOST
            const email_From  = process.env.USER_SMTP_FROM
            /* const client = new SMTPClient({
                user: username,
                password: password,
                host: host,
                ssl:true
              }); */
              let nodemailer = require('nodemailer');
              const transporter = nodemailer.createTransport({
                host: host,
                port: 587,
                auth: {
                    user: username,
                    pass: password
                }
            })
            try {
                /*  const sendMail =  client.send({
                            text: `Just for testing purpose`,
                            from: email_From,
                            to: 'yuvangopi4@gmail.com',
                            subject: 'testing emailjs',
                        });
                        
                        await transporter.sendMail({
                            from: 'from_address@example.com',
                            to: 'to_address@example.com',
                            subject: 'Test Email Subject',
                            html: '<h1>Example HTML Message Body</h1>'
                        });
                        
                        */

                     const sendMail =  await transporter.sendMail({
                            from: 'from_address@example.com',
                            to: 'yuvangopi4@gmail.com',
                            subject: 'Test Email Subject',
                            text: 'Example Plain Text Message Body'
                        });
                 console.log("sendMail", sendMail);
                  return  res.status(200).send({ responseCode:200, status:"success", message: sendMail });
            } catch (e) {
                res.status(200).send({ responseCode:200,status:"error",message: e.message ? e.message : e });
                return;
            }// update otp process
        }
    } catch (error) {
        res.status(200).send({responseCode:200,status:"error", message: error.message ? error.message : error })
    } // get mobile number process

}
