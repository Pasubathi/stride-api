
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from './../../helpers/api';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function faceMatchLogger(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return faceMatchLogger();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function faceMatchLogger() {
        console.log(req.body);
        const { user_sfid, type, response, request } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "ID is mandatory" })
        if (type == "" || type == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "Response type is mandatory" })
        if (response == "" || response == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "Response is mandatory" })
        try {
            const sfid = String(user_sfid);
            const Type = String(type);
            const Request_c = request?String(request):null;
            const Response_c = String(response);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: sfid,
                }
            });
            if(accountDet)
            {
                if(Type =="SUCCESS")
                {
                    await prisma.api_logger__c.create({
                        data: {
                            response__c: Response_c,
                            service__c: "FACE MATCH",
                            request__c: Request_c?Request_c:null,
                            account__c: accountDet.sfid,
                        }
                    }); 
                    const resData          = JSON.parse(Response_c);
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
                            account__c: accountDet.sfid,
                        },
                    });
                    return res.status(200).json({ responseCode: 200,status:"success", message: "Success" })
                }else if(Type =="ERROR")
                {
                    await prisma.custom_error__c.create({
                        data: {
                            exception_message__c: Response_c,
                            service__c: "FACE MATCH",
                            account__c: accountDet.sfid,
                        }
                    }); 
                    return res.status(200).json({ responseCode: 200,status:"success", message: "Success" })
                }else {
                    return res.status(500).json({ responseCode: 200,status:"error", message: "Type not found" })
                }
            }else{
                return res.status(500).json({ responseCode: 200,status:"error", message: "Account not found" })
            }
        } catch (error) {
            res.status(200).send({ responseCode: 200,status:"error", message: error.message ? error.message : error })
        }
    }
}

