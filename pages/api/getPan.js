import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getPan(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getPan();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function getPan() {
        const { id } = req.body;
        if (id == "" || id == undefined)
            return res.status(200).send({ status:"error", message: "id is mandatory" })
        try {
            const accountUser = await prisma.account.findFirst({
                where: {
                    id: id
                }
            });
            if(accountUser)
            {
                var pan = accountUser.pan_number__c? accountUser.pan_number__c:"AMV3456J56";
                const updateUser = await prisma.account.update({
                    where: {
                        id: id
                    },
                    data: {
                        pan_number__c: pan,
                    },
                });
                return res.status(200).json({ status:"success", pan:pan, message: "Success" })
            }else{
                return res.status(200).json({ status:"error", message: "Account not found" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

