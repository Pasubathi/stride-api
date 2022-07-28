import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import formidable from 'formidable';
import fs from 'fs';
import { livelinessCheck } from "./eduvanz_api";


const handler = nextConnect()
handler.use(middleware)

handler.post(async (req, res) => {
  console.log(req.files)
  let fileDetail = req.files.file[0];
  var originalName = fileDetail.originalFilename;
  var dir = 'tempFile';
  if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
let desPath = originalName;
fs.readFile(fileDetail.path, (err, data) => {
    if(err)
    return err;
    console.log("data", data);
})

})

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler