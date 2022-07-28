import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function updateTransApp(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return updateTransApp();
        default:
            return res.status(500).send({ responseCode: 500, message: `Method ${req.method} Not Allowed` })
    }
    async function updateTransApp()
    {
        try {
            const { stage, sfid, plan } = req.body;
            if (stage == "" || stage == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Stage is mandatory" })
            if (sfid == "" || sfid == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "ID is mandatory" })
           
            const stage_name  = String(stage);
            const plan_id     = String(plan);
            const opp_id      = String(sfid);
            const updateTrans = await prisma.opportunity.update({
                where:{
                    sfid: opp_id
                },
                data: {
                    stagename: stage_name,
                    payment_plan__c: plan?plan_id:null
                },
            });
            
            if(updateTrans)
            {
                return res.status(200).send({ responseCode: 200, status:"success",  message: "Updated SuccessFully", updateTrans})
            }else{
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Details not found", })
            }
            
        } catch (error) {
            res.status(500).send({ responseCode: 500, message: error.message ? error.message : error })
        }
    }
}