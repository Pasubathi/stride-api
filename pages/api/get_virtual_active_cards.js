// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'
import { prisma } from "./_base";
import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
const { serverRuntimeConfig } = getConfig();

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
 )
export default async function activeVirtualCards(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return activeVirtualCards();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function activeVirtualCards() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "ID is mandatory" })
            const id = String(user_sfid);
            try {
                const accountDet = await prisma.account.findFirst({
                    where: {
                        sfid: id                    
                    }
                });
                if(accountDet)
                {
                    const getdata = await prisma.virtual_cart__c.findMany({
                        select: {
                            card_number__c: true,
                            status__c: true,
                            entity_id__c: true,
                            vcard_cvv__c: true,
                            vcard_expiry__c: true,
                            vcard_number__c: true,
                            card_limit__c: true,
                            createddate: true,
                            kyc_status__c: true,
                            account: {
                              select: {
                                first_name__c: true,
                                merchant_logo_url__c: true,
                                website: true
                              },
                            },
                          },
                        where:{
                            account__c: accountDet.sfid,
                            status__c: 'PENDING'
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    if(getdata)
                        return res.status(200).json({ status:'success', message: "success", data: getdata })
                        return res.status(400).json({ status:'error', message: "Card not found" })
                } else {
                    return res.status(200).send({ status:"error",message: "Details not found" })
                }
            } catch (error) {
                res.status(500).send({ status:"error", message: error.message ? error.message : error })
            }
        }
}

