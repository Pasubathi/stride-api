import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function residentupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return residentUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function residentUpdate() {
        const { address, address1, state, city, pincode, type, user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status: "error", message: "User sfid is mandatory" })
        if (address == "" || address == undefined)
            return res.status(200).send({ status: "error", message: "Address is mandatory" })
        const cust_id = String(user_sfid);
        try {
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id
                }
                
            });
            const getData = await prisma.address__c.findFirst({ orderBy: { id: 'desc' } });
            let tempid = (getData.id+1).toString();
            let reqAdd = `${address}${address1?', '+address1:''}`; 
            let data = {
                heroku_external_id__c: tempid,
                name: type,
                account__c: accountDet.sfid,
                address__c: reqAdd,
                state__c: state?state:null,
                city__c: city?city:null,
                pincode__c: pincode?pincode:null,
            };
            const addressDet = await prisma.address__c.create({
                data: data
            });
              await prisma.account.update({
                where: {
                    sfid: cust_id
                },
              data:{
                    is_qde_2_form_done__c: true,
                    current_address_id__c: String(addressDet.id)
              }
            });
            return res.status(200).json({ status: "success", message: "Address Added successfully", data: addressDet.id })
        
        } catch (error) {
            res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

