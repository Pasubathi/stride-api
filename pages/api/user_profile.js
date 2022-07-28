import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function userProfile(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return userProfile();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function userProfile() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "User id cannot be empty" })
       
        try {
            const sfid = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                },
                select: {
                    first_name__c: true,
                    last_name__c: true,
                    ipa_basic_bureau__c: true,
                    pan_number__c: true,
                    aadhar_number__c: true,
                    email__c: true,
                    account_status__c:true,
                    phone: true,
                    resident_type__c: true,
                    rent_amount__c: true,
                    monthly_income__c: true,
                    occupation__c: true,
                    bank_name__c: true,
                    ifsc__c: true,
                    bank_account_number__c: true
                }
            });
            
            if (accountDet) {
                let addressDet;
                if(accountDet.current_address_id__c)
                {
                    addressDet = await prisma.address__c.findFirst({
                        where: {
                            id: Number(accountDet.current_address_id__c)
                        }
                    });
                }
                return res.status(200).json({ status:"success", account: accountDet, address: addressDet})
            } else {
                return res.status(200).json({ status:"error",message: "Detail is not found" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

