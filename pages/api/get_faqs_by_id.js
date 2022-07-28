// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function getFaqs(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getFaqs();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getFaqs() {
            const { id } = req.body;
            let product_id = String(id);
            try {
               
                const faqDet = await prisma.faq__c.findMany({
                    where: {
                        product__c: product_id
                    }
                    
                });
                if (faqDet) {
                     
                        return res.status(200).json({
                           responseCode:200,
                           status:'success',
                           message:"success",
                           data: faqDet,
                       })
                }
                else{
                    return res.status(500).json({
                        responseCode:500,
                        status:'error',
                        message: "Invalid product id",
                    })
                }

            } catch (e) {
                res.status(500).send({ responseCode:500,message: e.message ? e.message : e });
                return;
            }
        }
    } catch (error) {
        res.status(500).send({responseCode:500, message: error.message ? error.message : error })
    } 

}



