// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();
import initMiddleware from '../../lib/init-middleware'
import { GET_DOCUMENT_BY_ID , SALES_FORCE } from "./api";

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function getUserProfile(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getUserProfile();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getUserProfile() {
            const { id } = req.body;
            
            try {
                    let aadhar = [];
                    var cust_id = Number(id);
                    const accountDet = await prisma.account.findFirst({
                        where: {
                            id: cust_id
                        },
                    select: {
                        first_name__c: true,
                        last_name__c: true,
                        email__c: true,
                        pan_number__c: true,
                        id:true,
                        phone: true,
                        resident_type__c: true,
                        employer_type__c: true,
                        monthly_income__c: true,
                        occupation__c: true,
                        employer_name__c: true,
                        industry: true,
                        sfid: true,
                        ipa_basic_bureau__c: true,
                        secondary_mobile__c: true,
                        secondary_email__c: true,
                        bank_name__c: true,
                        ifsc__c: true,
                        bank_account_number__c: true
                    },
                        
                    });
                if(accountDet)
                {
                    const recordDet  = await prisma.recordtype.findFirst({
                        where: {
                            name: "Transaction Application",
                        },
                    });
                    let obj = {
                        NOT: [{ sfid: null }],
                        recordtypeid: String(recordDet.sfid),
                        lender_name__c: accountDet.sfid
                    }
                    const leadDet = await prisma.opportunity.count({
                        where: obj,
                    });
                    const init = {
                        method: 'POST'
                    };
                    const getdata = await fetch(SALES_FORCE, init).then((response) => response.json())
                    .then((response) => {
                            return response;
                    });
                    let token = '';
                    if(getdata && getdata.access_token)
                    {
                        token = getdata.access_token
                    }
                    var myHeaders = new Headers();
                    myHeaders.append("Authorization", "Bearer "+token);
                    myHeaders.append("content-type", "application/json");
                    const apiInit = {
                        method: 'GET',
                        headers: myHeaders,
                    };
                    const getProImg = await prisma.contentversion.findFirst({
                        where:{
                            firstpublishlocationid: accountDet.sfid,
                            document_type__c: "Photo"
                        },
                        select:{
                            contentdocumentid: true
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    const getProfileData = await getContentImages(getProImg, apiInit);
                    const getAadharFrontImg = await prisma.contentversion.findFirst({
                        where:{
                            firstpublishlocationid: accountDet.sfid,
                            document_type__c: "Aadhar Front"
                        },
                        select:{
                            contentdocumentid: true
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    const getAadharFrontData = await getContentImages(getAadharFrontImg, apiInit);
                    const getAadharBackImg = await prisma.contentversion.findFirst({
                        where:{
                            firstpublishlocationid:  accountDet.sfid,
                            document_type__c: "Aadhar Back"
                        },
                        select:{
                            contentdocumentid: true
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    const getAadharBackData = await getContentImages(getAadharBackImg, apiInit);
                    aadhar.push(getAadharFrontData,getAadharBackData);
                    const getImg = await prisma.contentversion.findFirst({
                        where:{
                            firstpublishlocationid:  accountDet.sfid,
                            document_type__c: "PAN"
                        },
                        select:{
                            contentdocumentid: true
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    const panData = await getContentImages(getImg, apiInit);
                    const bankInfo = await prisma.bank_account__c.findFirst({
                        where: {
                            account_id__c: accountDet.sfid
                        }
                        
                    });
               
                     
                        return res.status(200).json({
                           responseCode:200,
                           message:"success",
                           profile: accountDet,  
                           photo: getProfileData,
                           aadhar: aadhar,
                           pan: panData,
                           bank: bankInfo,
                           leadCount: leadDet,
                       })
                }
                else{
                    return res.status(500).json({
                        responseCode:500,
                        message: "Invalid user id",
                    })
                }

            } catch (e) {
                res.status(500).send({ responseCode:500,message: e.message ? e.message : e });
                return;
            }
        }
    } catch (error) {
        res.status(500).send({responseCode:500, message: error.message ? error.message : error })
    } 

}
async function getContentImages(getData, apiInit) {
    return new Promise(async (resolve, reject) => {
        try {
            let imageData = [];
           if(getData)
           {
            //await Promise.all(getData.map(async element => {
                const imgsfid = getData && getData.contentdocumentid?getData.contentdocumentid:'';
                if(imgsfid)
                {
                    const getImgData = await prisma.contentdocument.findFirst({
                        where:{
                            sfid: imgsfid
                        }
                    });
                    if(getImgData)
                    {
                        const img = getImgData.latestpublishedversionid;
                        const getdata = await fetch(GET_DOCUMENT_BY_ID+img, apiInit).then((response) => response.json())
                        .then((response) => {
                                return response;
                        });
                        let rowdata = {
                            title: getImgData && getImgData.title?getImgData.title:'',
                            filetype: getImgData && getImgData.filetype?getImgData.filetype:'',
                            base64: getdata
                        }
                        imageData=rowdata;
                      //  imgBase = getdata && getdata.base64?getdata.base64:'';
                    }
                }
            //}));
           }
            resolve(imageData)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}




