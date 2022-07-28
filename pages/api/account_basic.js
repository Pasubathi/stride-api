import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { SALES_FORCE } from "./api";
import { checkSofttPull } from './mulesoft_api';
import { getPanProfile, checkPanStatus } from "./eduvanz_api";
import { updateAccount, getAccount } from "./salesforce_api";
// export default apiHandler(profileupdate);
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function profileupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return profileUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function profileUpdate() {
        const { first_name, last_name, user_sfid, mobile, email, google_id } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "id is mandatory" })
        if (first_name == "" || first_name == undefined)
            return res.status(200).send({ status:"error",message: "First Name is mandatory" })
        if (email == "" || email == undefined)
            return res.status(200).send({ status:"error",message: "Email id is mandatory" })

        let isBre1Called = false;
        let isPanStatusCalled = false;
        let isPanProfileCalled = false;
        let isUpdated = false;
        try {
            const init = {
                method: 'POST'
            };
            const userSfid = String(user_sfid);
            let updateObj = {
                First_Name__c:  first_name,
                FirstName: first_name,
                Last_Name__c: last_name,
                LastName: last_name,
                Email__c: email,
                PAN_Verified__c:false,
                Is_QDE_1_form_done__c:false,
                IPA_Basic_Bureau__c:0,
                PAN_Number__c: ''
            }
            const tempid =  await generateExternalId(18);
            let softData = {
                id: user_sfid,
                first_name: first_name,
                last_name: last_name,
                mobile: mobile,
                sfid: userSfid,
                tempid: tempid
            }
            const softpullData = await checkSofttPull(softData);
            console.log("softpullData", softpullData);
            if(softpullData.status =="success" )
            {
                isBre1Called = true;
                let obj = softpullData.data;
                let limit_data = Number(obj && obj.limit?obj.limit:0);
                console.log("obj data", obj);
                updateObj.IPA_Basic_Bureau__c = limit_data;
                updateObj.PAN_Number__c = obj && obj.pan?obj.pan:null;
                updateObj.Is_pan_confirm__c = true
                
                if(obj && obj.pan && obj.pan !==undefined)
                {
                    let subData = {
                        pan: obj.pan,
                        name: first_name,
                        cust_id: userSfid,
                        token: "",
                        sfid: userSfid,
                        salesForceObj: updateObj,
                    }
                    const chekpan = await checkPanStatus(subData);
                    if(chekpan && chekpan.status !==undefined && chekpan.status ==="success")
                    {
                        isPanStatusCalled = true;
                        updateObj = chekpan && chekpan.data?chekpan.data:updateObj;
                        subData.salesForceObj = updateObj;
                        const profileDet = await getPanProfile(subData);
                        if(profileDet && profileDet.status !==undefined && profileDet.status ==="success")
                        {
                            updateObj = profileDet.sfObj;
                            isPanProfileCalled = true;
                        }
                    }
                }
            }

            const accountDet = await prisma.account.findFirst({
                where:{
                    sfid: userSfid
                }
            });
            if(accountDet)
            {
                let obj = {
                    first_name__c: updateObj && updateObj.First_Name__c !==undefined && updateObj.First_Name__c?updateObj.First_Name__c:null,
                    firstname: updateObj && updateObj.FirstName !==undefined && updateObj.FirstName?updateObj.FirstName:null,
                    last_name__c: updateObj && updateObj.Last_Name__c !==undefined && updateObj.Last_Name__c?updateObj.Last_Name__c:null,
                    lastname: updateObj && updateObj.LastName !==undefined && updateObj.LastName?updateObj.LastName:null,
                    email__c: updateObj && updateObj.Email__c !==undefined && updateObj.Email__c?updateObj.Email__c:null,
                    ipa_basic_bureau__c: updateObj && updateObj.IPA_Basic_Bureau__c !==undefined && updateObj.IPA_Basic_Bureau__c?updateObj.IPA_Basic_Bureau__c:null,
                    pan_number__c: updateObj && updateObj.PAN_Number__c !==undefined && updateObj.PAN_Number__c?updateObj.PAN_Number__c:null,
                    pan_verified__c: updateObj && updateObj.PAN_Verified__c !==undefined && updateObj.PAN_Verified__c?updateObj.PAN_Verified__c:null,
                    date_of_birth_applicant__c: updateObj && updateObj.Date_Of_Birth_Applicant__c !==undefined && updateObj.Date_Of_Birth_Applicant__c?new Date(updateObj.Date_Of_Birth_Applicant__c):null,
                    approved_pin_code__c: updateObj && updateObj.Approved_Pin_Code__c !==undefined && updateObj.Approved_Pin_Code__c?Number(updateObj.Approved_Pin_Code__c):null,
                    gender__c: updateObj && updateObj.Gender__c !==undefined && updateObj.Gender__c?String(updateObj.Gender__c):null,
                    is_pan_confirm__c: updateObj && updateObj.Is_pan_confirm__c !==undefined && updateObj.Is_pan_confirm__c?true:false,
                    current_address_id__c: updateObj && updateObj.Current_Address_Id__c !==undefined && updateObj.Current_Address_Id__c?updateObj.Current_Address_Id__c:null,
                    is_qde_1_form_done__c:  updateObj && updateObj.Is_QDE_1_form_done__c !==undefined && updateObj.Is_QDE_1_form_done__c?true:false,
                }
                const acccountUpdate = await prisma.account.update({
                    where:{
                        sfid: userSfid
                    },
                    data: obj
                });
                isUpdated = true;
            }
            
            console.log("updateObj-------------->", updateObj);
            return res.status(200).json({ status:"success", message: "Updated successfully", data: updateObj,isBre1Called:isBre1Called,isUpdated:isUpdated,isPanProfileCalled:isPanProfileCalled,isPanStatusCalled:isPanStatusCalled})
           
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error,isBre1Called:isBre1Called,isUpdated:isUpdated,isPanProfileCalled:isPanProfileCalled,isPanStatusCalled:isPanStatusCalled})
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


