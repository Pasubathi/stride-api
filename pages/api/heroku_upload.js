import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { uploadFile } from "./eduvanz_api";
import { SALES_FORCE } from "./api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function uploadLeadDocument(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return uploadLeadDocument();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function uploadLeadDocument() {
        const { fname, parent_id, base64, doctype, catType } = req.body;
        if (base64 == "" || base64 == undefined)
            return res.status(500).send({ message: "Image Base64 is mandatory" })
        if (doctype == "" || doctype == undefined)
            return res.status(500).send({ message: "Doctype is mandatory" })
        if (fname == "" || fname == undefined)
            return res.status(500).send({ message: "Filename is mandatory" })
        if (parent_id == "" || parent_id == undefined)
            return res.status(500).send({ message: "Parent Id is mandatory" })
        if (catType == "" || catType == undefined)
            return res.status(500).send({ message: "Category Type is mandatory" })
            
        try {

            const init = {
                method: 'POST'
            };
            const getdata = await fetch(SALES_FORCE, init).then((response) => response.json())
            .then((response) => {
                    return response;
            });
            let token = '';
            if(getdata && getdata.access_token)
            {
                token = getdata.access_token
            }
            console.log("Token", token);
            let data = {
                parent_id: parent_id, 
                fname: fname, 
                base64: base64, 
                doctype: doctype,
                catType: catType,
                token: token
            }
            const getData =  await uploadFile(data);
            if(getData.status !== undefined && getData.status ==="success")
            {
                return res.status(200).send(getData);
            }else{
                return res.status(200).send(getData);
            }
        } catch (error) {
            return res.status(200).send({  status:"error", message: error.message ? error.message : error });
        }
    }
}
