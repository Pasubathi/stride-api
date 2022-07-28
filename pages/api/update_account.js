import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { d2c_bureaucheck, tuHardPull } from "./mulesoft_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function accountupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return accountUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function accountUpdate() {
        const { dob, gender, pin, user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "User sfid is mandatory" })
        if (dob == "" || dob == undefined)
            return res.status(200).send({ status:"error", message: "DOB cannot be empty" })
        if (gender == "" || gender == undefined)
            return res.status(200).send({ status:"error", message: "Gender cannot be empty" })
        if (pin == "" || pin == undefined)
            return res.status(200).send({ status:"error", message: "Pincode cannot be empty" })
        try {
            const cust_id = String(user_sfid);
            const pin_code = Number(pin);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id
                },
                select:{
                    first_name__c:true,
                    last_name__c: true,
                    sfid:true,
                    phone: true,
                    pan_verified__c:true,
                    pan_number__c:true,
                    email__c:true,
                    is_qde_1_form_done__c:true,
                    is_photo_verified__c:true,
                    is_bank_detail_verified__c:true,
                    is_name_match__c:true,
                    account_status__c:true,
                    is_qde_2_form_done__c:true,
                    id:true,
                    customer_account_status__c:true,
                    is_pan_document_verified__c:true,
                    date_of_birth_applicant__c:true,
                    is_address_document_verified__c:true,
                    ipa_basic_bureau__c: true,
                    is_pan_confirm__c: true,
                    is_limit_confirm__c: true,
                    nach_provider__c: true,
                    client_nach_id__c: true,
                    is_nach_approved__c: true,
                    current_address_id__c: true
                }
            });
            if(accountDet)
            {
                const updateUser = await prisma.account.update({
                    where: {
                        sfid: cust_id
                    },
                    data: {
                        approved_pin_code__c: pin_code,
                        gender__c: gender,
                        date_of_birth_applicant__c: new Date(dob),
                        is_qde_1_form_done__c: true
                    },
                });
                let getData = {
                        onbording: 3
                    }
               
                if (updateUser)
                {
                    console.log("accountDet.ipa_basic_bureau__c", accountDet.ipa_basic_bureau__c);
                    if(!accountDet.ipa_basic_bureau__c)
                    {
                        let obj = {
                            sfid: cust_id
                        }
                        const getD2C = await d2c_bureaucheck(obj);
                        if(getD2C.status =="success")
                        {
                            const updateUser = await prisma.account.update({
                                where: {
                                    sfid: cust_id
                                },
                                data: {
                                    ipa_basic_bureau__c: Number(getD2C.limit),
                                },
                            });
                            return res.status(200).json({ status:"success", message: "Details updated successfully", d2cData: getD2C, accountDet })
                        }else{
                            const accountAdrs = await prisma.address__c.findFirst({
                                where: { account__c: accountDet.sfid },
                                orderBy: { id: 'desc' }
                            }); 
                            const setData = {
                                amount: "150000",
                                sfid: accountDet && accountDet.sfid,
                                city: accountAdrs && accountAdrs.city__c? accountAdrs.city__c:'',
                                fname: accountDet && accountDet.first_name__c? accountDet.first_name__c:'',
                                lname: accountDet && accountDet.last_name__c? accountDet.last_name__c:'',
                                pan: accountDet && accountDet.pan_number__c? accountDet.pan_number__c:'',
                                phone: accountDet && accountDet.phone? accountDet.phone:'',
                                pincode: accountAdrs && accountAdrs.pincode__c? accountAdrs.pincode__c:'',
                                address: accountAdrs && accountAdrs.address__c? accountAdrs.address__c:'',
                                dob: accountDet && accountDet.date_of_birth_applicant__c? accountDet.date_of_birth_applicant__c:''
                            }
                            const tu_hardPull = await tuHardPull(setData);
                            if(tu_hardPull.status =="success")
                            {
                            await prisma.account.update({
                                    where: {
                                        sfid: cust_id
                                    },
                                    data: {
                                        ipa_basic_bureau__c: Number(tu_hardPull.limit),
                                    },
                                });
                                return res.status(200).json({ status:"success", message: "Details updated successfully",  d2cData: getD2C, tuHardPull: tu_hardPull, accountDet})
                            }else{
                                return res.status(200).json({ status:"success", d2cData: getD2C, tuHardPull: tu_hardPull, accountDet })
                            }
                        }
                    }else{
                        return res.status(200).json({ status:"success", message: "Details updated successfully", accountDet})
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

