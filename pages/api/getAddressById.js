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
            const { address_id } = req.body;
           if (address_id == "" || address_id == undefined)
                return res.status(200).send({ status: "error", message: "Address id is mandatory" })
            try {
                let id = Number(address_id);
                const addressDet = await prisma.address__c.findFirst({
                    where: {
                        id: id
                    }
                });
                if(addressDet)
                {
                    return res.status(200).json({ status: "success", message: "Success", data: addressDet })
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



