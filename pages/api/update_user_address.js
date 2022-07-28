// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function updateUserAddress(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getUserAddress();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getUserAddress() {
            const { user_sfid, address_id } = req.body;
            if (user_sfid == "" || user_sfid == undefined)
                return res.status(200).send({ status: "error", message: "User sfid is mandatory" })
            if (address_id == "" || address_id == undefined)
                return res.status(200).send({ status: "error", message: "Address is mandatory" })
            try {
                const cust_id = String(user_sfid);
                const cust_address_id = String(address_id);
                const ProfileDet = await prisma.account.findFirst({
                    where: {
                        sfid: cust_id
                    }
                });
                if(ProfileDet)
                {
                    await prisma.account.update({
                        where:{
                            sfid: cust_id
                        },
                        data:{
                            is_qde_2_form_done__c: true,
                            current_address_id__c: cust_address_id
                        }, 
                    });
                    
                    return res.status(200).json({ status: "success", message: "Address updated successfully" })
                }else{
                    return res.status(200).json({ status: "error", message: "Account not found" })
                }

            } catch (e) {
                res.status(500).send({ responseCode:500,message: e.message ? e.message : e });
                return;
            }
        }
    } catch (error) {
        res.status(500).send({responseCode:500, message: error.message ? error.message : error })
    } 

}



