import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
// export default apiHandler(profileupdate);
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function accountProfileById(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return accountProfileById();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function accountProfileById() {
        const { device_id } = req.body;
        if (device_id == "" || device_id == undefined)
            return res.status(200).send({ status:"error",message: "Customer id cannot be empty" })
       
        try {
            var device_id1 = String(device_id);
            const accountDet = await prisma.account.findFirst({
                where:{
                    device_id__c: device_id1
                },
                select: {
                    first_name__c: true,
                    last_name__c: true,
                    date_of_birth_applicant__c: true,
                    ipa_basic_bureau__c: true,
                    pan_verified__c: true,
                    pan_number__c: true,
                    email__c: true,
                    is_qde_1_form_done__c:true,
                    is_photo_verified__c:true,
                    is_bank_detail_verified__c:true,
                    is_name_match__c:true,
                    account_status__c:true,
                    is_qde_2_form_done__c:true,
                    is_address_document_verified__c:true,
                    is_address_document_uploaded__c: true,
                    is_pan_document_uploaded__c: true,
                    approved_pin_code__c: true,
                    id:true,
                    customer_account_status__c:true,
                    is_pan_document_verified__c:true,
                    is_kyc_document_verified__c: true,
                    is_photo_uploaded__c: true,
                    gender__c: true,
                    phone: true,
                    pin_code__c: true,
                    resident_type__c: true,
                    rent_amount__c: true,
                    employer_type__c: true,
                    monthly_income__c: true,
                    occupation__c: true,
                    employer_name__c: true,
                    industry: true,
                    sfid: true,
                    is_pan_confirm__c: true,
                    is_limit_confirm__c: true,
                    nach_provider__c: true,
                    client_nach_id__c: true,
                    is_nach_approved__c: true,
                    current_address_id__c: true,
                    account_partner__c:{
                        select:{
                            account_to__c: true,
                            account_from__c: true
                        }
                    }
                }
            });
            if (accountDet) {
                return res.status(200).json({ status:"success",accountDet})
            } else {
                return res.status(200).json({ status:"error",message: "Detail is not found" })
            }
            
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

