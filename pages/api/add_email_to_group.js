
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function addEmail(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return addEmail();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function addEmail() {
        const { group_id, email } = req.body;
        if (group_id == "" || group_id == undefined)
        return res.status(200).send({ status:"error", message: "Group id is mandatory" })
        if (email == "" || email == undefined)
        return res.status(200).send({ status:"error", message: "Email is mandatory" }) 
        try {
          
            const accountDet = await prisma.email_group_title.findFirst({
                where: {
                    id: group_id,
                }
            });
            if(accountDet)
            {
                await prisma.email_group.create({
                    data:{
                        email: email,
                        group_id: group_id
                    }
                });
                return res.status(200).json({ status: "success", message: "Email added successfully" })
            }else{
                return res.status(200).json({ status: "error", message: "Detail not found" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

