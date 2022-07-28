import Cors from 'cors';
import { prisma } from "./_base";
import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import formidable from 'formidable';
import { faceMatch } from "./eduvanz_api";


const handler = nextConnect()
handler.use(middleware, Cors())

handler.post(async (req, res) => {
 const { sfid } = req.body;
 if (sfid == "" || sfid == undefined)
    return res.status(200).send({ responseCode: 200,status:"error", message: "ID is mandatory" })
    const form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    if(req.files.second_image)
    {
        const firstImage  = req.files.first_image[0];
        const secondImage = req.files.second_image[0];
        const userSfid    = sfid[0];
        const resData = await faceMatch(firstImage, secondImage);
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
                    account__c: userSfid,
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
                    account__c: userSfid
                },
            });
           
        }else{
            const resJData = JSON.stringify(resData);
            await prisma.custom_error__c.create({
              data: {
                  method_name__c: "POST",
                  exception_message__c: String(resJData),
                  account__c: userSfid,
                  service__c: "Face Match",
              },
            });
        }
        return res.status(200).json(resData)
    }else{
        return res.status(200).json({status:'error', message: 'Profile not found'})
    }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler