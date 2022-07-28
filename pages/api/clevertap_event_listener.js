import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import request from "request";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function cleverTapEvents(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return cleverTapEvents();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function cleverTapEvents() {
        const { event } = req.body;
        if (event == "" || event == undefined)
            return res.status(500).send({ message: "Event is mandatory" })
            
        try {
                const event_type = String(event);
                const ACCOUNT_ID = process.env.CLEVERTAP_PROJECTID;
                const PASSCODE   = process.env.CLEVERTAP_PASSCODE;
                var headers = {
                    'X-CleverTap-Account-Id': ACCOUNT_ID,
                    'X-CleverTap-Passcode': PASSCODE,
                    'Content-Type': 'application/json; charset=utf-8'
                };
                
                var dataString = `{ "d": [ { "FBID": "34322423", "ts": 1468308340, "type": "event", "evtName": "${event_type}" } ] }`;
                
                var options = {
                    url: 'https://api.clevertap.com/1/upload',
                    method: 'POST',
                    headers: headers,
                    body: dataString
                };

                request(options, function (error, response, body) {
                    console.log("response ===>", response.statusCode)
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    }else{ console.log(error); }
                });
                return res.status(200).send({  status:"success", "message":"Success"});
               
        } catch (error) {
            return res.status(200).send({  status:"error", message: error.message ? error.message : error });
        }
    }
}
