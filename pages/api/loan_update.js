import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function loanUpdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return loanUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function loanUpdate() {
        const { oppertunity_sfid, stage_name } = req.body;
        if (oppertunity_sfid == "" || oppertunity_sfid == undefined)
            return res.status(200).send({ status: "error", message: "Oppertunity sfid is mandatory" })
        if (stage_name == "" || stage_name == undefined)
            return res.status(200).send({ status: "error", message: "Stage name is mandatory" })
            const oppSfid = String(oppertunity_sfid);
        try {
            const oppDet = await prisma.opportunity.findFirst({
                where: {
                    sfid: oppSfid
                }
            });
            if(oppDet)
            {
                await prisma.opportunity.update({
                    where: {
                        sfid: oppSfid
                    },
                  data:{
                    stagename: String(stage_name)
                  }
                });
                return res.status(200).json({ status: "success", message: "Loan updated successfully" })
            }else{
                return res.status(200).json({ status: "error", message: "Oppertunity not found"})
            }
              
        } catch (error) {
            res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

