// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'
import { prisma } from "./_base";
import getConfig from 'next/config';
import { SALES_FORCE } from "./api";
const { serverRuntimeConfig } = getConfig();

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
 )
export default async function salesForceLogin(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return salesForceLogin();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function salesForceLogin() {
        const { id, token } = req.body;
        if (id == "" || id == undefined){
            return res.status(200).send({ responseCode: 200,status:"error", message: "Unauthorized access" })
        }
        if (token == "" || token == undefined){
            return res.status(200).send({ responseCode: 200,status:"error", message: "Unauthorized access" })
        }
        try {
            const init = {
              method: 'POST'
            };
          const getdata = await fetch(SALES_FORCE, init).then((response) => response.json())
           .then((response) => {
                return response;
           });
                console.log("ssss");
                res.status(200).send({ status:"success", message: "Success", data: getdata })
               
            } catch (error) {
                res.status(200).send({ status:"error", message: error.message ? error.message : error })
            }
        }
}

