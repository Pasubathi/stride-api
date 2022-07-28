import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function storeSearch(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return storeSearch();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function storeSearch() {
        const { search_name } = req.body;
       
        if (search_name == "" || search_name == undefined)
            return res.status(200).send({ status:"error",message: "Search name is mandatory" })
       
        try {
                const result = await prisma.account.findMany({
                    select:{
                        merchant_logo_url__c: true,
                        website: true,
                        first_name__c: true,
                        sfid: true,
                    },
                    where: {
                        merchant_virtual_card_eligibility__c: true,
                        website: {
                         search: search_name,
                        },
                    },
                });
                if(result)
                {
                    return res.status(200).json({status:'success', message:'Success', data:result})
                }else{
                    return res.status(200).json({status:'error', message:'Record not found'});
                }
                
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

