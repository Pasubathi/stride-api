
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function createLead(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return createLead();
        default:
            return res.status(500).send({ responseCode: 500, message: `Method ${req.method} Not Allowed` })
    }
    async function createLead() {
        try {
            const { leads, id } = req.body;
            if (leads == "" || leads == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Leads is mandatory" })
            if (id == "" || id == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Id is mandatory" })
            if(Array.isArray(leads))
            {
                for(var i =0; i < leads.length; i++)
                {
                    if(i !==0)
                    {
                        console.log("Data",leads[i]);
                        const email  = leads[i][2];
                        const fname  = leads[i][0];
                        const lname  = leads[i][1];
                        const mobile = leads[i][3].toString();
                        console.log("mobile",mobile);
                        const accountEmailDet = await prisma.account.findFirst({
                            where: {
                                email__c: email,
                            }
                        });
                        const accountPhoneDet = await prisma.account.findFirst({
                            where: {
                                phone: mobile,
                            }
                        });
                        if(!accountEmailDet)
                        {
                            if(!accountPhoneDet)
                            {
                                const createAccount = await prisma.account.create({
                                    data: {
                                        first_name__c: fname,
                                        last_name__c: lname,
                                        email__c: email,
                                        phone: mobile,
                                    },
                                });
                            }
                        }
                    }
                }
                return res.status(200).send({ responseCode: 200, status:"success",  message: "Lead Created Successfully" })                       
            }else{
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Invalid Data" })
            }
            
        } catch (error) {
            res.status(500).send({ responseCode: 500, message: error.message ? error.message : error })
        }
    }
}

