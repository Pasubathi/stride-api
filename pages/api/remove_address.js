
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function removeAddress(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return removeAddress();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function removeAddress() {
        const { user_sfid, address_id } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
        return res.status(200).send({ status:"error", message: "ID is mandatory" })
        if (address_id == "" || address_id == undefined)
        return res.status(200).send({ status:"error", message: "Address Id  is mandatory" }) 
        try {
            const addressId = Number(address_id);
            const cust_id   = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id,
                }
            });
            if(accountDet)
            {
                const addressDet = await prisma.address__c.findFirst({
                    where:{
                        account__c: accountDet.sfid,
                        id: addressId
                    }
                });
                if(addressDet)
                {
                    await prisma.address__c.delete({
                        where:{
                            id: addressId
                        }
                    });
                    if(accountDet.current_address_id__c == String(addressId))
                    {
                       await prisma.account.updates({
                            where: {
                                id: accountDet.id,
                            },
                            data:{
                                current_address_id__c: ''
                            }
                        });
                    }
                    return res.status(200).json({ status: "success", message: "Removed Successfully" })
                }else{
                    return res.status(200).json({ status: "error", message: "Address not found" })
                }
            }else{
                return res.status(200).json({ status: "error", message: "Account not found" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

