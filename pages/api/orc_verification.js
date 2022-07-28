import Cors from 'cors';
import { prisma } from "./_base";
import middleware from '../../middleware/middleware'
import nextConnect from 'next-connect'
import formidable from 'formidable';
import { ocrVerification } from "./eduvanz_api";


const handler = nextConnect()
handler.use(middleware, Cors())

handler.post(async (req, res) => {
 // console.log(req.body)
 // console.log(req.files.files[0])
 const { user} = req.body;
 console.log("user", user);
  const form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    const imageDetails1 = req.files.imageDetails1?req.files.imageDetails1:null;
    const imageDetails2 = req.files.imageDetails2?req.files.imageDetails2:null;
    const imageDetails3 = req.files.imageDetails3?req.files.imageDetails3:null;
    if(user ==undefined || user =='')
        return res.status(200).json({status: 'error', message: 'Id is required'})
    if(imageDetails1 ==undefined || imageDetails1 =='')
        return res.status(200).json({status: 'error', message: 'imageDetails1 is required'})
    if(imageDetails2 ==undefined || imageDetails2 =='')
        return res.status(200).json({status: 'error', message: 'imageDetails2 is required'})
    
        try{
           /*  const cust_id = Number(user);
            const accountDet = await prisma.account.findFirst({
                where:{
                    id: cust_id
                }
            });
            if(!accountDet)
            { */
                const first_name = "Vignesh";
                const resData = await ocrVerification(first_name, imageDetails1[0], imageDetails2[0], imageDetails3);
                if(resData && resData.statusCode === 101)
                {
                    const getData = JSON.stringify(resData);
                   /*  await prisma.api_logger__c.create({
                        data: {
                            request__c: "POST",
                            response__c: String(getData),
                            service__c: "Fraud Chek",
                            account__c: accountDet.sfid,
                        },
                    }); */
                }else{
                    const getData = JSON.stringify(resData);
                   /*  await prisma.custom_error__c.create({
                        data: {
                            method_name__c: "POST",
                            exception_message__c: String(getData),
                            account__c: accountDet.sfid,
                            service__c: "Fraud Chek",
                        },
                    }); */
                }
                return res.status(200).json(resData)
           /*  }else{
                res.status(200).send({ status:"error", message: "Account not found"})
            } */
        
    } catch (error) {
        res.status(200).send({ status:"error", message: error.message ? error.message : error })
    }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler