import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function vendorLogger(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return vendorLogger();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function vendorLogger() {
        const { id, type, response, service } = req.body;
        if (id == "" || id == undefined)
            return res.status(200).send({ status:"error",message: "id is mandatory" })
        if (type == "" || type == undefined)
            return res.status(200).send({ status:"error",message: "Type is mandatory" })
        if (response == "" || response == undefined)
            return res.status(200).send({ status:"error",message: "Response is mandatory" })
        if (service == "" || service == undefined)
            return res.status(200).send({ status:"error",message: "Service is mandatory" })
        try {
            const Sfid = String(id);
            const accountCheck1 = await prisma.account.findFirst({
                where: {
                    sfid: Sfid
                }
            });
           
            if(accountCheck1)
            {
                const createLog = await prisma.vendor_log__c.create({
                    data: {
                        type__c: String(type),
                        account__c: accountCheck1.sfid,
                        response__c: String(response),
                        service__c: String(service)
                    },

                });
               
                if(createLog) {
                    return res.status(200).json({ status:"success", message: "Success" })
                } else {
                    return res.status(200).json({ status:"error",message: "Something Went Wrong" })
                }
            }else{
                 return res.status(200).json({ status:"error",message: "Account not found!." })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

function generateExternalId(length) {
    return new Promise((resolve, reject) => {
        try {
            let result = '';
            const characters ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const charactersLength = characters.length;
            for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            resolve(result)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

