import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getLenderDetails(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getLenderDetails();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function getLenderDetails() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "id is mandatory" })
        try {
                const userSfid = String(user_sfid);
                const accountDet = await prisma.account.findFirst({
                    select:{
                        phone: true,
                        first_name__c: true,
                        last_name__c: true,
                        email__c: true,
                        email__c: true,
                        phone: true,
                        sfid: true,
                        id: true
                    },
                    where: {
                        sfid: userSfid
                    }
                });
                
                if (accountDet)
                {
                    let rowData = accountDet;
                    const roleDet = await  prisma.lender_role__c.findFirst({
                        where: {
                            account__c: String(accountDet.id),
                        },
                    });

                    const rolePermissionDet = await  prisma.lender_permissions__c.findMany({
                        where: {
                            account__c: String(accountDet.id),
                        },
                    });
                    rowData.roles = roleDet;
                    rowData.permissions = rolePermissionDet;
                    return res.status(200).json({ status:"success", message: "Success", data: rowData })
                }else{
                    return res.status(200).json({ status:"error",message: "Invalid details!." })
                }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}