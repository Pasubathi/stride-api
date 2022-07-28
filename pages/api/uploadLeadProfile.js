import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { uploadFile } from "./eduvanz_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function updateLeadProfile(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return updateLeadProfile();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function updateLeadProfile() {
        const { base64, doctype, fname, parent_id, id, token } = req.body;
        if (base64 == "" || base64 == undefined)
            return res.status(500).send({ message: "Image Base64 is mandatory" })
        if (doctype == "" || doctype == undefined)
            return res.status(500).send({ message: "Doctype is mandatory" })
        if (fname == "" || fname == undefined)
            return res.status(500).send({ message: "File name is mandatory" })
        if (id == "" || id == undefined)
            return res.status(500).send({ message: "Id is mandatory" })
        if (token == "" || token == undefined)
            return res.status(500).send({ message: "Unauthorized access" })
            
        try {
            let data = {
                documentType: "Profile",
                parent_id: parent_id, 
                fname: fname, 
                base64: base64, 
                doctype: doctype, 
                token: token
            }
           const getData =  await uploadFile(data);
            if(getData.status !== undefined && getData.status ==="success")
            {
                const accountUser = await prisma.account.findFirst({
                    where: {
                        id: Number(id)
                    }
                });
                if(accountUser)
                {
                    await prisma.account.update({
                        where: {
                            id: id
                        },
                        data: {
                            photourl: getData.data.DocumentId,
                        },
                    });
                }
                return res.status(200).send({  status:"success", "message":"Success"});
            }else{
                return res.status(200).send({  status:"error", "message":getData});
            }
        } catch (error) {
            return res.status(200).send({  status:"error", message: error.message ? error.message : error });
        }
    }
}
