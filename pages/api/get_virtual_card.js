import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import moment from 'moment';

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getVirtualCard(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getVirtualCard();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function getVirtualCard() {
        const { user_id } = req.body;
        if (user_id == "" || user_id == undefined)
            return res.status(200).send({ status:"error", message: "Id is mandatory" })
        try {
            const cust_id = Number(user_id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id
                }
            });
           
            if(accountDet)
            {
                const getdata = await prisma.virtual_cart__c.findFirst({
                    select:{
                        card_number__c: true,
                        status__c: true,
                        entity_id__c: true,
                        vcard_cvv__c: true,
                        vcard_expiry__c: true,
                        vcard_number__c: true,
                        card_limit__c: true,
                        createddate: true,
                        account: {
                            select: {
                              first_name__c: true,
                              merchant_logo_url__c: true,
                              website: true
                            },
                        }
                    },
                    where:{
                        account__c: accountDet.sfid,
                        status__c:"PENDING"
                    },
                    orderBy: {
                        id: 'desc',
                    },
                });
                if(getdata)
                {
                    return res.status(200).json({ status:"success", data: getdata})
                }else{
                    return res.status(200).json({ status:"error", message: "Card not found" })
                }
               
            }else{
                return res.status(200).json({ status:"error", message: "Detail is not found" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

function getDate(date)
{
    if(!date)
    return '1994-02-14';

    let custDate = moment(date).format('YYYY-MM-DD');
    return custDate
}

