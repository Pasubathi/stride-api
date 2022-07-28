import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function resTypeupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return resTypeupdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function resTypeupdate() {
        const { user_sfid, type } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status: "error", message: "User sfid is mandatory" })
        if (type == "" || type == undefined)
            return res.status(200).send({ status: "error", message: "Type is mandatory" })
        const cust_id = String(user_sfid);
        const restype = String(type);
        try {
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id
                }
                
            });
            if(accountDet)
            {
                let datas = {
                    resident_type__c: restype
                }
                if(restype == "Owned")
                {
                    datas.is_qde_2_form_done__c = true
                }
                 await prisma.account.update({
                    where: {
                        sfid: accountDet.sfid
                    },
                    data:datas
                });
                return res.status(200).json({ status: "success", message: "Updated successfully"})
            }else{            
                return res.status(200).json({ status: "error", message: "Account not found"})
            }
           
        
        } catch (error) {
            res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

