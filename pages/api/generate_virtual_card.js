import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import moment from 'moment';
import { generateVcard } from "./eduvanz_api"
import { updateVCard } from "./vcard"

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function paymentUpdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return paymentUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function paymentUpdate() {
        const { user_sfid, card_limit, merchant_sfid, plan_id } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "User sfid is mandatory" })
        if (card_limit == "" || card_limit == undefined)
            return res.status(200).send({ status:"error", message: "Card Limit is mandatory" })
        if (merchant_sfid == "" || merchant_sfid == undefined)
            return res.status(200).send({ status:"error", message: "Merchant id is mandatory" })
        if (plan_id == "" || plan_id == undefined)
            return res.status(200).send({ status:"error", message: "Plan id is mandatory" })

        try {
            const cust_id     = String(user_sfid);
            const cardLimit   = Number(card_limit);
            const merchantId  = String(merchant_sfid);
            const planId      = String(plan_id);
            const accountDet  = await prisma.account.findFirst({
                where: {
                    sfid: cust_id
                }
            });
           
            if(accountDet)
            {
                const getCustData = await prisma.virtual_cart__c.findFirst({ orderBy: { id: 'desc' } });
                const cardDet = await prisma.virtual_card_collection__c.findFirst({ where:{ status__c: 'UNUSED'}, orderBy: { id: 'asc' } });
                if(cardDet)
                {
                    let tempid = (getCustData && getCustData.id?getCustData.id+100:100).toString();
                    const addressDet  = prisma.address__c.findFirst({ where:{ account__c: accountDet.sfid }, orderBy: { id: 'desc' } });
                    const cardNumber = cardDet && cardDet.card_number__c?cardDet.card_number__c:"";
                    const cardEntityId = `TESTCUSTOMERED${tempid+100}`;
                    let data = {
                        "entityId": cardEntityId,
                        "entityType": "CUSTOMER",
                        "businessType": "LQ_PRE_EXT_26",
                        "businessId": `TESTCUSTOMERED0${tempid}`,
                        "title": "Mr",
                        "firstName": accountDet && accountDet.first_name__c?accountDet.first_name__c:"Kesavvels",
                        "lastName": accountDet && accountDet.last_name__c?accountDet.last_name__c:"Ramalingam",
                        "gender": accountDet && accountDet.gender__c?accountDet.gender__c.toUpperCase():"MALE",
                        "otp": "046303",
                        "isNRICustomer": false,
                        "isMinor": false,
                        "isDependant": false,
                        "countryCode": "356",
                        "kycStatus": "MIN_KYC",
                        "kitInfo": [
                            {
                                "cardType": "VIRTUAL",
                                "cardCategory": "PREPAID",
                                "cardRegStatus": "ACTIVE",
                                "expDate": null,
                                "kitNo": String(cardNumber)
                            }
                        ],
                        "addressInfo": [
                            {
                                "addressCategory": "PERMANENT",
                                "address1": addressDet && addressDet.address__c?addressDet.address__c:"S/O Ramalingam",
                                "city": addressDet && addressDet.city__c?addressDet.city__c:"Thoothukkudi",
                                "state": addressDet && addressDet.state__c?addressDet.state__c:"TAMILNADU",
                                "country": addressDet && addressDet.country__c?addressDet.country__c:"INDIA",
                                "pincode": addressDet && addressDet.pincode__c?addressDet.pincode__c:"628005"
                            },
                        ],
                        "communicationInfo": [
                            {
                                "contactNo": accountDet && accountDet.phone?accountDet.phone:"+919894204444",
                                "notification": true,
                                "emailId": accountDet && accountDet.email__c?accountDet.email__c:"testq@bank.com"
                            }
                        ],
                        "kycInfo": [
                            {
                                "kycRefNo": "123456",
                                "documentType": "PAN",
                                "documentNo": accountDet && accountDet.pan_number__c?accountDet.pan_number__c:"EKZAC4553E",
                                "documentExpiry": "2099-03-01"
                            }
                        ],
                        "dateInfo": [
                            {
                                "dateType": "DOB",
                                "date": getDate(accountDet && accountDet.date_of_birth_applicant__c?accountDet.date_of_birth_applicant__c:'')
                            }
                        ]
                    }

                //console.log("Request Data", data);
               /*  const randData = {
                    card_number__c: "2270000156", //cardNumber,
                    status__c: "PENDING",
                    account__c: accountDet.sfid,
                    accountid__c: merchantId,
                    plan_id__c: planId,
                    entity_id__c: "TESTCUSTOMERED103100",//cardEntityId,
                    kyc_status__c: 'PENDING',
                    card_limit__c: cardLimit,
                    vcard_number__c : "5555 5555 5555 4444",
                    vcard_expiry__c : "10/25",
                    vcard_cvv__c : "123"
                } */
               /*  const m2bData = await prisma.virtual_cart__c.create({ data: randData });
                await prisma.virtual_card_collection__c.update({ where:{ id: cardDet.id }, data: { status__c: "USED", response__c: JSON.stringify(randData) } });
                return res.status(200).json({ status:"success", message: "Success", data: randData }) */
               /*  const getData = {
                    "result": {
                        "entityId": "TESTCUSTOMERED00003",
                        "sorCustomerId": "GDRS5Q36EHFK",
                        "kycStatus": "PENDING",
                        "kycExpiryDate": null,
                        "kycRefNo": "0223898094590104",
                        "status": 0
                    },
                    "exception": null,
                    "pagination": null
                } */

                const getData = await generateVcard(data);

                if(getData && getData.result)
                {
                    const result = getData && getData.result?getData.result:null;
                    const entityId = result && result.entityId?result.entityId.trim():''
                    let objData = {
                        card_number__c: String(cardNumber),
                        status__c: "PENDING",
                        account__c: accountDet.sfid,
                        entity_id__c: entityId,
                        sor_customer_id__c: result && result.sorCustomerId?result.sorCustomerId:'',
                        kyc_expiry_date__c: result && result.kycExpiryDate?new Date(result.kycExpiryDate):null,
                        kyc_ref_no__c: result && result.kycRefNo?result.kycRefNo:'',
                        kyc_status__c: result && result.kycStatus?String(result.kycStatus):'',
                        card_limit__c: cardLimit
                    }
                    const m2bData = await prisma.virtual_cart__c.create({ data: objData });
                    
                    await prisma.virtual_card_collection__c.update({ where:{ id: cardDet.id }, data: { status__c: "USED", response__c: JSON.stringify(getData) } });
                    let obj = { 
                        card_number__c: cardNumber, 
                        entity_id__c: entityId,
                        id: m2bData.id
                    }
                    const updateData = await updateVCard(obj);
                    if(updateData.status == "success")
                    {
                        return res.status(200).json({ status:"success", message: "Success", data: objData })
                    }else{
                        return res.status(200).json(updateData)
                    }
                    
                }else{
                    let objData = {
                        status__c: "NOT CREATED",
                        account__c: accountDet.sfid,
                        card_limit__c: cardLimit
                    }
                    await prisma.virtual_cart__c.create({ data: objData });
                    await prisma.virtual_card_collection__c.update({ where:{ id: cardDet.id }, data: { status__c: "NOTWORKING", response__c: JSON.stringify(getData)  } });
                    return res.status(200).json({ status:"error", message: getData, data:data })
                }
            }else{
                
                return res.status(200).json({ status:"error", message: "There is enough card" })
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
    return custDate;
}

