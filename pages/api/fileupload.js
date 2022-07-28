import Cors from 'cors';
import { prisma } from "./_base";
import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import formidable from 'formidable';
import { livelinessCheck } from "./eduvanz_api";

const handler = nextConnect()
handler.use(middleware, Cors())
handler.post(async (req, res) => {
 const { sfid } = req.body;
 if(sfid == "" || sfid == undefined)
    return res.status(200).send({ responseCode: 200,status:"error", message: "ID is mandatory" })
    const form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    const user_sfid = String(sfid);
    const accountDet = await prisma.account.findFirst({
      where: {
          sfid: user_sfid,
      }
    });
    if(accountDet)
    {
      const attempt = accountDet && accountDet.photo_upload_attempt__c?Number(accountDet.photo_upload_attempt__c)+1:1;
      const resData = await livelinessCheck(req.files.files[0]);
      if(resData && resData.statusCode === 101)
      {
        const getData = JSON.stringify(resData);
        await prisma.api_logger__c.create({
          data: {
              request__c: "POST",
              response__c: String(getData),
              service__c: "Liveliness",
              account__c: sfid?sfid[0]:null,
          },
        });
      }else{
        const getData = JSON.stringify(resData);
        await prisma.custom_error__c.create({
          data: {
              method_name__c: "POST",
              exception_message__c: String(getData),
              account__c: sfid?sfid[0]:null,
              service__c: "Liveliness",
          },
        });
      }
      await prisma.account.update({
        where:{
          sfid: accountDet.sfid
        },
        data: {
          photo_upload_attempt__c: attempt
        }
      });
      return res.status(200).json({ responseCode: 200, message: resData, attempt: attempt });
    }else{
      return res.status(500).json({ responseCode: 200,status:"error", message: "Account not found" })
    }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler