import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function removeEmailGroup(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return removeEmailGroup();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function removeEmailGroup() {
        const { group_id} = req.body;
        if (group_id == "" || group_id == undefined)
            return res.status(200).send({ status:"error",message: "Id cannot be empty" })
       
        try {
                    const groupId = await prisma.email_group_title.findFirst({
                        where: {
                            id: Number(group_id),
                        }
                    });
                    if(groupId)
                    {
                        await prisma.email_group_title.delete({
                            where: {
                                id: Number(group_id),
                            }
                        });
                        await prisma.lender_group_map.delete({
                            where: {
                                group_id: Number(groupId.id),
                            }
                        });
                        return res.status(200).json({ status:"success", message:"Group removed successfully"});
                    }
                    else {
                        return res.status(200).json({ status:"error",message: "Group not found" })
                    }
            
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

