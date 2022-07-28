
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function removeGroup(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return removeGroup();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function removeGroup() {
        const { group_id, email_id } = req.body;
        if (group_id == "" || group_id == undefined)
        return res.status(200).send({ status:"error", message: "Group id is mandatory" })
        if (email_id == "" || email_id == undefined)
        return res.status(200).send({ status:"error", message: "Email id is mandatory" }) 
        try {
          
            const accountDet = await prisma.email_group.findFirst({
                where: {
                    email_id: email_id,
                    group_id: group_id
                }
            });
            if(accountDet)
            {
                await prisma.email_group.delete({
                    where:{
                        email_id: email_id,
                        group_id: group_id
                    }
                });
                return res.status(200).json({ status: "success", message: "Success" })
            }else{
                return res.status(200).json({ status: "error", message: "Detail not found" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

