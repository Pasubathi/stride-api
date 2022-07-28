
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
import { GET_DOCUMENT_BY_ID, SALES_FORCE } from "./api";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function discoverProducts(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return discoverProducts();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function discoverProducts() {
        try {
            const query = req.query;
            const page =  1;
            const limit =  10;
            const startIndex = (page - 1) * limit;
            let fetchData = await prisma.product2.findMany({
                skip: startIndex,
                take: limit,
                select:{
                    id: true,
                    name: true,
                    price__c: true,
                    mrp__c: true,
                //    brand__c: true,
                    product_category__c: true,
                    image_url__c: true,
                    sfid: true,
                },
                orderBy: {
                  id: 'desc',
                },
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
                     //   brand__c: element.brand__c,
                        sfid: element.sfid,
                        image_url__c: getContentData,
                        product_category__c: element.product_category__c,
                    }
                  //  console.log("rowData", rowData);
                    proData.push(rowData);
                   // console.log("proData", proData);
                }));
                return res.status(200).json(proData)
            } else {
                return res.status(400).json({ responseCode: 400, message: "Detail is not updated" })
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

