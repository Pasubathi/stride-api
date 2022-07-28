
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from './../../helpers/api';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function mpinupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return mpinUpdate();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function mpinUpdate() {
        console.log(req.body);
        const { forget, mpin, user_sfid } = req.body;
        if (mpin == "" || mpin == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "Mpin is mandatory" })
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "Account id is mandatory" })
        try {
            var mpin1 = mpin;
            const id1 = String(user_sfid);
            const accProfileDetail = await prisma.account.findFirst({
                where: {
                    sfid: id1,
                }
            });
            if(accProfileDetail)
            {
                const updateMpin = await prisma.account.update({
                    where: {
                        sfid: id1
                    },
                    data: {
                        mpin__c: mpin1,
                    }
                }); 
                if (updateMpin) {
                    return res.status(200).json({ responseCode: 200,status:"success", message: "Mpin is Updated successfully" })
                } else {
                    return res.status(500).json({ responseCode: 200,status:"error", message: "Detail is not updated" })
                }
            }else{
                return res.status(500).json({ responseCode: 200,status:"error", message: "Detail is not found" })
            }
        } catch (error) {
            res.status(200).send({ responseCode: 200,status:"error", message: error.message ? error.message : error })
        }
    }
}

