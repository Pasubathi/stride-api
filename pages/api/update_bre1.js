import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { SALES_FORCE } from "./api";
import { apiHandler } from '../../helpers/api';
import { updateAccount } from "./salesforce_api";
// export default apiHandler(profileupdate);
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function updateBre1(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return updateBre1();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function updateBre1() {
        const {user_sfid,isBre1Called,isPanStatusCalled,isPanProfileCalled,First_Name__c,Last_Name__c,Email__c,IPA_Basic_Bureau__c,PAN_Number__c,Date_Of_Birth_Applicant__c,Approved_Pin_Code__c,Gender__c,Current_Address_Id__c, PAN_Verified__c, Is_pan_confirm__c, Is_QDE_1_form_done__c} = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Customer id cannot be empty" })
       
        try {
            let herokuObj = {
                first_name__c: First_Name__c, 
                firstname: First_Name__c,
                last_name__c: Last_Name__c,
                lastname: Last_Name__c,
                email__c: Email__c,
                ipa_basic_bureau__c: 0,
            }
            let updateObj = {
                First_Name__c:  First_Name__c,
                FirstName: First_Name__c,
                Last_Name__c: Last_Name__c,
                LastName: Last_Name__c,
                Email__c: Email__c,
                IPA_Basic_Bureau__c: 0
            }
            if(isBre1Called)
            {
                updateObj.IPA_Basic_Bureau__c = IPA_Basic_Bureau__c;
                updateObj.PAN_Number__c = PAN_Number__c;
                herokuObj.ipa_basic_bureau__c = IPA_Basic_Bureau__c;
                herokuObj.pan_number__c = PAN_Number__c;
            }
            
            if(isPanStatusCalled)
            {
                updateObj.PAN_Verified__c = PAN_Verified__c;
                updateObj.Is_pan_confirm__c = Is_pan_confirm__c;
                herokuObj.pan_verified__c = PAN_Verified__c;
                herokuObj.is_pan_confirm__c = Is_pan_confirm__c;
            }

            if(isPanProfileCalled)
            {
                const profileDet = await prisma.pan_profile__c.findFirst({
                    where: {
                        accountid__c: user_sfid
                    },
                    orderBy:{
                        id: 'desc'
                    }
                });
                updateObj.PAN_Number__c = profileDet && profileDet.pan__c? String(profileDet.pan__c):null;
                updateObj.Date_Of_Birth_Applicant__c = profileDet && profileDet.date_of_birth__c? String(profileDet.date_of_birth__c):null;
                updateObj.Approved_Pin_Code__c = profileDet && profileDet.pin_code__c? Number(profileDet.pin_code__c):null;
                updateObj.Gender__c = profileDet && profileDet.gender__c? String(profileDet.gender__c):null;
                updateObj.Is_pan_confirm__c = Is_pan_confirm__c;
                updateObj.Current_Address_Id__c = Current_Address_Id__c;
                updateObj.Is_QDE_1_form_done__c = Is_QDE_1_form_done__c;
                herokuObj.date_of_birth_applicant__c = profileDet && profileDet.date_of_birth__c? new Date(profileDet.date_of_birth__c):null;;
                herokuObj.approved_pin_code__c = profileDet && profileDet.pin_code__c? Number(profileDet.pin_code__c):null;
                herokuObj.gender__c = profileDet && profileDet.gender__c? String(profileDet.gender__c):null;
                herokuObj.is_pan_confirm__c = Is_pan_confirm__c;
                herokuObj.current_address_id__c = Current_Address_Id__c;
                herokuObj.is_qde_1_form_done__c = Is_QDE_1_form_done__c;
                herokuObj.pan_number__c = profileDet && profileDet.pan__c? String(profileDet.pan__c):null;
            }

            const userSfid = String(user_sfid);
            const userDet = await prisma.account.findFirst({
                where: {
                    sfid: userSfid,
                },
                select: {
                    id: true
                }
            });

            console.log("UpdateObj ------------>", updateObj); 
            console.log("HerokuObj ------------>", herokuObj);
            let isUpdated = "heroku";
            if(userDet){
                await prisma.account.update({
                    where: {
                        sfid: userSfid
                    },
                    data: herokuObj
                });
            }else{
                const init = {
                    method: 'POST'
                };
                const getdata = await fetch(SALES_FORCE, init).then((response) => response.json())
                .then((response) => {
                        return response;
                });
                let salesForceToken = '';
                if(getdata && getdata.access_token)
                {
                    salesForceToken = getdata.access_token
                }
                const getData = await updateAccount(updateObj, salesForceToken, userSfid);
                console.log("Sales Force Update ------------>", getData);
                isUpdated = "Salesforce";
            }
            return res.status(200).json({ status:"success", message:"Card added successfully",isUpdated:isUpdated})
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

