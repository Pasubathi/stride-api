// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware'
import { sendOtp } from "./eduvanz_api"

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function oneMoneyRequest(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return oneMoneyRequest();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function oneMoneyRequest() 
        {
            const { mobile_no } = req.body;
            if (mobile_no == "" || mobile_no == undefined || mobile_no.length != 10)
                return res.status(200).send({ responseCode:200,status:"error",message: "Mobile number is not empty" })
           
            try {
                    var myHeaders = new Headers();
                    myHeaders.append("client_id", "a3ce22bb5f411431b1660a3c781742b7a92a4a1f");
                    myHeaders.append("client_secret", "80558b516dcd9447641856972b2ba66508a99bbd");
                    myHeaders.append("organisationId", "eduvanz-fiu-uat");
                    myHeaders.append("appIdentifier", "com.moneyone.app");
                    myHeaders.append("Content-Type", "application/json");

                    var raw = JSON.stringify({
                        "partyIdentifierType": "MOBILE",
                        "partyIdentifierValue": mobile_no,
                        "productID": "06APRIL",
                        "accountID": "loan1122",
                        "vua": "9894204012@onemoney"
                    });

                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };

                    const getData = await fetch("https://eduvanz-uat.moneyone.in/v2/requestconsent", requestOptions)
                    .then(response => response.json())
                    .then(result => { return result });
                    console.log("getData", getData);
                    res.status(200).send(getData);
                    
            } catch (e) {
                res.status(200).send({ responseCode:200,status:"error",message: e.message ? e.message : e });
                return;
            }
        }
    } catch (error) {
        res.status(200).send({responseCode:200,status:"error", message: error.message ? error.message : error })
    }

}
