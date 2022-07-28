// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function sendotpHandler(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return sendOtpHandler();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function sendOtpHandler() {
            const { user_sfid, search } = req.body;
            if (user_sfid == "" || user_sfid == undefined)
                return res.status(200).send({ responseCode:200,status:"error",message: "Id is required" })
            if (search == "" || search == undefined)
                return res.status(200).send({ responseCode:200,status:"error",message: "Search is required" })
          
            try {
                    const cust_id = String(user_sfid);
                    const textData = String(search);
                    const accountDet = await prisma.account.findFirst({
                        where: {
                            sfid: cust_id,
                        }
                    });
                    if(accountDet)
                    {
                        const searchDet = await prisma.user_search_history__c.findFirst({
                            where:{
                                account__c: accountDet.sfid,
                                search__c: textData
                            }
                        }); 
                        if(!searchDet)
                        {
                            await prisma.user_search_history__c.create({
                                data:{
                                    account__c: accountDet.sfid,
                                    search__c: textData
                                }
                            });
                        }
                        return res.status(200).send({status:"success",message: "Success"});
                    }else{
                        return res.status(200).send({ status:"error",message: 'Account not found' });
                    }
                    
            } catch (e) {
                res.status(200).send({ responseCode:200,status:"error",message: e.message ? e.message : e });
                return;
            }// update otp process
        }
    } catch (error) {
        res.status(200).send({responseCode:200,status:"error", message: error.message ? error.message : error })
    } // get mobile number process

}
