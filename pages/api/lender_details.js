
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchLenderList(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return fetchLenderList();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchLenderList() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined )
            return res.status(200).send({ responseCode: 200, status:"error",  message: "Id is mandatory" })
           
        try {
            const sfid = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                select:{
                   first_name__c: true,
                   last_name__c: true,
                   name: true,
                   email__c: true,
                   phone: true,
                   id: true,
                   sfid: true,
                },
                where: {
                    sfid: sfid,
                }
            });
            if(accountDet)
            {
                let rowData = accountDet;
                let roles;
                let permissions;
                const lenderRoleDet = await prisma.lender_role__c.findFirst({
                    where:{
                        account__c: String(accountDet.id)
                    }
                });
                const lenderPermission =  await prisma.lender_permissions__c.findMany({
                    data: {
                        where: String(accountDet.id)
                    }
                });
                if(lenderRoleDet)
                {
                    const roleDet = await prisma.role__c.findFirst({
                        where:{
                            id: Number(lenderRoleDet.role__c)
                        }
                    });
                    roles = roleDet && roleDet.role_name__c?roleDet.role_name__c:'';
                }
                if(lenderPermission)
                {
                    permissions = lenderPermission;
                }
                rowData.roles = roles;
                rowData.permissions = permissions;
                return res.status(200).json({ status:"success", data: rowData });
            }else {
                return res.status(200).json({ status:"error",message: "Account not found" })
            }
        } catch (error) {
            res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

