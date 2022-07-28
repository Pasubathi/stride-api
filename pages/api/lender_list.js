
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
                where: {
                    sfid: sfid,
                }
            });
            if(accountDet)
            {
                let fetchData = await prisma.account.findMany({
                     where: {
                        createdbyid: accountDet.sfid
                     },
                     select:{
                        first_name__c: true,
                        last_name__c: true,
                        name: true,
                        email__c: true,
                        phone: true,
                        id: true,
                        sfid: true,
                     },
                     orderBy: {
                       id: 'desc',
                     }
                 });
                 if (fetchData) {
                    let proData = [];
                    await Promise.all(fetchData.map(async element => {
                        let rowData = element;
                        const lenderRoleDet = await prisma.lender_role__c.findFirst({
                            where:{
                                account__c: String(element.id)
                            }
                        });
                        if(lenderRoleDet)
                        {
                            const roleDet = await prisma.role__c.findFirst({
                                where:{
                                    id: Number(lenderRoleDet.role__c)
                                }
                            });
                            rowData.roles = roleDet && roleDet.role_name__c?roleDet.role_name__c:'';
                        }
                        proData.push(rowData);
                    }));
                     return res.status(200).json({ status:"success", data: proData });
                 }else {
                     return res.status(200).json({ status:"error",message: "Record not found" })
                 }
            }else {
                return res.status(200).json({ status:"error",message: "Account not found" })
            }
        } catch (error) {
            res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

