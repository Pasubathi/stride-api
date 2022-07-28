
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { PAN_PROFILE } from "./api";
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
                "name": accountDet.first_name__c,
                "getContactDetails": "Y",
                "consent": "Y"
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
            const getdata = await fetch(PAN_PROFILE, init).then((response) => response.json())
             .then((response) => {
                  return response;
             });
             if(getdata.result !== undefined)
             {
                let resData = getdata.result;
                console.log('Pan', resData.pan);
                const panDet = await prisma.pan_profile.findFirst({
                    where: {
                        PAN_Number__c: resData.pan
                    }
                });
                let data = {
                    "PAN_Number__c": resData.pan,
                    "Name": resData.name?resData.name:null,
                    "First_Name__c": resData.firstName?resData.firstName:null,
                    "Middle_Name__c": resData.middleName?resData.middleName:null,
                    "Last_Name__c": resData.lastName?resData.lastName:null,
                    "Gender__c": resData.gender?resData.gender:null,
                    "Aadhaar_Linked__c": resData.aadhaarLinked?resData.aadhaarLinked:null,
                    "Aadhaar_Match__c": resData.aadhaarMatch?resData.aadhaarMatch:null,
                    "Date_Of_Birth__c": resData.dob?resData.dob:null,
                    "Building_Name__c": resData.address.buildingName?resData.address.buildingName:null,
                    "Locality__c": resData.address.locality?resData.address.locality:null,
                    "Street_Name__c": resData.address.streetName?resData.address.streetName:null,
                    "Pin_Code__c": resData.address.pinCode?resData.address.pinCode:null,
                    "City__c": resData.address.city?resData.address.city:null,
                    "State__c": resData.address.state?resData.address.state:null,
                    "Country__c": resData.address.country?resData.address.country:null,
                    "Mobile_No__c": resData.mobileNo?resData.mobileNo:null,
                    "Email_Id__c": resData.emailId?resData.emailId:null,
                }
                if(!panDet){
                    await prisma.pan_profile.create({
                        data: data
                    });
                }else{
                    await prisma.pan_profile.update({
                        where: {
                            PAN_Number__c: resData.pan
                        },
                        data: data,
                    });
                }
                 return res.status(200).send({  status:"success", message:'Success'});
             }else{
                return res.status(200).send({  status:"error", message:getdata.message});
             }
           
            
        } catch (error) {
            return res.status(200).send({  status:"error", message: error.message ? error.message : error })
        }
    }
}

