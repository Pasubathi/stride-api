// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware'
import getConfig from 'next/config';
import { DIGILOCKER_LINK, DIGILOCKER_DOCUMENT } from "./api";
const { serverRuntimeConfig } = getConfig();
const USER_KARZA_KEYS = process.env.USER_KARZA_KEYS;
const REDIRECT_URL = process.env.DIGILOCKER_REDIRECT_URL;

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
 )
export default async function getDigiLockerDocument(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getDigiLockerDocument();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function getDigiLockerDocument() {
        const { id, token } = req.body;
       
        try {
                let link = "";
                let requestId = '';
                let data = {
                    "redirectUrl": REDIRECT_URL,
                    "oAuthState": "123",
                    "consent": "Y"
                }
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("x-karza-key", USER_KARZA_KEYS);
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify(data),
                    redirect: 'follow'
                };
                const getdata = await fetch(DIGILOCKER_LINK, requestOptions).then((response) => response.json())
                .then((response) => {
                    return response;
                });
                console.log("getdata", getdata);
                if(getdata.statusCode =="101" && getdata.result.link !==undefined)
                {
                    link = getdata.result.link;
                    requestId = getdata.requestId;
                    return res.status(200).send({ status:"success", message: "Success", data: link});
                }else{
                    return res.status(200).send({ status:"error", message: getdata.error});
                }    
                  
            } catch (error) {
                res.status(200).send({ status:"error", message: error.message ? error.message : error })
            }
        }
}

