
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getEmailReport(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getEmailReport();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getEmailReport() {
        try {
            const { lender_Sfid } = req.body;
            if(lender_Sfid == "" || lender_Sfid == undefined)
                return res.status(200).json({ status: 'error', message: 'User sfid cannot be empty' });

                const fetchData = await prisma.emailreport__c.findMany({
                    where: {
                        lender_sfid: lender_Sfid
                    }
                });
                let proDet = [];
                await Promise.all(fetchData.map(async element => {
                    let rowData = element;
                    rowData.group_name = '';
                    rowData.email   = '';
                    const groupId = element && element.group_id?Number(element.group_id):null;
                    if(groupId)
                    { 
                        const getData = await prisma.email_group_title.findFirst({
                            where: {
                                id: groupId,
                            }
                        });
                        const emailDet = await getGroupRecipients(groupId);
                        rowData.group_name = getData && getData.title?getData.title:null;
                        rowData.email = emailDet;
                    }
                    proDet.push(rowData);
                }));
                return res.status(200).json({ status: 'success', message: "Success", data: proDet})
               
        } catch (error) {
            res.status(200).send({ status: 'error', message: error.message ? error.message : error })
        }

    }
}


async function getGroupRecipients(groupId) {
    return new Promise(async (resolve, reject) => {
        try {
            const fetchData = await prisma.lender_group_map.findMany({
                where: {
                    group_id: Number(groupId)
                }
            });
            let proData = [];
            await Promise.all(fetchData.map(async elament => {
               const emailDet = await prisma.lender_email_recipient.findFirst({
                    select:{
                        recipient_id: true,
                        email: true
                    },
                    where:{
                        recipient_id: Number(elament.recipient_id)
                    }
               });
               if(emailDet)
               {
                    proData.push(emailDet);
               }
            })),
            resolve(proData);
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    });
}

