import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { uploadFile } from "./eduvanz_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function updateUserProfile(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getPanProfile();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function getPanProfile() {
        const { user_sfid, livenessScore, isLive } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(500).send({ message: "Id is mandatory" })
            
        try {
                const accountUser = await prisma.account.findFirst({
                    where: {
                        sfid: String(user_sfid)
                    }
                });
                if(accountUser)
                {
                    let obj = {
                        is_photo_uploaded__c: true,
                        is_photo_verified__c: true
                    }
                    if(accountUser.is_pan_document_verified__c && accountUser.is_address_document_verified__c)
                    {
                        obj.is_kyc_document_verified__c = true;
                    }
                    await prisma.account.update({
                        where: {
                            sfid: String(user_sfid)
                        },
                        data: obj,
                    });
                    return res.status(200).send({  status:"success", "message":"Success"});
                }else{
                    return res.status(200).send({  status:"error", message:"Account not found" });
                }
        } catch (error) {
            return res.status(200).send({  status:"error", message: error.message ? error.message : error });
        }
    }
}
