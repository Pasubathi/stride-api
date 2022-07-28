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

export default async function getMerchantUser(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getMerchantUserById();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getMerchantUserById() {
            const { id } = req.body;
           if (id == "" || id == undefined)
                return res.status(200).send({ status: "error", message: "User id is mandatory" })
            try {
                let userid = Number(id);
                const userDet = await prisma.users.findFirst({
                    where: {
                        id: userid
                    }
                });
                if(userDet)
                {
                    return res.status(200).json({ status: "success", message: "Success", data: userDet })
                }else{
                    return res.status(200).json({ status: "error", message: "User not found" })
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



