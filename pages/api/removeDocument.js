import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { removeEduDocument } from "./eduvanz_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function removeDocument(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return removeDocument();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function removeDocument() {
        const { id, token } = req.body;
        if (id == "" || id == undefined)
            return res.status(500).send({ message: "Id is mandatory" })
        if (token == "" || token == undefined)
            return res.status(500).send({ message: "Unauthorized access" })  
        try {
                let data = {
                    id: id,
                    token: token
                }
                const fileDet = await removeEduDocument(data);
                console.log("fileDet", fileDet);
                const documentDet = await prisma.account_attachment.findFirst({
                    where: {
                        document_id: id
                    }
                });
                if(documentDet)
                {
                    await prisma.account_attachment.delete({
                        where: {
                            id: documentDet.id
                        }
                    });
                
                    return res.status(200).send({  status:"success", "message":"Document removed successfully"});
                }else{
                    return res.status(200).send({  status:"error", "message":documentDet});
                }
              
            } catch (error) {
                return res.status(200).send({  status:"error", message: error.message ? error.message : error });
            }
    }
}
