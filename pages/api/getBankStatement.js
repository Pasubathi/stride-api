
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { GET_DOCUMENT_BY_ID , SALES_FORCE } from "./api";
import { getContentVersion } from './salesforce_api';
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
        return res.status(200).send({ status:"error", message: "ID is mandatory" })
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
                    const obj = {
                        user_sfid: id,
                        doc_type: "Bank Statement"
                    }
                    const getBankImg = await prisma.contentversion.findMany({
                        where:{
                            firstpublishlocationid: id,
                            document_type__c: "Bank Statement"
                        },
                        select:{
                            contentdocumentid: true
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    if(!getBankImg)
                    {
                        const getImg = await getContentVersion(token, obj);
                        if(getImg && getImg.done)
                        {
                            const records = getImg && getImg.records?getImg.records:null;
                            const getData = records && records.length > 0?records[0]:null;
                            const getContentData = await getContentImages(getData, apiInit);
                            return res.status(200).json({ status: 'success', message: "Success", data: getContentData})
                        }else{
                            return res.status(200).json({ status: 'error', message: getImg })
                        }
                    }else{
                        const getContentData = await getContentBankImages(getBankImg, apiInit);
                        return res.status(200).json({ status: 'success', message: "Success", data: getContentData})
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
            await Promise.all(getData.map(async element => {
                const imgsfid = element && element.ContentDocumentId?element.ContentDocumentId:'';
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
                        imageData.push(rowdata);
                      //  imgBase = getdata && getdata.base64?getdata.base64:'';
                    }
                }
            }));
           }
            resolve(imageData)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function getContentBankImages(getData, apiInit) {
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



