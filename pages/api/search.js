
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
export default async function fetchSearchData(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return fetchSearchData();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchSearchData() {
        try {
            const { search, user_sfid, category } = req.query;
            const query = req.query;
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const startIndex = (page - 1) * limit;
            let text = '';
            const splitWord = search.split(" ");
            const cust_id = user_sfid?String(user_sfid):'';
            await Promise.all(splitWord.map(async (element, index) => {
                if(index > 0)
                {
                    if(element)
                    {
                        text += " | "+element
                    }
                }else{
                    text += element
                }
            }));
            //console.log("search", text);
            let objCon = {
                OR: [
                        {
                            name: {
                                search: text,
                            },
                        }
                    ]
            }
            if(category)
            {
                const category_name = String(category);
                const catDet = await prisma.product_category__c.findFirst({
                    where: {
                        name: category_name
                    }
                });
                const subCatDet = await prisma.product_subcategory__c.findFirst({
                    where: {
                        name: category_name
                    }
                });
                if(catDet)
                {
                    objCon.product_category_lu__c = catDet.sfid;
                }
                if(subCatDet)
                {
                    objCon.product_subcategory__c = subCatDet.sfid;
                }
            }
            let count = await prisma.product2.count({
                where: objCon,/* {
                    OR: [
                        {
                            name: {
                                search: text,
                            },
                            product_category__c: {
                                search: text,
                            },
                            product_sub_category__c: {
                                search: text,
                            }, 
                            brand__c: {
                                search: text,
                            } 
                        }
                    ]
                }, */
            });
            let fetchData = await prisma.product2.findMany({
                skip: startIndex,
                take: limit,
                where: objCon,/* {
                    OR: [
                        {
                            name: {
                                search: text,
                            },
                            product_category__c: {
                                search: text,
                            },
                            product_sub_category__c: {
                                search: text,
                            }, 
                            brand__c: {
                                search: text,
                            } 
                        }
                    ]
                } */
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
                    let catDet;
                    let subCatDet;
                    if(element.product_category_lu__c)
                    {
                        catDet = await prisma.product_category__c.findFirst({
                            where: {
                                sfid: element.product_category_lu__c
                            }
                        });
                    }
                    if(element.product_subcategory__c)
                    {
                        subCatDet = await prisma.product_subcategory__c.findFirst({
                            where: {
                                sfid: element.product_subcategory__c
                            }
                        });
                    }
                    let isFavorite = false;
                    if(user_sfid)
                    {
                        const favDet =  await prisma.favorite_products__c.findFirst({
                            where:{
                                account__id: cust_id,
                                product__id: element.sfid,
                            }
                        });
                        if(favDet)
                        {
                            isFavorite = true
                        }
                    }
                    const getContentData = await getContentImages(getImg, apiInit);
                    let rowData = {
                        id: element.id,
                        name: element.name,
                        price__c: element.price__c,
                        mrp__c: element.mrp__c,
                        isFavorite: isFavorite,
                        sfid: element.sfid,
                        image_url__c: getContentData,
                        product_category__c: catDet && catDet.name?catDet.name:'',
                        product_sub_category__c: subCatDet && subCatDet.name?subCatDet.name:'',
                    }
                    proData.push(rowData);
                }));
                return res.status(200).json({ responseCode: 200, status: 'success', data: proData, count: count})
            } else {
                return res.status(400).json({ responseCode: 200, status: 'error', data: fetchData, count: count})
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

