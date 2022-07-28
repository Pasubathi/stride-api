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
      await prisma.document_fraud_check__c.create({
        data: {
          response_json__c: String(JSON.stringify(resData)),
          account__c: accountDet.sfid,
        },
      });
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
    const message = resData && resData.message? resData.message:null;
    const doctype = result && result.type?result.type:null;
    const details = result && result.details?result.details:null;
    const name    = details && details.name?details.name:null;
    const panNo   = details && details.pan_no?details.pan_no:null;
    const given_name = details && details.given_name?details.given_name:null;
    if(type =="ADHAR-FRONT")
    {
      var obj = {
        data: resData
      };
      if(doctype == "aadhaar_front_bottom" || doctype == "aadhaar_front_top")
      {
        const aName = name?name.value:'';
        const getName = aName?aName.split(" "):[];
        if(getName && getName.length > 0)
        {
          if(getName[0].toLowerCase() == accountDet.first_name__c.toLowerCase())
          {
            obj.status  = 'success';
            obj.message = 'Valid adhaar front document';
            obj.type    = doctype;
          }else{
            obj.status  = 'error';
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
            obj.status  = 'success';
            obj.message = 'Valid adhaar back document';
            obj.type    = doctype;
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
        if(getName && getName.length > 0)
        {
          if((getName[1].toLowerCase() == accountDet.first_name__c.toLowerCase()) || (getName[0].toLowerCase() == accountDet.first_name__c.toLowerCase()))
          {
            const panDet = panNo?panNo.value:'';
            if(panDet == accountDet.pan_number__c)
            {
              obj.status  = 'success';
              obj.message = 'Valid pan document';
              obj.type    = doctype;
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
    }else if(type =="DRIVING-LIICENSE-FRONT")
    {
      var obj = {
        data: resData,
        status: 'error',
        message: message,
        type: ''
      };
      res.status(200).json(obj) 
    }else if(type =="DRIVING-LIICENSE-BACK")
    {
      var obj = {
        data: resData,
        status: 'error',
        message: message,
        type: ''
      };
      res.status(200).json(obj) 
    }else if(type =="VOTER-ID-FRONT")
    {
      var obj = {
        data: resData
      };
      if(doctype && (doctype =="voterid_front_new" || doctype =="voterid_front"))
      {
        const aName = name?name.value:'';
        const getName = aName?aName.split(" "):[];
        if(getName && getName.length > 0)
        {
          if(getName[0].toLowerCase() == accountDet.first_name__c.toLowerCase())
          {
            obj.status  = 'success';
            obj.message = 'Valid voter front document';
            obj.type    = doctype;
          }else{
            obj.status  = 'error';
            obj.message = 'Name mismatch';
          }
        }else{
          obj.status = 'error';
          obj.message = 'Invalid voter front document';
        }
      }else{
        obj.status = 'error';
        obj.message = 'Invalid voter front document';
      }
      res.status(200).json(obj)
    }else if(type =="VOTER-ID-BACK")
    {
      var obj = {
        data: resData
      };
      if(doctype && doctype =="voterid_back")
      {
            obj.status  = 'success';
            obj.message = 'Valid voter back document';
            obj.type    = doctype;
      }else{
        obj.status = 'error';
        obj.message = 'Invalid voter back document';
      }
      res.status(200).json(obj)
    }else if(type =="PASSPORT")
    {
      var obj = {
        data: resData
      };
      if(doctype && doctype =="passport_front")
      { 
        const aName = given_name?given_name.value:'';
        const getName = aName?aName.split(" "):[];
        if(getName && getName.length > 0)
        {
          if((getName[0] && getName[0].toLowerCase() == accountDet.first_name__c.toLowerCase()) || (getName[1] && getName[1].toLowerCase() == accountDet.first_name__c.toLowerCase()) || (getName[2] && getName[2].toLowerCase() == accountDet.first_name__c.toLowerCase()))
          {
            obj.status  = 'success';
            obj.message = 'Valid passport document';
            obj.type    = doctype;
          }else{
            obj.status  = 'error';
            obj.message = 'Name mismatch';
          }
        }else{
          obj.status = 'error';
          obj.message = 'Invalid passport document';
        }
      }else{
        obj.status = 'error';
        obj.message = 'Invalid passport document';
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