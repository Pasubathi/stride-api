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
                return updateAddress();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function updateAddress() {
           const { address_id, address, address1, state, city, pincode, id } = req.body;
            if (address_id == "" || address_id == undefined)
                return res.status(200).send({ status: "error", message: "Address id is mandatory" })
            if (address == "" || address == undefined)
                return res.status(200).send({ status: "error", message: "Address is mandatory" })
            if (state == "" || state == undefined)
                return res.status(200).send({ status: "error", message: "State is mandatory" })
            if (city == "" || city == undefined)
                return res.status(200).send({ status: "error", message: "City is mandatory" })
            if (pincode == "" || pincode == undefined)
                return res.status(200).send({ status: "error", message: "Pincode is mandatory" })
            if (id == "" || id == undefined)
                return res.status(200).send({ status: "error", message: "Id is mandatory" })
            
                try {
                let addressId = Number(address_id);
                let cust_id = Number(id);
                let reqAdd = `${address}${address1?','+address1:''}`; 
                let data = {
                    address__c: reqAdd,
                    state__c: state,
                    city__c: city,
                    pincode__c: pincode,
                };
                const addressDet = await prisma.address__c.update({
                    where: {
                        id: addressId
                    },
                    data: data
                });
                await prisma.account.update({
                    where: {
                        id: cust_id
                    },
                  data:{
                        is_qde_2_form_done__c: true
                  }
                });
                if(addressDet)
                {
                    return res.status(200).json({ status: "success", message: "Address updated successfully" })
                }else{
                    return res.status(200).json({ status: "error", message: "Address not found" })
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



