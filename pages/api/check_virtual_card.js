import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function checkVirtualCard(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return checkVirtualCard();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function checkVirtualCard() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "id is mandatory" })
        
        try {
            const cust_id = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                select:{
                    sfid: true
                },
                where: {
                    sfid: cust_id,
                }
            });
            if(accountDet)
            {
                const fetchData = await prisma.$queryRaw`SELECT * from virtual_cart__c WHERE createddate < now()-'24 hour'::interval AND account__c=${accountDet.sfid} AND status__c ='PENDING';`;
                if(fetchData && fetchData.length > 0)
                {
                    await Promise.all(fetchData.map(async element => {
                        await prisma.virtual_cart__c.update({
                            where:{
                                id: element.id
                            },
                            data:{
                                status__c: 'CLOSED'
                            }
                        });
                    }))
                    return res.status(200).json({ status:"success", message: "Validated suceessfully", data: fetchData });
                }else{
                    return res.status(200).json({ status:"success", message: "Record upto date"});
                }
            } else {
                return res.status(200).json({ status:"error",message: "Detail is not found" });
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}