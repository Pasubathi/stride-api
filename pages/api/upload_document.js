import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { uploadFile } from "./eduvanz_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function uploadDocument(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return uploadDocument();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function uploadDocument() {
        const { document_type, doc__type, user_sfid } = req.body;
        if (document_type == "" || document_type == undefined)
            return res.status(500).send({ message: "Doctype is mandatory" })
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(500).send({ message: "User sfid is mandatory" })
            
        try {
                const accountUser = await prisma.account.findFirst({
                    where: {
                        sfid: String(user_sfid)
                    }
                });
                if(accountUser)
                {
                    let obj = {}
                    if(document_type == "Pan-Front")
                    {
                        obj.is_pan_document_verified__c = true;
                        obj.is_pan_document_uploaded__c = true;
                        if(accountUser.is_address_document_verified__c && accountUser.is_photo_verified__c)
                        {
                            obj.is_kyc_document_verified__c = true;
                        }
                    }else
                    {
                        obj.is_address_document_verified__c = true
                        obj.is_address_document_uploaded__c = true
                        if(accountUser.is_pan_document_verified__c && accountUser.is_photo_verified__c)
                        {
                            obj.is_kyc_document_verified__c = true;
                        }
                    }
/* 
                    await prisma.account_attachment.create({
                        data: {
                            cust_id: Number(id),
                            document_id: document_id,
                            document_type: document_type,
                            doc__type: doc__type?doc__type:null
                        },
                    }); */
                    await prisma.account.update({
                        where: {
                            sfid: String(user_sfid)
                        },
                        data: obj,
                    });
                    return res.status(200).send({  status:"success", "message":"Success"});
                }else{
                    return res.status(200).send({  status:"error", "message":"Account Not Found"});
                }
        } catch (error) {
            return res.status(200).send({  status:"error", message: error.message ? error.message : error });
        }
    }
}
