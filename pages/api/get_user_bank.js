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

export default async function getUserBank(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getUserBank();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getUserBank() {
            const { id } = req.body;
            
            try {
                let cust_id = Number(id);
                const accountDet = await prisma.account.findFirst({
                    where: {
                        id: cust_id
                    }
                    
                });
                if(accountDet)
                {
                    const addressDet = await prisma.bank_account__c.findFirst({
                        where: {
                            account_id__c: accountDet.sfid
                        }
                        
                    });
                    res.status(200).send({ responseCode:200, status: 'success', data: addressDet });
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



