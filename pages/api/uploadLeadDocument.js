import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { uploadFile } from "./eduvanz_api";
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
        const { base64, doctype, basetype, parent_id, id, token } = req.body;
        if (base64 == "" || base64 == undefined)
            return res.status(500).send({ message: "Image Base64 is mandatory" })
        if (doctype == "" || doctype == undefined)
            return res.status(500).send({ message: "Doctype is mandatory" })
        if (id == "" || id == undefined)
            return res.status(500).send({ message: "Id is mandatory" })
        if (token == "" || token == undefined)
            return res.status(500).send({ message: "Unauthorized access" })
            
        try {
            if(Array.isArray(base64) && Array.isArray(doctype) && base64.length > 0)
            {
                
                const accountUser = await prisma.account.findFirst({
                    where: {
                        id: Number(id)
                    }
                });
                if(accountUser)
                {
                    let docData;
                    base64.forEach(async (item, index) =>
                    {   
                        let type;
                        let ext = "jpg";
                        if(basetype && basetype[index] !=undefined )
                        {
                            type = basetype[index];
                            const getExt = type.split("/");
                            ext = getExt[1];
                        }
                        const d = new Date()
                        const time = d.getTime()
                        let data = {
                            parent_id: parent_id, 
                            fname: `eduvan-${time}.${ext}`, 
                            base64: item, 
                            doctype: "photo", 
                            token: token
                        }
                        
                        const getData =  await uploadFile(data);
                        if(getData.status !== undefined && getData.status ==="success")
                        {
                            docData = await prisma.account_attachment.create({
                                data: {
                                    cust_id: Number(id),
                                    document_id: getData.data.DocumentId,
                                    document_type: doctype[index],
                                    doc__type: type?type:null
                                },
                            });
                        }
                    });
                    return res.status(200).send({  status:"success", "message":"Success", data: docData});
                }else{
                    return res.status(200).send({  status:"error", "message":"Account Not Found"});
                }
                    
            }else{
                return res.status(200).send({  status:"error", "message":"Invalid Data"});
            }
        } catch (error) {
            return res.status(200).send({  status:"error", message: error.message ? error.message : error });
        }
    }
}
