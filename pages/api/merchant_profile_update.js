import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function updateMerchantProfile(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return updateMerchantProfile();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function updateMerchantProfile() {
        const { user_sfid, first_name, brand_name, entity_name, website, pan_no, gst, cin, address} = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "User sfid cannot be empty" })
        if (first_name == "" || first_name == undefined)
            return res.status(200).send({ status:"error",message: "Name cannot be empty" })  
        try {
            const userSfid = String(user_sfid);
            const userDet = await prisma.account.findFirst({
                where: {
                    sfid: userSfid,
                }
            });
            if(userDet)
            {
                let obj = {
                    first_name__c: first_name,
                    entity_name__c: entity_name !==undefined && entity_name?String(entity_name):null,
                    website: website !==undefined && website?String(website):null,
                    pan_number__c: pan_no !==undefined && pan_no?String(pan_no):null,
                    gstin__c: gst !==undefined && gst?String(gst):null,
                    cin_no__c: cin !==undefined && cin?String(cin):null,
                }
                if(brand_name && brand_name !==undefined)
                {
                    const brandDet = await prisma.merchant_brand__c.findFirst({
                        where: {
                            accountid__c: user_sfid,
                        },
                        orderBy:{
                            id:'desc'
                        }
                    });
                    console.log("brandDet------>", brandDet);
                    console.log("brand_name------>", brand_name);
                    if(!brandDet)
                    {
                        await prisma.merchant_brand__c.create({
                            data: {
                                accountid__c: user_sfid,
                                brand__c: brand_name
                            },
                        });
                    }else{
                        await prisma.merchant_brand__c.update({
                            where:{
                                id: brandDet.id
                            },
                            data: {
                                brand__c: brand_name
                            },
                        });
                    }
                }
                
                if(address && address !==undefined)
                {
                    const addId = userDet.current_address_id__c;
                    if(addId)
                    {
                        await prisma.address__c.update({
                            where:{
                                id: Number(addId),
                            },
                            data: {
                                address__c: address
                            }
                        });
                    }else{
                        const createAddress = await prisma.address__c.create({
                            data: {
                                account__c: user_sfid,
                                address__c: address
                            }
                        });
                        if(createAddress)
                        {
                            obj.current_address_id__c = String(createAddress.id);
                        }
                    }
                }
                
                await prisma.account.update({
                    where: {
                        sfid: userSfid,
                    },
                    data: obj
                });
                return res.status(200).json({ status:"success", message: 'Updated Successfully'})
            }else{
                return res.status(200).json({ status:"error",message: "User not found" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}
