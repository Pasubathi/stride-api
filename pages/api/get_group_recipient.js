
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getGroupRecipient(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getGroupRecipient();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getGroupRecipient() {
        try {
            const { group_id } = req.body;
            if(group_id == "" || group_id == undefined)
                return res.status(200).json({ status: 'error', message: 'Group sfid cannot be empty' });
                const getEmial = await prisma.lender_group_map.findMany({
                    where:{
                        group_id: Number(group_id)
                    }
                });
                let proDet = [];
                await Promise.all(getEmial.map(async element => {
                    const getData = await prisma.lender_email_recipient.findFirst({
                        where: {
                            recipient_id: Number(element.recipient_id),
                        }
                    });
                    if(getData)
                    {
                        proDet.push(getData);
                    }
                }));
                return res.status(200).json({ status: 'success', message: "Success", data: proDet})
        } catch (error) {
            res.status(200).send({ status: 'error', message: error.message ? error.message : error })
        }

    }
}

