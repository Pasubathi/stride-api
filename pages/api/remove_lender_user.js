import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function removeLenderUser(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return removeLenderUser();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function removeLenderUser() {
        const { user_id } = req.body;
        if (user_id == "" || user_id == undefined)
            return res.status(200).send({ status:"error",message: "Id is mandatory" })
        try {
                const createUser = await prisma.account.delete({
                        where: {
                            id: Number(user_id)
                        },
                    });
                if(createUser) {
                    await  prisma.lender_role__c.delete({
                        where: {
                            account__c: String(user_id),
                        },
                    });
                    await prisma.lender_permissions__c.delete({
                        where: {
                            account__c: String(user_id)
                        }
                    });
                }
                return res.status(200).json({ status:"success", message: "User removed successfully" })
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}