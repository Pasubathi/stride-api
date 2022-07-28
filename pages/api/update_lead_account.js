import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { bureauHardPull } from "./mulesoft_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function leadAccountUpdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return leadAccountUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function leadAccountUpdate() {
        const { dob, gender, pin, id } = req.body;
        if (id == "" || id == undefined)
            return res.status(200).send({ status:"error", message: "id is mandatory" })
        if (dob == "" || dob == undefined)
            return res.status(200).send({ status:"error", message: "DOB cannot be empty" })
        if (gender == "" || gender == undefined)
            return res.status(200).send({ status:"error", message: "Gender cannot be empty" })
        if (pin == "" || pin == undefined)
            return res.status(200).send({ status:"error", message: "Pincode cannot be empty" })
        try {
            let cust_id = Number(id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id
                }
            });
            if(accountDet)
            {
                const updateUser = await prisma.account.update({
                    where: {
                        id: cust_id
                    },
                    data: {
                        approved_pin_code__c: pin?Number(pin):null,
                        gender__c: gender,
                        date_of_birth_applicant__c: new Date(dob) 
                    },
                });
               
                if (updateUser) {
                        if(!accountDet.ipa_basic_bureau__c)
                        {
                            let obj = {
                                sfid: accountDet.sfid,
                                external_id: accountDet.heroku_external_id__c
                            }
                            const getObjData = await bureauHardPull(obj);
                            return res.status(200).json({ status:"success", message: "HARDPULL SUCCESS" , apiResponse:getObjData })
                        }else{
                            return res.status(200).json({ status:"success", message: "Details updated successfully" })
                        }
                } else {
                    return res.status(200).json({ status:"error",message: "Detail is not updated" })
                }
            }else{
                return res.status(200).json({ status:"error", message: "Detail is not updated" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

