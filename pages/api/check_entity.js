import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { entitySearch} from "./eduvanz_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function checkEntity(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return checkEntity();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function checkEntity() {
        const { company_name } = req.body;
       
        if (company_name == "" || company_name == undefined)
            return res.status(200).send({ status:"error",message: "Company name is mandatory" })
       
        try {
           
                let subData = {
                    company_name: company_name,
                }
                const searchResult = await entitySearch(subData);
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

