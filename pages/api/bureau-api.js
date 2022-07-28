
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function bureaucheck(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return bureauCheck();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function bureauCheck() {
        try {
            const { id } = req.body;
            if (id == "" || id == undefined)
            return res.status(200).send({ status:"error", message: "Account id is mandatory" })
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: id
                }
            });
            let data =   {
                "firstName": accountDet.first_name__c,
                "middleName": "",
                "lastName": accountDet.last_name__c,
                "dateOfBirth":"30041972",
                "gender":"2",
                "panNo": accountDet.pan_number__c,
                "passportNumber": "",
                "dlno": "",
                "voterId": "",
                "uid": "",
                "idType":"01",
                "telephoneExtension":"",
                "telephoneNumber": accountDet.phone,
                "addressLine1":"VILLAGE -KAMALPUR SPOST - KAMALPUR DIST-",
                "addressLine2":"KASGANG U.P.",                    
                "addressType":"01",
                "city":"Etah",
                "pinCode":"207246",
                "residenceType":"02",
                "stateCode":"09",
                "purpose":"08",
                "amount":"150000"
              }
              const channel_id = process.env.USER_CHANNEL_ID;
              const client_id = process.env.USER_CLIENT_ID;
              const client_secret = process.env.USER_CLIENT_SECRET;
              const transaction_id = Math.floor(100000 + Math.random() * 900000);
            const getdata = await fetch('https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/e42db8de-d6a7-4bff-871a-d86f2df5a62b/s-edvnz-softpull-hardpull-d2c-api/1.0.4/m/bureau/hardpull',
            {
                method: 'POST',
                headers: {
                  'channel_id': channel_id,
                  'transaction_id': transaction_id,
                  'client_id': client_id,
                  'client_secret': client_secret,
                  'content-type': 'application/json'
                },
                body: JSON.stringify(data)
             }).then((response) => response.json())
             .then((response) => {
                  return response;
             });
             console.log('resData', getdata);
             let resData = getdata.address[0];
             resData.cust_id = id;
             await prisma.account_address.create({
                  data: resData
               });
               let scoreData = getdata.scoreSegment[0];
               await prisma.account_score.create({
                  data: {
                      cust_id: id,
                      score: scoreData.score,
                      scoreCardName: scoreData.scoreCardName,
                      scoreCardVersion: scoreData.scoreCardVersion,
                      scoreDate: scoreData.scoreDate,
                      scoreName: scoreData.scoreName,
                  }
               });
          
          // return res.status(200).send({  status:"success", message:'Success'});
            
        } catch (error) {
            return res.status(200).send({  status:"error", message: error.message ? error.message : error })
        }
    }
}

