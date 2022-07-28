import Cors from 'cors';
import { prisma } from "./_base";
import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import formidable from 'formidable';
import { documentFraudCheck } from "./eduvanz_api";


const handler = nextConnect()
handler.use(middleware, Cors())

handler.post(async (req, res) => {
 const { sfid, type } = req.body;
 if (sfid == "" || sfid == undefined)
    return res.status(200).send({ status:"error", message: "ID is mandatory" })
 if (type == "" || type == undefined)
    return res.status(200).send({ status:"error", message: "Type is mandatory" }) 
  const form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    const cust_id = String(sfid);
    const accountDet = await prisma.account.findFirst({
        where: {
            sfid: cust_id,
        }
    });
    if(accountDet)
    {
      const resData = await documentFraudCheck(req.files.files[0]);
      if(resData && resData.statusCode === 101)
      {
        const getData = JSON.stringify(resData);
        await prisma.api_logger__c.create({
          data: {
              request__c: "POST",
              response__c: String(getData),
              service__c: "Fraud Chek",
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
              service__c: "Fraud Chek",
          },
      });
    }
    const getData = resData && resData.status && resData.status=="success"?resData.result:null;
    const result  = getData && getData.length > 0?getData[0]:null;
    const doctype = result && result.type?result.type:null;
    const details = result && result.details?result.details:null;
    const name    = details && details.name?details.name:null;
    const panNo   = details && details.pan_no?details.pan_no:null;
    console.log("doctype", doctype);
    if(type =="ADHAR-FRONT")
    {
        var obj = {
          data: resData
        };
      console.log("ADHAR-FRONT Called");
      if(doctype == "aadhaar_front_bottom" || doctype == "aadhaar_front_top")
      {
        const aName = name?name.value:'';
        const getName = aName?aName.split(" "):[];
        console.log("name", name);
        console.log("aName", aName);
        console.log("getName", getName);
        if(getName && getName.length > 0)
        {
          if(getName[0].toLowerCase() == accountDet.first_name__c.toLowerCase())
          {
            obj.status = 'success';
            obj.message = 'Valid adhaar front document';
          }else{
            obj.status = 'error';
            obj.message = 'Name mismatch';
          }
        }else{
          obj.status = 'error';
          obj.message = 'Invalid adhaar front document';
        }
      }else{
        obj.status = 'error';
        obj.message = 'Invalid adhaar front document';
      }
      res.status(200).json(obj)
    }else if(type =="ADHAR-BACK")
    {
        var obj = {
          data: resData
        };
      if(doctype=="aadhaar_back")
      {
            obj.status = 'success';
            obj.message = 'Valid adhaar back document';
      }else{
        obj.status = 'error';
        obj.message = 'Invalid adhaar back document';
      }
      res.status(200).json(obj)
    }else if(type =="PAN")
    {
        var obj = {
          data: resData
        };
      if(doctype=="pan")
      {
        const aName = name?name.value:'';
        const getName = aName?aName.split(" "):[];
        const panDet = panNo?panNo.value:'';
        console.log("panDet", panDet);
        console.log("getName", getName[1]);
        if(getName && getName.length > 0)
        {
          if(getName[1].toLowerCase() == "Vignesh".toLowerCase())
          {
            if(panDet == "AOGPV0946L")
            {
              obj.status = 'success';
              obj.message = 'Valid pan document';
            }else{
                obj.status = 'error';
                obj.message = 'Pan number mismatch';
              }
          }else{
            obj.status = 'error';
            obj.message = 'Name mismatch';
          }
        }else{
          obj.status = 'error';
          obj.message = 'Invalid pan document';
        }
      }else{
        obj.status = 'error';
        obj.message = 'Invalid pan document';
      }
      res.status(200).json(obj)
    }else{
      return res.status(200).json(resData)
    }
  }else{
    return res.status(200).json({ status: "error", message: "Account not found" })
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler