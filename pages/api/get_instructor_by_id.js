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

export default async function getFaqs(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getFaqs();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getFaqs() {
            const { id } = req.body;
            let product_id = String(id);
            try {
               
                const faqDet = await prisma.leading_instructors__c.findMany({
                    where: {
                        product__c: product_id
                    }
                    
                });
                if (faqDet) {
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

                   
                    let proData = [];
                    await Promise.all(faqDet.map(async element => {
                        const getImg = await prisma.contentversion.findFirst({
                            where:{
                                firstpublishlocationid: element.sfid
                            },
                            orderBy: {
                                id: 'asc',
                            },
                        });
                        const getContentData = await getContentImages(getImg, apiInit);
                    
                        let rowData = {
                            id: element.id,
                            name: element.name,
                            dipartment__c: element.dipartment__c,
                            description__c: element.description__c,
                            product__c: element.product__c,
                            sfid: element.sfid,
                            image_url__c: getContentData,
                        }
                        proData.push(rowData);
                    }));
                        return res.status(200).json({
                           responseCode:200,
                           status:'success',
                           message:"success",
                           data: proData,
                       })
                }
                else{
                    return res.status(500).json({
                        responseCode:500,
                        status:'error',
                        message: "Invalid product id",
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
            let imageData = '';
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
                        imageData=getdata && getdata.base64?getdata.base64:'';
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


