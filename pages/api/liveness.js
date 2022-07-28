import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import formidable from 'formidable';
import { livelinessCheck } from "./eduvanz_api";


const handler = nextConnect()
handler.use(middleware)

handler.post(async (req, res) => {
 // console.log(req.body)
 // console.log(req.files.files[0])
  const form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    let fileData = form.parse(req, (err, fields, files) => {
        if(err)
        {
            console.log('Error', err)
        }
        return files.files;
    });
  
  const resData = await livelinessCheck(req.files.files[0]);
  return res.status(200).json({ responseCode: 200, message: resData })

  //...
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler