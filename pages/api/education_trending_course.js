
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { GET_DOCUMENT_BY_ID, SALES_FORCE } from "./api";

const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function eduTrendingCourse(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return eduTrendingCourse();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function eduTrendingCourse() {
        try {
                const page = 1;
                const limit = 10;
                const startIndex = (page - 1) * limit;
                const catDet = await prisma.product_category__c.findFirst({
                    where: {
                        name: "Education"
                    }
                });
                if(catDet)
                {
                    const fetchData = await prisma.product2.findMany({
                        skip: startIndex,
                        take: limit,
                        select:{
                            id: true,
                            name: true,
                            price__c: true,
                            mrp__c: true,
                            product_category__c: true,
                            image_url__c: true,
                            sfid: true,
                        },
                        where:{
                            product_category_lu__c : catDet.sfid
                        },
                        orderBy: {
                        id: 'desc',
                        }
                    });
                    if (fetchData) {
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
                        console.log("Token", token);
                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", "Bearer "+token);
                        myHeaders.append("content-type", "application/json");
                        const apiInit = {
                            method: 'GET',
                            headers: myHeaders,
                        };
                    let proData = [];
                    await Promise.all(fetchData.map(async element => {
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
                            price__c: element.price__c,
                            mrp__c: element.mrp__c,
                            sfid: element.sfid,
                            image_url__c: getContentData,
                            product_category__c: element.product_category__c,
                        }
                        console.log("rowData", rowData);
                        proData.push(rowData);
                        console.log("proData", proData);
                    }));
                    return res.status(200).json({ status: "success", message: "Success", data: proData })
                } else {
                    return res.status(200).json({ status: "error", message: "Record no found" })
                }
                }else{
                    return res.status(200).json({ status: "error", message: "Record no found" })
                }
        } catch (error) {
            res.status(400).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

async function getContentImages(getData, apiInit) {
    return new Promise(async (resolve, reject) => {
        try {
            let imageData = [];
            if(getData)
            {
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
                        imageData.push(getdata);
                        //  imgBase = getdata && getdata.base64?getdata.base64:'';
                    }
                }
            }
            resolve(imageData)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}