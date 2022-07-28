import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function rentUpdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return residentUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function residentUpdate() {
        const { rent, id } = req.body;
        if (id == "" || id == undefined)
            return res.status(200).send({ status: "error", message: "id is mandatory" })
        if (rent == "" || rent == undefined)
            return res.status(200).send({ status: "error", message: "Rent is mandatory" })
        
        try {
            let Id = Number(id);
            let amount = Number(rent);
            await prisma.account.update({
                where:{
                    id: Id
                },
                data: {
                    rent_amount__c: amount,
                    resident_type__c: 'Rented',
                    is_qde_2_form_done__c: true
                }
            });
            return res.status(200).json({ status: "success", message: "Rent updated successfully" })
        
        } catch (error) {
            res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

