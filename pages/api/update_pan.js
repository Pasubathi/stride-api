import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function panupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return panUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function panUpdate() {
        const { pan_number, id } = req.body;
        if (id == "" || id == undefined)
            return res.status(200).send({ status:"error", message: "id is mandatory" })
        if (pan_number == "" || pan_number == undefined)
            return res.status(200).send({ status:"error", message: "Pan Number is mandatory" })
        try {
            const accountPan = await prisma.account.findFirst({
                where: {
                    pan_number__c: pan_number
                }
            });
            if(!accountPan)
            {
                let cust_id = Number(id);
                const updateUser = await prisma.account.update({
                    where: {
                        id: cust_id
                    },
                    data: {
                        pan_number__c: pan_number,
                    },
                });
                if (updateUser) {
                    return res.status(200).json({ status:"success", message: "PAN number updated successfully" })
                } else {
                    return res.status(200).json({ status:"error",message: "Detail is not updated" })
                }
            }else{
                return res.status(200).json({ status:"error", message: "Pan already exist" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

