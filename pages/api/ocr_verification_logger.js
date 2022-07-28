
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from './../../helpers/api';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function ocrVerificationLogger(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return ocrVerificationLogger();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function ocrVerificationLogger() {
        console.log(req.body);
        const { user_sfid, type, response, request } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "ID is mandatory" })
        if (type == "" || type == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "Response type is mandatory" })
        if (response == "" || response == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "Response is mandatory" })
        try {
            const sfid = String(user_sfid);
            const Type = String(type);
            const Request_c = request?String(request):null;
            const Response_c = String(response);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            if(accountDet)
            {
                if(Type =="SUCCESS")
                {
                    await prisma.api_logger__c.create({
                        data: {
                            response__c: Response_c,
                            service__c: "OCR VERIFICATION",
                            request__c: Request_c?Request_c:null,
                            account__c: accountDet.sfid,
                        }
                    }); 
                    return res.status(200).json({ responseCode: 200,status:"success", message: "Success" })
                }else if(Type =="ERROR")
                {
                    await prisma.custom_error__c.create({
                        data: {
                            exception_message__c: Response_c,
                            service__c: "OCR VERIFICATION",
                            account__c: accountDet.sfid,
                        }
                    }); 
                    return res.status(200).json({ responseCode: 200,status:"success", message: "Success" })
                }else {
                    return res.status(500).json({ responseCode: 200,status:"error", message: "Type not found" })
                }
            }else{
                return res.status(500).json({ responseCode: 200,status:"error", message: "Account not found" })
            }
        } catch (error) {
            res.status(200).send({ responseCode: 200,status:"error", message: error.message ? error.message : error })
        }
    }
}

