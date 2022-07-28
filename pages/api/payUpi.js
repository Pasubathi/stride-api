import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { upiCollectRequest} from "./cashfree_extapi";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function payUpiIds(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return payUpiIds();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function payUpiIds() {
        const { user_sfid, upi_id, amount, return_url } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "ID is mandatory" })
        if (upi_id == "" || upi_id == undefined)
            return res.status(200).send({ status:"error", message: "Upi ID is mandatory" })
        if (amount == "" || amount == undefined)
            return res.status(200).send({ status:"error", message: "Amount is mandatory" })
        
        try {
            const sfid = String(user_sfid);
            const accountUser = await prisma.account.findFirst({
                where: {
                    sfid: sfid
                }
            });
            if(accountUser)
            {
                    let obj = {
                        sfid: accountUser.sfid,
                        cust_email: accountUser.email__c,
                        cust_mobile: accountUser.phone,
                        amount: amount,
                        upi_id: upi_id,
                        return_url: return_url
                     }
                        const crdsPayObj = await upiCollectRequest(obj);
                        if(crdsPayObj.status == "success")
                        {   
                            const getObj = crdsPayObj.data;
                            const order_id = crdsPayObj.order_id;
                            let upiDet = await prisma.account_upi__c.findFirst({
                                where: {
                                    account__c: accountUser.sfid,
                                    upi_id__c: String(upi_id)
                                }
                            });
                            if(!upiDet)
                            {
                                let objData = {
                                    account__c: accountUser.sfid,
                                    upi_id__c: String(upi_id)
                                }
                                upiDet = await prisma.account_upi__c.create({
                                    data: objData,
                                });
                            }
                            let obj = {
                                payment_type: "UPI",
                                user_sfid: accountUser.sfid,
                                order_id: order_id,
                                upi_id : Number(upiDet.id),
                                payment_id: String(getObj.cfPaymentId)
                            }
                            await addCards(obj);
                            return res.status(200).json(crdsPayObj)
                        }else{
                            return res.status(200).json(crdsPayObj)
                        }
            }else{
                return res.status(200).json({ status:"error", message: "Account not found" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

function addCards(getData) {
    return new Promise((resolve, reject) => {
        try {
            const createPayment = prisma.account_payments__c.create({
                data: getData,
            });
            resolve(createPayment)

        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

