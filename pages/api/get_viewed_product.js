
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
import {  GET_DOCUMENT_BY_ID, SALES_FORCE } from "./api";

const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function viewedProduct(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return viewedProduct();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function viewedProduct() {
        try {
            const { user_sfid, category } = req.body;
            if (user_sfid == "" || user_sfid == undefined)
                return res.status(200).send({ status:"error", message: "User sfid is mandatory" })    
            /* if (category == "" || category == undefined)
                return res.status(200).send({ status:"error", message: "Category is mandatory" })     */
            const cust_id = String(user_sfid);
            const catName = category?String(category):null;
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id,
                }
            });
            if(accountDet)
            {
                let fetchData;
                let categoryDet = '';
                if(catName)
                {
                    const catDet = await prisma.product_category__c.findFirst({
                        where: {
                            name: catName
                        }
                    });
                    const subCatDet = await prisma.product_subcategory__c.findFirst({
                        where: {
                            name: catName
                        }
                    });
                    if(catDet)
                    {
                        categoryDet = catDet.name;
                        fetchData = await prisma.viewed_products__c.findMany({
                            where:{
                                account__id: accountDet.sfid,
                                product2: {
                                    product_category_lu__c: {
                                      contains: catDet.sfid,
                                    },
                                },
                            },
                        });
                    }else if(subCatDet)
                    {
                        categoryDet = subCatDet.name;
                        fetchData = await prisma.viewed_products__c.findMany({
                            where:{
                                account__id: accountDet.sfid,
                                product2: {
                                    product_subcategory__c: {
                                      contains: subCatDet.sfid,
                                    },
                                },
                            },
                        });
                    }else{
                        return res.status(200).json({ status: "error", message: "Category not found" })
                    }
                }else{
                    fetchData = await prisma.viewed_products__c.findMany({
                        where:{
                            account__id: accountDet.sfid
                        }
                    });
                }
                
                let proData = [];
                await Promise.all(fetchData.map(async element => {
                    const getProData = await prisma.product2.findFirst({
                        where:{
                            sfid: element.product__id
                        }
                    });
                    if(getProData)
                    {
                        let isFavorite = false;
                        if(accountDet.sfid)
                        {
                            const favDet =  await prisma.favorite_products__c.findFirst({
                                where:{
                                    account__id: accountDet.sfid,
                                    product__id: getProData.sfid,
                                }
                            });
                            if(favDet)
                            {
                                isFavorite = true
                            }
                        }
                        let rowData = {
                            id: getProData.id,
                            name: getProData.name,
                            price__c: getProData.price__c,
                            mrp__c: getProData.mrp__c,
                         //   brand__c: getProData.brand__c,
                            sfid: getProData.sfid,
                            isFavorite: isFavorite,
                            image_url__c: getProData.image_url__c,
                            product_category__c: getProData.product_category__c,
                            category: categoryDet,
                        }
                        proData.push(rowData);
                    }
                }));
                return res.status(200).json({ status: "success", message: "Success", data: proData })
            }else{
                return res.status(200).json({ status: "error", message: "Detail not found" })
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