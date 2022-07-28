import Cors from 'cors';
import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import formidable from 'formidable';
import { bankStatementUpload } from "./eduvanz_api";
import { prisma } from "./_base";


const handler = nextConnect()
handler.use(middleware, Cors())

handler.post(async (req, res) => {
  const form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    const { user_sfid } = req.body;
    if(user_sfid == "" || user_sfid == undefined)
       return res.status(200).send({ status:"error", message: "User sfid is mandatory" })
    try{
      const cust_id  = String(user_sfid);
      const accountDet = await prisma.account.findFirst({
        where:{
          sfid: cust_id
        }
      });
      if(accountDet)
      {
        const resData = await bankStatementUpload(req.files.files[0]);
        if(resData && resData.status && resData.status =="Submitted")
        {
          await prisma.api_logger__c.create({
              data: {
                  response__c: JSON.stringify(resData),
                  service__c: "BANK STATEMENT UPLOAD",
                  account__c: accountDet.sfid
              },
          });
        }else{
          await prisma.custom_error__c.create({
            data: {
                exception_message__c: JSON.stringify(resData),
                account__c: accountDet.sfid,
                service__c: "BANK STATEMENT UPLOAD",
            },
          });
        }
        return res.status(200).json(resData);
      }else{
        return res.status(200).json({status: "error", nessage: "Account not found"});
      }
    } catch (error) {
      return res.status(200).send({ status:"error",  message: error.message ? error.message : error })
    }
   
    
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler