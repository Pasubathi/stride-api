
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { GET_DOCUMENT_BY_ID , SALES_FORCE } from "./api";
import { getAllTypeContentVersion } from './salesforce_api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getDocument(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getDocument();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getDocument() {
        const { sfid } = req.body;
        if (sfid == "" || sfid == undefined)
        return res.status(200).send({ status:"error", message: "Sfid is mandatory" })
        try {
            const id = String(sfid);
            const accountDet = await prisma.account.findFirst({
                where:{
                    sfid: id
                }
            });
            if(accountDet)
            {
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
                    let obj = {
                        user_sfid: id
                    }
                    const getAllImg = await prisma.contentversion.findMany({
                        where:{
                            firstpublishlocationid: id
                        },
                        select:{
                            document_type__c: true,
                            contentdocumentid: true
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    if(!getAllImg)
                    {
                        let getAadharFrontData;
                        let getAadharBackData;
                        let getVoterFrontData;
                        let getVoterBackData;
                        let getPassportData;
                        let getDlData;
                        const getImg = await getAllTypeContentVersion(token, obj);
                        if(getImg && getImg.done)
                        {
                            const records = getImg && getImg.records?getImg.records:null;
                            const getData = records && records.length > 0?records:[];
                            await Promise.all(getData.map(async element => {
                                const getImgData = await getContentImages(element, apiInit);
                                if(element && element.Document_Type__c =="Aadhar Front")
                                {
                                    getAadharFrontData = getImgData;
                                }else if(element && element.Document_Type__c =="Aadhar Back")
                                {
                                    getAadharBackData = getImgData;
                                }else if(element && element.Document_Type__c =="Voter Id Front")
                                {
                                    getVoterFrontData = getImgData;
                                }else if(element && element.Document_Type__c =="Voter Id Back")
                                {
                                    getVoterBackData = getImgData;
                                }else if(element && element.Document_Type__c =="Passport")
                                {
                                    getPassportData = getImgData;
                                }else if(element && element.Document_Type__c =="Driving Licence")
                                {
                                    getDlData = getImgData;
                                }
                            }));
                            return res.status(200).json({ status: 'success', message: "Success", aadharfrontdata: getAadharFrontData, aadharbackdata: getAadharBackData, voterfrontdata: getVoterFrontData, voterbackdata: getVoterBackData, passport: getPassportData, driving: getDlData})
                        }else{
                            return res.status(200).json({ status: 'error', message: getImg })
                        }
                    }else{
                        let getAadharFrontData;
                        let getAadharBackData;
                        let getVoterFrontData;
                        let getVoterBackData;
                        let getPassportData;
                        let getDlData;
                        await Promise.all(getAllImg.map(async element => {
                            const getImgData = await getContentAllImages(element, apiInit);
                            if(element && element.document_type__c =="Aadhar Front")
                            {
                                getAadharFrontData = getImgData;
                            }else if(element && element.document_type__c =="Aadhar Back")
                            {
                                getAadharBackData = getImgData;
                            }else if(element && element.document_type__c =="Voter Id Front")
                            {
                                getVoterFrontData = getImgData;
                            }else if(element && element.document_type__c =="Voter Id Back")
                            {
                                getVoterBackData = getImgData;
                            }else if(element && element.document_type__c =="Passport")
                            {
                                getPassportData = getImgData;
                            }else if(element && element.document_type__c =="Driving Licence")
                            {
                                getDlData = getImgData;
                            }
                        }));
                        return res.status(200).json({ status: 'success', message: "Success", aadharfrontdata: getAadharFrontData, aadharbackdata: getAadharBackData, voterfrontdata: getVoterFrontData, voterbackdata: getVoterBackData, passport: getPassportData, driving: getDlData})
                    }
            } else {
                return res.status(200).json({ status: 'error', message: "Detail is not found" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

async function getContentImages(getData, apiInit) {
    return new Promise(async (resolve, reject) => {
        try {
            let imageData = [];
           if(getData)
           {
            //await Promise.all(getData.map(async element => {
                const imgsfid = getData && getData.ContentDocumentId?getData.ContentDocumentId:'';
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

async function getContentAllImages(getData, apiInit) {
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



