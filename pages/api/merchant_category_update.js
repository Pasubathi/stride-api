import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function updateMerchantCat(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return updateMerchantCat();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function updateMerchantCat() {
        const { user_sfid, category, sub_category } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(500).send({ message: "Id is mandatory" })
        if (category == "" || category == undefined)
            return res.status(500).send({ message: "Category is mandatory" })
        if (sub_category == "" || sub_category == undefined)
            return res.status(500).send({ message: "Sub Category is mandatory" })
            
        try {
                const categoryDet = await prisma.merchant_category__c.findFirst({
                    where: {
                        account__c: user_sfid
                    }
                });
                if(categoryDet)
                {
                    await prisma.merchant_category__c.update({
                        where: {
                            account__c: user_sfid
                        },
                        data:{
                            category__c: category,
                            sub_category__c: sub_category
                        }
                    });
                    return res.status(200).send({  status:"success", "message":"Category updated successfully"});
                }else{
                    await prisma.merchant_category__c.create({
                        data:{
                            account__c: user_sfid,
                            category__c: category,
                            sub_category__c: sub_category
                        }
                    });
                    return res.status(200).send({  status:"error", message:"Category added successfully" });
                }
        } catch (error) {
            return res.status(200).send({  status:"error", message: error.message ? error.message : error });
        }
    }
}
