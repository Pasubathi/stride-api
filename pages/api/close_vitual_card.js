import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
var myHeaders = new Headers();
var request = require('request');

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function checkVirtualCard(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return checkVirtualCard();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function checkVirtualCard() {
        const { user_sfid, card_id } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Id is mandatory" })
        if (card_id == "" || card_id == undefined)
            return res.status(200).send({ status:"error",message: "Card Id is mandatory" })

        try {
            const cust_id = String(user_sfid);
            const cardId = Number(card_id);
            const accountDet = await prisma.account.findFirst({
                select:{
                    sfid: true
                },
                where: {
                    sfid: cust_id,
                }
            });
            if(accountDet)
            {
                const cardDet = await prisma.virtual_cart__c.findFirst({
                    where: {
                        id: cardId,
                        status__c: 'PENDING'
                    }
                });
                if(cardDet)
                {
                   /*  myHeaders.append("channel_id", "WEB");
                    myHeaders.append("transaction_id", "77646808-aa96-47fa-a8b6-897025efb08a");
                    myHeaders.append("client_id", "3b1e5fc9540a91dee8774b0896189faf3fef3d80");
                    myHeaders.append("client_secret", "29d42e3761f17d9e166bba5162630fc02af4ae84");
                    myHeaders.append("Content-Type", "application/json");
                    var raw = JSON.stringify({
                        "kitNo": "2270000144",
                        "entityId": "TESTCUSTOMERED501",
                        "flag": "L",
                        "reason": "card Lost"
                    });
                    console.log(raw);
                    var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                    };

                    const getdata = fetch("http://s-edvnz-email-virtualcard-api.sg-s1.cloudhub.io/api/virtualcard/block", requestOptions)
                    .then((response) => response.json())
                    .then((response) => {
                        console.log('response', response)
                        return response;
                    });
                    console.log('getdata', getdata) */
                    await prisma.virtual_cart__c.update({
                        where:{
                            id: cardDet.id
                        },
                        data:{
                            status__c: 'CLOSED'
                        }
                    });
                    return res.status(200).json({ status:"success", message: "Card Cacelled Successfully"});
                }else{
                    return res.status(200).json({ status:"error", message: "Card not found" });
                }             
            } else {
                return res.status(200).json({ status:"error",message: "Detail is not found" });
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}