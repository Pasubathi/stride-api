import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function residentTypeupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return residentTypeupdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function residentTypeupdate() {
        const { id, type } = req.body;
        if (id == "" || id == undefined)
            return res.status(200).send({ status: "error", message: "Id is mandatory" })
        if (type == "" || type == undefined)
            return res.status(200).send({ status: "error", message: "Type is mandatory" })
        let cust_id = Number(id);
        let restype = Number(type);
        try {
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id
                }
                
            });
            if(accountDet)
            {
                let datas = {
                    resident_type__c: restype ==1?"Owned":"Rented"
                }
                if(restype ==1)
                {
                    datas.is_qde_2_form_done__c = true
                }
                 await prisma.account.update({
                    where: {
                        id: accountDet.id
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

