// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware'
import getConfig from 'next/config';
import { DIGILOCKER_DOCUMENT, DIGILOCKER_DOWNLOAD } from "./api";
import { uploadFile } from "./eduvanz_api"; 
import { htmltoPdf } from "./converter_api";
var convert = require('xml-js');
const { serverRuntimeConfig } = getConfig();
const USER_KARZA_KEYS = process.env.USER_KARZA_KEYS;
const REDIRECT_URL = process.env.DIGILOCKER_REDIRECT_URL;

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
 )
export default async function digilockerDownload(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return digilockerDownload();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function digilockerDownload() {
        const { id, token, requestId, parent_id } = req.body;
        if (id == "" || id == undefined)
        {
            return res.status(200).send({ responseCode: 200,status:"error", message: "Unauthorized access" })
        }
        if (token == "" || token == undefined){
            return res.status(200).send({ responseCode: 200,status:"error", message: "Unauthorized access" })
        }
        if (requestId == "" || requestId == undefined){
            return res.status(200).send({ responseCode: 200,status:"error", message: "Request id is mandatory" })
        }
        if (parent_id == "" || parent_id == undefined){
            return res.status(200).send({ responseCode: 200,status:"error", message: "Parent id is mandatory" })
        }
        try {
                    let data = {
                        "consent": "Y",
                        "accessRequestId": requestId 
                      }
                    console.log("Body Data", data);
                    var myHeaders = new Headers();
                    const channel_id = process.env.USER_CHANNEL_ID;
                    const client_id = process.env.USER_CLIENT_ID;
                    const client_secret = process.env.USER_CLIENT_SECRET;
                    const transaction_id = Math.floor(100000 + Math.random() * 900000);
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append('channel_id', channel_id);
                    myHeaders.append('transaction_id', transaction_id);
                    myHeaders.append('client_id', client_id);
                    myHeaders.append('client_secret', client_secret);
                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: JSON.stringify(data),
                        redirect: 'follow'
                    };
                    const getdata = await fetch(DIGILOCKER_DOCUMENT, requestOptions).then((response) => response.json())
                    .then((response) => {
                        return response;
                    });
                    console.log("getdata", getdata);
                    if(getdata.statusCode =="101" && getdata.result !==undefined)
                    {
                        let docData = getdata.result;
                        let accessId = requestId;
                      //  let accessId = getdata.requestId;
                        docData.forEach( async element => {
                            
                           let type    = element.name;
                           let resData = {
                                    "consent": "Y",
                                    "accessRequestId": accessId,
                                    "files": [
                                        {
                                            "uri": element.uri,
                                            "pdfB64": true,
                                            "parsed": true,
                                            "xml": true
                                        }
                                    ]
                            }
                            var myNewHeaders = new Headers();
                            myNewHeaders.append("Content-Type", "application/json");
                            myNewHeaders.append("x-karza-key", USER_KARZA_KEYS);
                            myNewHeaders.append('channel_id', channel_id);
                            myNewHeaders.append('transaction_id', transaction_id);
                            myNewHeaders.append('client_id', client_id);
                            myNewHeaders.append('client_secret', client_secret);
                            var requestNewOptions = {
                                method: 'POST',
                                headers: myNewHeaders,
                                body: JSON.stringify(resData),
                                redirect: 'follow'
                            };
                            const getDocData = await fetch(DIGILOCKER_DOWNLOAD, requestNewOptions).then((response) => response.json())
                            .then((response) => {
                                return response;
                            });
                            console.log("getDocData", getDocData);
                            if(getDocData.statusCode =="101")
                            {
                                let attachType = "Aadhar-Front";
                                console.log("attachType", attachType);
                                if(getDocData.result[0].parsedFile.data && getDocData.result[0].parsedFile.data !=null)
                                { 
                                    const getPic = getDocData.result[0].parsedFile.data.issuedTo?getDocData.result[0].parsedFile.data.issuedTo:null;
                                    const rawFiles = getDocData.result[0].rawFiles?getDocData.result[0].rawFiles:null;
                                    const xmlData = rawFiles && rawFiles.xml?rawFiles.xml:null;
                                    const xmlContent = xmlData && xmlData.content?xmlData.content:null;
                                    let base64 = getPic && getPic.photo?getPic.photo.content:'';
                                    let fileType = getPic && getPic.photo?getPic.photo.format:'';
                                    if(!base64)
                                    {
                                        var result1 = convert.xml2json(xmlContent, {compact: true, spaces: 4});
                                        const parsedaa = JSON.parse(result1); 
                                        const KycRes = parsedaa && parsedaa.KycRes?parsedaa.KycRes:'';
                                        const UidData = KycRes && KycRes.UidData?KycRes.UidData:'';
                                        const Pht = UidData && UidData.Pht?UidData.Pht:'';
                                        base64 = Pht && Pht._text?Pht._text:'';
                                        fileType = "image/jpg";
                                    }
                                    const address =  getDocData.result[0].parsedFile.data.issuedTo;
                                    const photoBase = `data:image/${fileType};base64,${base64}`;
                                    let resData = {
                                        name: address.name,
                                        dob: address.dob,
                                        gender: address.gender,
                                    };
                                    let obj = {
                                        image: photoBase,
                                        data: resData
                                    }
                                    const pdfBase = await htmltoPdf(obj);
                                    if(pdfBase.status =="success")
                                    {
                                        const d = new Date()
                                        const time = d.getTime()
                                        let data = {
                                           parent_id: parent_id, 
                                           fname: `eduvan-${time}.pdf`, 
                                           base64: pdfBase.base64, 
                                           doctype: "photo", 
                                           token: token
                                        }
                                        const uploadData =  await uploadFile(data);
                                        console.log("uploadData", uploadData);
                                        if(uploadData.status !== undefined && uploadData.status ==="success")
                                        {
                                           await prisma.account_attachment.create({
                                               data: {
                                                   cust_id: Number(id),
                                                   document_id: uploadData.data.DocumentId,
                                                   document_type: attachType,
                                                   doc__type: "application/pdf"
                                               },
                                           });
                                        } 
                                    }
                                    
                                   return res.status(200).send({ status:"success", message: getDocData, data:pdfBase});

                                }else{
                                    return res.status(200).send({ status:"success", message: getDocData}); 
                                }
                                 
                            }else{
                                return res.status(200).send({ status:"error", message: getDocData});
                            }
                        });
                    }else{
                        return res.status(200).send({ status:"error", message: getdata});
                    }
                  
            } catch (error) {
                res.status(200).send({ status:"error", message: error.message ? error.message : error })
            }
        }
}

