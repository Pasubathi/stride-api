// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware'
import getConfig from 'next/config';
import { GET_DOCUMENT_BY_ID } from "./api";
const { serverRuntimeConfig } = getConfig();

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
 )
export default async function getVoterDocument(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getVoterDocument();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function getVoterDocument() {
        const { sfid, token } = req.body;
        if (sfid == "" || sfid == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "Sfid is mandatory" })
        
        try {
            let getData = [];
            let dataType =[];
            let finaldata ={};
            const voterFront = await prisma.account_attachment.findFirst({
                where: {
                    cust_id: Number(id),
                    document_type: "Voter-Front",
                },
                orderBy: [
                    {
                      id: 'desc',
                    }
                  ],
            });
            if(voterFront)
            {
                getData.push(voterFront.document_id);
                dataType.push("voter_front");
            }
            const voterBack = await prisma.account_attachment.findFirst({
                where: {
                    cust_id: Number(id),
                    document_type: "Voter-Back",
                },
                orderBy: [
                    {
                      id: 'desc',
                    }
                  ],
            });
            if(voterBack)
            {
                getData.push(voterBack.document_id);
                dataType.push("voter_back");
            }
            for(var i =0; i< getData.length; i++)
            {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer "+token);
                myHeaders.append("content-type", "application/json");
                const init = {
                method: 'GET',
                headers: myHeaders,
                };
                const getdata = await fetch(GET_DOCUMENT_BY_ID+getData[i], init).then((response) => response.json())
                .then((response) => {
                        return response;
                });
                let name = dataType[i];
                finaldata[name] = getdata.base64;
                
            }
            res.status(200).send({ status:"success", message: "Success", data: finaldata })  
            } catch (error) {
                res.status(200).send({ status:"error", message: error.message ? error.message : error })
            }
        }
}

