import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function rentDataUpdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return rentDataUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function rentDataUpdate() {
        const { rent, user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status: "error", message: "User sfid is mandatory" })
        if (rent == "" || rent == undefined)
            return res.status(200).send({ status: "error", message: "Rent is mandatory" })
        
        try {
            const Id     = String(user_sfid);
            const amount = Number(rent);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: Id
                }
                
            });
            if(accountDet)
            {
                await prisma.account.update({
                    where:{
                        sfid: Id
                    },
                    data: {
                        rent_amount__c: amount,
                        resident_type__c: 'Rented',
                        is_qde_2_form_done__c: true
                    }
                });
                return res.status(200).json({ status: "success", message: "Rent updated successfully" })
            }else{            
                return res.status(200).json({ status: "error", message: "Account not found"})
            }
        } catch (error) {
            res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

