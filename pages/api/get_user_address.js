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

export default async function getUserAddress(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getUserAddress();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getUserAddress() {
            const { user_sfid } = req.body;
            if (user_sfid == "" || user_sfid == undefined)
                return res.status(500).send({ message: "Id is mandatory" })

            const cust_id = String(user_sfid);
            try {
                const accountData = await prisma.account.findFirst({
                    where: {
                        sfid: cust_id
                    }
                    
                });
                if(accountData)
                {
                    let addressDet;
                    if(accountData && accountData.current_address_id__c)
                    {
                        addressDet = await prisma.address__c.findFirst({
                            where: {
                                id: Number(accountData.current_address_id__c)
                            }
                        });
                    }
                    const accountDet = await prisma.address__c.findMany({
                        where: {
                            account__c: accountData.sfid
                        }
                        
                    });
                    if (accountDet) {
                        
                            return res.status(200).json({
                            responseCode:200,
                            status:'success',
                            message:"success",
                            data: accountDet,
                            current_address: addressDet
                        })
                    }
                    else{
                        return res.status(500).json({
                            responseCode:500,
                            status:'error',
                            message: "Invalid user id",
                        })
                    }

                }else{
                    return res.status(200).send({ status:'error', message:"Address not available"});
                }

            } catch (e) {
                res.status(500).send({ responseCode:500,message: e.message ? e.message : e });
                return;
            }
        }
    } catch (error) {
        res.status(500).send({responseCode:500, message: error.message ? error.message : error })
    } 

}



