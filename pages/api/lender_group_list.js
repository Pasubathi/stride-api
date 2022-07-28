
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchGroupList(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return fetchGroupList();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchGroupList() {
        try {
            const { lender_sfid, page , limit} = req.body;
            if (lender_sfid == "" || lender_sfid == undefined)
                return res.status(200).send({ status:"error",message: "Id is mandatory" })
            const pageCount = page?Number(page):1;
            const limitCount = limit?Number(limit):10;
            const startIndex = (pageCount - 1) * limitCount;
            const accountDet = await prisma.account.findFirst({
                where:{
                    sfid: String(lender_sfid)
                }
            });
            if(accountDet)
            {
                const groupDet = await prisma.email_group_title.findMany({
                    where:{
                        created_by: accountDet.sfid
                    }
                });
                let proData = [];
                await Promise.all(groupDet.map(async element => {
                    let rowData = {
                        id: element.id,
                        title: element.title,
                    }
                    const getEmial = await prisma.lender_group_map.findMany({
                        where:{
                            group_id: Number(element.id)
                        }
                    });
                    let emailData = [];
                    await Promise.all(getEmial.map(async item =>{
                        const emailDet = await prisma.lender_email_recipient.findFirst({
                            select:{
                                recipient_id: true,
                                email: true
                            },
                            where:{
                                recipient_id: Number(item.recipient_id)
                            }
                        });
                        emailData.push(emailDet);
                    }));
                    rowData.email = emailData;
                    proData.push(rowData);
                }));
                return res.status(200).json({status: 'success', message: 'Success', data: proData});
            }else{
                return res.status(200).json({status: 'error', message: 'Account not found'});
            }
        } catch (error) {
            res.status(400).send({ status: 'error', message: error.message ? error.message : error })
        }
    }
}

