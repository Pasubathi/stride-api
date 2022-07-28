import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function companyupdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return companyUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function companyUpdate() {
        const { brand, entity, cin, gst, pan, id } = req.body;
        if (brand == "" || brand == undefined)
            return res.status(500).send({ message: "Brand is mandatory" })
        if (entity == "" || entity == undefined)
            return res.status(500).send({ message: "Entity is mandatory" })
        if (cin == "" || cin == undefined)
            return res.status(500).send({ message: "CIN is mandatory" })
        if (gst == "" || gst == undefined)
            return res.status(500).send({ message: "GST is mandatory" })
        if (pan == "" || pan == undefined)
            return res.status(500).send({ message: "PAN is mandatory" })
        if (id == "" || id == undefined)
            return res.status(500).send({ message: "Id is mandatory" })
        try {
            const cust_id = Number(id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id,
                }
            });
            if(accountDet)
            {
                const updateUser = await prisma.account.update({
                    where: {
                        id: cust_id
                    },
                    data: {
                        pan_number__c: pan,
                        cin_no__c: String(cin),
                        gstin__c: String(gst),
                        entity_name__c: String(entity),
                    },
                });
                await prisma.merchant_brand__c.create({
                    data: {
                        accountid__c: accountDet.sfid,
                        brand__c: String(brand),
                    },
                });
                if (updateUser) {
                    return res.status(200).json({ message: "Updated successfully" })
                } else {
                    return res.status(500).json({ message: "Updated not successfull" })
                }
            }else {
                return res.status(500).json({ message: "Account not found" })
            }
            
        } catch (error) {
            res.status(500).send({ message: error.message ? error.message : error })
        }
    }
}

