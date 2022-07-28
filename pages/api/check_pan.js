import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import {checkPanStatus, getPanProfile} from "./eduvanz_api";
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
        const { pan, user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "User sfid is mandatory" })
        if (pan == "" || pan == undefined)
            return res.status(200).send({ status:"error",message: "Pan is mandatory" })
            const cust_id = String(user_sfid);    
        
        try {
           
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id,
                }
            });
            if(accountDet)
            {
                let updateObj = {
                    PAN_Verified__c: true,
                    Is_pan_confirm__c: true,
                    PAN_Number__c: pan
                }
                
                let subData = {
                    pan: pan,
                    name: accountDet.first_name__c,
                    cust_id: cust_id,
                    sfid: cust_id,
                    salesForceObj: updateObj
                }
                const getData = await getPanProfile(subData);
                if(getData && getData.status !==undefined && getData.status ==="success")
                {
                    const getData = getData && getData.sfObj?getData.sfObj:null;
                    updateObj = getData && getData?getData:updateObj;
                }
                let obj = {
                    pan_number__c: updateObj && updateObj.PAN_Number__c !==undefined && updateObj.PAN_Number__c?updateObj.PAN_Number__c:null,
                    date_of_birth_applicant__c: updateObj && updateObj.Date_Of_Birth_Applicant__c !==undefined && updateObj.Date_Of_Birth_Applicant__c?new Date(updateObj.Date_Of_Birth_Applicant__c):null,
                    approved_pin_code__c: updateObj && updateObj.Approved_Pin_Code__c !==undefined && updateObj.Approved_Pin_Code__c?Number(updateObj.Approved_Pin_Code__c):null,
                    gender__c: updateObj && updateObj.Gender__c !==undefined && updateObj.Gender__c?String(updateObj.Gender__c):null,
                    is_pan_confirm__c: updateObj && updateObj.Is_pan_confirm__c !==undefined && updateObj.Is_pan_confirm__c?true:false,
                    current_address_id__c: updateObj && updateObj.Current_Address_Id__c !==undefined && updateObj.Current_Address_Id__c?updateObj.Current_Address_Id__c:null,
                    is_qde_1_form_done__c:  updateObj && updateObj.Is_QDE_1_form_done__c !==undefined && updateObj.Is_QDE_1_form_done__c?true:false,
                    pan_verified__c: updateObj && updateObj.PAN_Verified__c !==undefined && updateObj.PAN_Verified__c?true:false,
                }
                await prisma.account.update({
                    where:{
                        sfid: cust_id
                    },
                    data: obj
                });
                console.log("Check Pan Response", getData);
                return res.status(200).json({ status:"success", message: "Validated suceessfully" });
            } else {
                return res.status(200).json({ status:"error",message: "Detail is not found" });
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

