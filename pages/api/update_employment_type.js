import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function employmentTypeupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return employmentTypeupdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function employmentTypeupdate() {
        const { user_sfid, type } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status: "error", message: "User sfid is mandatory" })
        if (type == "" || type == undefined)
            return res.status(200).send({ status: "error", message: "Type is mandatory" })
        const cust_id = String(user_sfid);
        const seType = String(type);
        try {
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id
                }
                
            });
            if(accountDet)
            {
                let empType = "Salaried";
                 if(seType == '1')
                 {
                    empType = "Salaried";
                 }else if(seType == '2')
                 {
                    empType = "Self-Employed-Professional";
                 }else if(seType == '3')
                 {
                    empType = "Retired";
                 }else if(seType == '4')
                 {
                    empType = "Students";
                 }
                 await prisma.account.update({
                    where: {
                        sfid: cust_id
                    },
                    data: {
                      //  employer_type__c: type.toString(),
                        occupation__c: empType
                    }
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

