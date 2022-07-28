
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
export default async function getTopBrand(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getTopBrand();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getTopBrand() {
        try {
            const { category } = req.body;
            if (category == "" || category == undefined)
                return res.status(200).send({ status:"error", message: "Category is mandatory" })
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
                if(catDet || subCatDet)
                {
                   /*  let conObj = 'product_brand__c IS NOT NULL ';
                    if(catDet)
                    {
                        console.log("catDet ----------->", catDet)
                        conObj = `${conObj} AND product_category_lu__c = '${catDet.sfid}'`;
                    }else{
                        console.log("subCatDet ----------->", subCatDet)
                        conObj = `${conObj} AND product_subcategory__c = '${subCatDet.sfid}'`;
                    } */
                   
                    
                   let conObj = {
                        product_brand__c: {
                            notIn: ['']
                        }
                    };
                    if(catDet)
                    {
                        conObj.product_category_lu__c = catDet.sfid;
                    }else{
                        conObj.product_subcategory__c = subCatDet.sfid;
                    }
                  
                  let fetchData = await prisma.product2.groupBy({
                        by: ['product_brand__c'],
                        where: conObj
                    });
                    console.log("conObj ----------->", conObj);
                    /* console.log("conObj ----------->", conObj);
                console.log("Query ----------->", `SELECT product_brand__c FROM product2 WHERE ${conObj} GROUP BY product_brand__c;`);
                const fetchData = await prisma.$queryRaw`SELECT product_brand__c FROM product2 WHERE ${conObj} GROUP BY product_brand__c;`; */
               
                if (fetchData)
                {
                    let proData = [];
                    await Promise.all(fetchData.map(async element => {
                        const proDet = await prisma.product2.findFirst({
                            where:{
                                product_brand__c: element.product_brand__c
                            },
                            orderBy:{
                                id: 'desc'
                            }
                        });
                        if(proDet)
                        {
                            let brandDet;
                            if(proDet.product_brand__c)
                            {
                                brandDet = await prisma.product_brand__c.findFirst({
                                    where:{
                                        sfid: proDet.product_brand__c
                                    }
                                });
                            }
                            
                            const getImg = await prisma.contentversion.findFirst({
                                where:{
                                    firstpublishlocationid: proDet.sfid
                                },
                                orderBy: {
                                    id: 'asc',
                                },
                            });
                            let rowData = {
                                id: proDet.id,
                                name: proDet.name,
                                price__c: proDet.price__c,
                                mrp__c: proDet.mrp__c,
                                brand__c: brandDet && brandDet.name?brandDet.name:'',
                                sfid: proDet.sfid,
                                image_url__c: proDet.image_url__c,
                                product_category__c: proDet.product_category__c,
                            }
                            proData.push(rowData);
                        }
                    }));
                    return res.status(200).json(proData)
                } else {
                    return res.status(400).json({ responseCode: 400, message: "Record not found" })
                }
            }else{
                return res.status(200).json({ status: 'error', message: "Category not found"})
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

