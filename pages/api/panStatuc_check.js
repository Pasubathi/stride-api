
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { PAN_CHECK } from "./api";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function bureaucheck(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return bureauCheck();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function bureauCheck() {
        try {
            const { id } = req.body;
            if (id == "" || id == undefined)
            return res.status(200).send({ status:"error", message: "Account id is mandatory" })
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: id
                }
            });
            let data =   {
                "pan": accountDet.pan_number__c,
                "name": accountDet.first_name__c
              }
              const channel_id = process.env.USER_CHANNEL_ID;
              const client_id = process.env.USER_CLIENT_ID;
              const client_secret = process.env.USER_CLIENT_SECRET;
              const transaction_id = Math.floor(100000 + Math.random() * 900000);
              const headers = new Headers();
              headers.append('channel_id', channel_id);
              headers.append('transaction_id', transaction_id);
              headers.append('client_id', client_id);
              headers.append('client_secret', client_secret);
              headers.append('content-type', 'application/json');
              const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
              };
            const getdata = await fetch(PAN_CHECK, init).then((response) => response.json())
             .then((response) => {
                  return response;
             });
             if(getdata.code ==="SUCCESS" )
             {
                 const details = getdata.data;
                 if(details.status ==="ACTIVE")
                 {
                     let data = {
                        PAN_Number__c: accountDet.pan_number__c,
                        Status__c: details.status,
                        Pricing_Strategy__c: getdata.pricingStrategy,
                        Message__c: getdata.message,
                        Is_Match__c: details.isMatch,
                        Full_Name__c: details.fullName,
                        Extra__c: getdata.extra,
                        Code__c : getdata.code,
                        Aadhaar_Binding_Status__c : details.aadhaarBindingStatus,
                     }
                    const panDet = await prisma.pan_status_check.findFirst({
                        where: {
                            PAN_Number__c: accountDet.pan_number__c
                        }
                    });
                    if(!panDet)
                    {
                        await prisma.pan_status_check.create({
                            data: data
                        });
                    }else{
                        await prisma.pan_status_check.update({
                            where: {
                                PAN_Number__c: accountDet.pan_number__c
                            },
                            data: data,
                        });
                    }
                    return res.status(200).send({  status:"success", message:'Success'});
                 }else{
                    return res.status(200).send({  status:"error", message:'Ivalid pan number'});
                 }
             }
        } catch (error) {
            return res.status(200).send({  status:"error", message: error.message ? error.message : error })
        }
    }
}

