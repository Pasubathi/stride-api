import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function opportunityupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return opportunityUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function opportunityUpdate() {
        const { id, stagename } = req.body;
        if (id == "" || id == undefined)
            return res.status(200).send({ status: "error", message: "Id is mandatory" })
        if (stagename == "" || stagename == undefined)
            return res.status(200).send({ status: "error", message: "Stagename is mandatory" })
            let cust_id = Number(id);
            try {

            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id
                }
                
            });

            const getData = await prisma.opportunity.findFirst({ 
                where: {
                    accountid: accountDet.sfid
                },
                orderBy: { 
                    id: 'desc' 
                }, 
            });
           
            let updData = {
                stagename: stagename
            };
          if(getData)
          {
              await prisma.opportunity.update({
                  where:{
                    sfid: getData.sfid
                },
                data:updData,
              });
             
            return res.status(200).json({ status: "success", message: "Opportunity updated successfully" })
          }
          else{
            return res.status(200).json({ status: "error", message: "No details found" })
          }
        } catch (error) {
            res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

