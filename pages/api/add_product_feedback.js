import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function addCard(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return addCard();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function addCard() {
        const { user_sfid, product_sfid, rating, comments } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Id cannot be empty" })
        if (product_sfid == "" || product_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Product Id cannot be empty" })
        if (rating == "" || rating == undefined)
            return res.status(200).send({ status:"error",message: "Rating cannot be empty" })
        
        try {
            const sfid         = String(user_sfid);
            const productId    = String(product_sfid);
            const ratingCount  = Number(rating);
            const comment      = comments?String(comments):'';
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            if (accountDet) {
                const ratingDet = await prisma.account_feedback__c.findFirst({
                    where: {
                        user_sfid: sfid,
                        product_sfid: productId
                    }
                });
                if(!ratingDet)
                {
                    await prisma.account_feedback__c.create({
                        data: {
                            user_sfid: sfid,
                            product_sfid: productId,
                            star_count: ratingCount,
                            description: comment?comment:'',
                            type__c: 1
                        }
                    });
                    return res.status(200).json({ status:"success", message:"Feedback added successfully"});
                }else{
                    await prisma.account_feedback__c.update({
                        where:{
                            id: ratingDet.id,
                        },
                        data: {
                            star_count: ratingCount,
                            description: comment?comment:''
                        }
                    });
                    return res.status(200).json({ status:"success", message:"Feedback updated successfully"})
                }
            } else {
                return res.status(200).json({ status:"error",message: "Account not found" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

