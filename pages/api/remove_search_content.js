// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function removeSearchContent(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return removeSearchContent();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function removeSearchContent() {
            const { content_id } = req.body;
            if (content_id == "" || content_id == undefined)
                return res.status(200).send({ responseCode:200,status:"error",message: "Id is required" })
           
            try {
                    const contentId = Number(content_id);
                    await prisma.user_search_history__c.delete({
                        where: {
                            id: contentId,
                        }
                    });
                    return res.status(200).send({status:"success",message: "Success"});
            } catch (e) {
                res.status(200).send({ responseCode:200,status:"error",message: e.message ? e.message : e });
                return;
            }
        }
    } catch (error) {
        res.status(200).send({responseCode:200,status:"error", message: error.message ? error.message : error })
    } 

}
