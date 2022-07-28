
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchCards(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return fetchCards();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchCards() {
        const { user_sfid } = req.body;
        if (user_sfid == "" || user_sfid == undefined )
            return res.status(200).send({ responseCode: 200, status:"error",  message: "Id is mandatory" })
           
        try {
            const sfid = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            if(accountDet)
            {
                let fetchData = await prisma.account_cards__c.findMany({
                     where: {
                        sfid: accountDet.sfid
                     },
                     select:{
                         card_number__c: true,
                         card_name__c: true,
                         card_expiry__c: true,
                         upi_id__c: true,
                         cvv: true,
                         id: true
                     },
                     orderBy: {
                       id: 'desc',
                     }
                 });
                 if (fetchData) {
                     return res.status(200).json({ status:"success", data: fetchData })
                 }else {
                     return res.status(200).json({ status:"error",message: "Detail is not updated" })
                 }
            }else {
                return res.status(200).json({ status:"error",message: "Account not found" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }

        /*  if (id == "" || id == undefined)
              return res.status(400).send({ responseCode: 400, message: "Account id is mandatory" })
          try {
              let updatepan = await prisma.account.update({
                  where: {
                      id: id
                  },
                  data: {
                      pan_number__c: pan_number
                  }
              });
              if (updatepan) {
                  return res.status(200).json({ responseCode: 200, message: "pan is Updated successfully" })
              } else {
                  return res.status(400).json({ responseCode: 400, message: "Detail is not updated" })
              }
  
  
          } catch (error) {
              res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
          } */
    }
}

