// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { livelinessCheck } from "./eduvanz_api";
import multiparty from 'multiparty';
import formidable from 'formidable';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export const config = {
    api: {
      bodyParser: false,
    },
  };

export default async function checkLiveliness(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return checkLiveliness();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function checkLiveliness() {
            const form = new formidable.IncomingForm();
            form.multiples = true;
            form.keepExtensions = true;
            let fileData = form.parse(req, (err, fields, files) => {
                if(err)
                {
                    console.log('Error', err)
                }
              return files;
            });
           // console.log('fileData', fileData)
            const resData = await livelinessCheck(fileData);
            return res.status(200).send({message: resData});
         
            try {
               
            } catch (e) {
                res.status(500).send({ message: e.message ? e.message : e });
                return;
            }// update otp process
        }
    } catch (error) {
        res.status(500).send({ message: error.message ? error.message : error })
    } // get mobile number process

}

