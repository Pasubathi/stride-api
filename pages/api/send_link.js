
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { sendEmail } from "./eduvanz_api"
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function sendLink(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return sendLink();
        default:
            return res.status(500).send({ responseCode: 500, message: `Method ${req.method} Not Allowed` })
    }
    async function sendLink() {
        try {
            const { type, user_sfid, send_via, plan } = req.body;
            if (type == "" || type == undefined)
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Type is mandatory" })
            if (user_sfid == "" || user_sfid == undefined)
                return res.status(200).send({ responseCode: 200, status:"error",  message: "User sfid is mandatory" })
            /* if (send_via == "" || send_via == undefined)
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Send Via is mandatory" })
            */
            const Type        = String(type);
            const cust_id     = String(user_sfid);
            const accountDet  = await prisma.account.findFirst({
                where: {
                    sfid: cust_id,
                }
            });
            if(accountDet)
            {
                var link;
                const createNotification = await prisma.custom_notification__c.create({
                    data: {
                        account__c: accountDet.sfid,
                        action__c: Type,
                        name: accountDet.first_name__c
                    },
                });
                if(Type=="Agreement Signing")
                {
                    const productDet = await prisma.account_products.findFirst({
                        where: {
                            cust_id: accountDet.id
                        }, 
                        orderBy: {
                            id: 'desc',
                        },
                    });
                   link = `https://eduvanz-web.herokuapp.com/edplan_details/${productDet.product_id}/${plan}`;
                }else if(Type =="Physical Mandate")
                {
                    link = `https://eduvanz-web.herokuapp.com/ed_enach`;
                    
                }else if(Type =="Kyc Complete")
                {
                    link = `https://eduvanz-web.herokuapp.com/ed_doc`;
                }
                const obj = {
                    email: "yuvangopi4@gmail.com",// accountDet.email__c,
                    message: link,
                    subject: 'Eduvanz Notification'
                }
                const getData = await sendEmail(obj);    
                return res.status(200).send({ responseCode: 200, status:"success",  message: "Success"})
            }else{
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Details not found", })
            }
            
        } catch (error) {
            res.status(500).send({ responseCode: 500, message: error.message ? error.message : error })
        }
    }
}