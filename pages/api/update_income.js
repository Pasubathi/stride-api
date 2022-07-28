import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function incomeupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return incomeUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function incomeUpdate() {
        const { source, isProfessional, amount, compant_name,work_address, user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status: "error", message: "User sfid is mandatory" })
        try {
            const cust_id = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id,
                }
            });
            if(accountDet)
            {
                let getData = {
                  //  employer_type__c: source?source.toString():null
                };
                if(amount)
                {
                    getData.monthly_income__c = parseFloat(amount);
                }
                if(isProfessional)
                {
                    getData.occupation__c = isProfessional.toString();
                }
                if(compant_name)
                {
                    getData.employer_name__c   = compant_name.toString();
                }
                if(work_address)
                {
                    getData.industry   = work_address.toString();
                }

                let updateAcc = await prisma.account.update({
                    where: {
                        sfid: cust_id
                    },
                    data: getData
                });
                return res.status(200).json({ status: "success", message: "Income Updated successfully" })
            }else{
                return res.status(200).json({ status: "error", message: "Details not found" })
            }
        } catch (error) {
            res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

