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

export default async function getRole(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getRole();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getRole() {
            const { owner_id } = req.body;
            let own_id = String(owner_id);
            try {
                const accountData = await prisma.role_access__c.findMany({
                    where: {
                        owner_id: own_id
                    }
                    
                });
               
                if (accountData) {
                     
                        return res.status(200).json({
                           responseCode:200,
                           status:'success',
                           message:"success",
                           data: accountData,
                       })
                }
                else{
                    return res.status(500).json({
                        responseCode:500,
                        status:'error',
                        message: "Invalid user id",
                    })
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



