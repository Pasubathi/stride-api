// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function getEnachStatus(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getEnachStatus();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getEnachStatus() {
            const { user_sfid } = req.body;
            if (user_sfid == "" || user_sfid == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "User sfid is mandatory" })

            try {
                const cust_id = String(user_sfid);
                const accountDet = await prisma.account.findFirst({
                    where: {
                        sfid: cust_id
                    }
                    
                });
                if(accountDet)
                {
                    const enachDet = await prisma.enach__c.findFirst({
                        where: {
                            account_id: accountDet.sfid
                        }
                        
                    });
                    res.status(200).send({ responseCode:200, status: 'success', data: enachDet });
                }else{
                    res.status(200).send({ responseCode:200, status: 'error', message:'Account not found'});    
                }
            } catch (e) {
                res.status(200).send({ responseCode:200, status: 'error',message: e.message ? e.message : e });
                return;
            }
        }
    } catch (error) {
        res.status(500).send({responseCode:500, message: error.message ? error.message : error })
    } 

}



