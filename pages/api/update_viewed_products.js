import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function updateViewed(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return updateViewed();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function updateViewed() {
        const { user_id, product_id } = req.body;
        if (user_id == "" || user_id == undefined)
            return res.status(200).send({ status: "error", message: "Id is mandatory" })
        if (product_id == "" || product_id == undefined)
            return res.status(200).send({ status: "error", message: "product id is mandatory" })
        let cust_id = Number(user_id);
        try {
          
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id
                }
                
            });
    

            if(accountDet)
            {
                const viewDet = await prisma.viewed_products__c.findFirst({
                    where: {
                        account__id: accountDet.sfid,
                        product__id: product_id
                    }
                    
                });
                if(!viewDet)
                {
                        let data = {
                            account__id: accountDet.sfid,
                            product__id: product_id,
                        };

                    await prisma.viewed_products__c.create({
                            data: data
                        });          
                    
                        return res.status(200).json({ status: "success", message: "Updated successfully" })
                }
                else
                {
                    res.status(200).send({ status: "error", message: "Already added" })
                }       
            }
            else{
                res.status(200).send({ status: "error", message: "Account not found" })
            }
        } catch (error) {
            res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

