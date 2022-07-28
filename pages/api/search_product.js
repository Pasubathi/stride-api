
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
export default async function searchProducts(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return searchProducts();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function searchProducts() {
        try {
            const { search, keyword } = req.query;
            const query = req.query;
            if (keyword == "" || keyword == undefined)
                return res.status(200).send({ responseCode: 200,status:"error", message: "keyword is required" })
            if (search == "" || search == undefined)
                return res.status(200).send({ responseCode: 200,status:"error", message: "Category is required" })
            
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 12;
            const startIndex = (page - 1) * limit;
            let text = '';
            const searchWord = search+" "+keyword;
            const splitWord1 = searchWord.split(" ");
            await Promise.all(splitWord1.map(async (element, index) => {
                if(index > 0)
                {
                    if(element)
                    {
                        text += " & "+element
                    }
                }else{
                    text += element
                }
            }));

            
            console.log("text ======>", text);
            let fetchData = await prisma.product2.findMany({
                skip: startIndex,
                take: limit,
                where: {
                    OR: [
                        {
                            name: {
                                search: text,
                            },
                        }
                    ]
                }
            });
            if (fetchData) {
                let proData = [];
                await Promise.all(fetchData.map(async element => {
                    let rowData = {
                        id: element.id,
                        name: element.name,
                        price__c: element.price__c,
                        mrp__c: element.mrp__c,
                    //    brand__c: element.brand__c,
                        sfid: element.sfid,
                        product_category__c: element.product_category__c,
                    }
                    proData.push(rowData);
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

