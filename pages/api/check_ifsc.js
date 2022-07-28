import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { checkIfscCode } from "./eduvanz_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function checkIfsc(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return checkIfsc();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function checkIfsc() {
        const { ifsc } = req.body;
       
        if (ifsc == "" || ifsc == undefined)
            return res.status(200).send({ status:"error",message: "Ifsc code is mandatory" })
       
        try {
            let subData = {
                ifsc: ifsc,
            }
            const searchResult = await checkIfscCode(subData);
            if(searchResult.statusCode == 101)
            {
                return res.status(200).json({ status:"success", message: "success", data:searchResult.result });
            }else{
                return res.status(200).json({ status:"error", message:searchResult });
            }
            
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

