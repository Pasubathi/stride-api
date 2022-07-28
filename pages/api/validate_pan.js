import Cors from 'cors';
import { prisma } from "./_base";
import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import formidable from 'formidable';
import { documentFraudCheck, faceMatch } from "./eduvanz_api";

const handler = nextConnect()
handler.use(middleware, Cors())

handler.post(async (req, res) => {
 const { sfid } = req.body;
 if (sfid == "" || sfid == undefined)
    return res.status(200).send({ status:"error", message: "ID is mandatory" })/* 
 if(req.files.second_image)
    return res.status(200).send({ status:"error", message: "Profile image is mandatory" }) 
 if(req.files.first_image)
    return res.status(200).send({ status:"error", message: "Document image is mandatory" })  */
    const form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    const cust_id = String(sfid);
    console.log("cust_id ------->",cust_id);
    console.log("sfid ------->",sfid);
    const accountDet = await prisma.account.findFirst({
        where: {
            sfid: cust_id,
        }
    });
    if(accountDet)
    {
      const resData = await documentFraudCheck(req.files.first_image[0]);
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
              account__c: accountDet.sfid,
          },
        });
      }else{
        const getData = JSON.stringify(resData);
        await prisma.custom_error__c.create({
                data: {
                    method_name__c: "POST",
                    exception_message__c: String(getData),
                    account__c: accountDet.sfid,
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
                        const firstImage  = req.files.first_image[0];
                        const secondImage = req.files.second_image[0];
                        const resData     = await faceMatch(firstImage, secondImage);
                        if(resData && resData.code && resData.code == "SUCCESS")
                        {
                            const getData          = resData && resData.data?resData.data:null;
                            const extra            = resData && resData.extra?resData.extra:null;
                            const transactionId    = resData && resData.transactionId?resData.transactionId:null;
                            const pricingStrategy  = resData && resData.pricingStrategy?resData.pricingStrategy:null;
                            const similarity       = getData && getData.similarity?getData.similarity:null;
                            const firstFace        = getData && getData.firstFace?getData.firstFace:null;
                            const secondFace       = getData && getData.secondFace?getData.secondFace:null;
                            const firstFaceId      = firstFace && firstFace.id?firstFace.id:null;
                            const firstFaceLeft    = firstFace && firstFace.left?firstFace.left:null;
                            const firstFaceRight   = firstFace && firstFace.right?firstFace.right:null;
                            const firstFaceTop     = firstFace && firstFace.top?firstFace.top:null;
                            const firstFaceBottom  = firstFace && firstFace.bottom?firstFace.bottom:null;
                            const secondFaceId     = secondFace && secondFace.id?secondFace.id:null;
                            const secondFaceLeft   = secondFace && secondFace.left?secondFace.left:null;
                            const secondFaceRight  = secondFace && secondFace.right?secondFace.right:null;
                            const secondFaceTop    = secondFace && secondFace.top?secondFace.top:null;
                            const secondFaceBottom = secondFace && secondFace.bottom?secondFace.bottom:null;
                            const resJData = JSON.stringify(resData);
                            await prisma.api_logger__c.create({
                                data: {
                                    request__c: "POST",
                                    response__c: String(resJData),
                                    service__c: "Face Match",
                                    account__c: accountDet.sfid,
                                },
                            });
                            await prisma.face_match__c.create({
                                data: {
                                    pricing_strategy__c: pricingStrategy,
                                    similarity__c: similarity?Number(similarity):null,
                                    first_face_top__c: firstFaceTop?Number(firstFaceTop):null,
                                    first_face_bottom__c: firstFaceBottom?Number(firstFaceBottom):null,
                                    first_face_left__c: firstFaceLeft?Number(firstFaceLeft):null,
                                    first_face_id__c: firstFaceId?Number(firstFaceId):null,
                                    first_face_right__c: firstFaceRight?Number(firstFaceRight):null,
                                    second_face_bottom__c: secondFaceBottom?Number(secondFaceBottom):null,
                                    second_face_top__c: secondFaceTop?Number(secondFaceTop):null,
                                    second_face_left__c: secondFaceLeft?Number(secondFaceLeft):null,
                                    second_face_right__c: secondFaceRight?Number(secondFaceRight):null,
                                    second_face_id__c: secondFaceId?Number(secondFaceId):null,
                                    transaction_id__c: transactionId?String(transactionId):null,
                                    extra__c: extra?String(extra):null,
                                    account__c: accountDet.sfid
                                },
                            });
                            return res.status(200).json({ status: "success", message: "Valid Document"});
                        
                        }else{
                            const resJData = JSON.stringify(resData);
                            await prisma.custom_error__c.create({
                            data: {
                                method_name__c: "POST",
                                exception_message__c: String(resJData),
                                account__c: accountDet.sfid,
                                service__c: "Face Match",
                            },
                            });
                            return res.status(200).json({ status: "error", message: "Face does't match"});
                        }
                    }else{
                        return res.status(200).json({ status: "error", message: "Pan does't match"});
                    }
                }else{
                    return res.status(200).json({ status: "error", message: "Name does't match"});
                }
            }else{
                return res.status(200).json({ status: "error", message: "Invalid document"});
            }
        }else{
            return res.status(200).json({ status: "error", message: "Invalid document"});
        }
  }else{
    return res.status(200).json({ status: "error", message: "Account not found"});
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler