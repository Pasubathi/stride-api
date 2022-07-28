import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { getPanProfile, checkPanStatus } from "./eduvanz_api";
import { prisma } from "./_base";
import { SALES_FORCE } from "./api";
import { updateAccount } from "./salesforce_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function panupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return panUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function panUpdate() {
        const { pan, user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "User sfid is mandatory" })
            const cust_id = String(user_sfid);
        try {
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id,
                }
            });
            const name = accountDet.first_name__c;
            let subData = {
                pan: pan,
                name: name,
                cust_id: cust_id,
                sfid: accountDet.sfid
            }
            let updateObj = {
                PAN_Number__c: pan
            }
            const chekpan = await checkPanStatus(subData);
            console.log("chekpan", chekpan);
            if(chekpan && chekpan.status !==undefined && chekpan.status ==="success")
            {
                updateObj.Is_pan_confirm__c = true;
                updateObj.PAN_Verified__c = true;
                subData.salesForceObj = updateObj;
                const profiledata = await getPanProfile(subData);
                if(profiledata && profiledata.status !==undefined && profiledata.status ==="success")
                {
                    const getData = profiledata && profiledata.sfObj?profiledata.sfObj:null;
                    updateObj = getData && getData?getData:updateObj;
                }
                if(accountDet)
                {
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
                    const getData = await updateAccount(updateObj, salesForceToken, cust_id);
                    console.log("Sales Force Update ------------>", getData);
                }
                return res.status(200).json({status:"success",  message: "PAN number verified", profiledata: profiledata, chekpan: chekpan })
            }else {
                return res.status(200).json({ status:"error",  message: "Invalid Pan number", chekpan: chekpan })
            }
        } catch (error) {
            return res.status(200).send({ status:"error",  message: error.message ? error.message : error })
        }
    }
}

