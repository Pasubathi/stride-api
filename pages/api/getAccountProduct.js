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

export default async function getAccountProduct(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getAccountProduct();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getAccountProduct() {
            const { user_sfid } = req.body;
           if (user_sfid == "" || user_sfid == undefined)
                return res.status(200).send({ status: "error", message: "Id is mandatory" })
            try {
                const cust_id = String(user_sfid);
                const productDet = await prisma.account_products.findFirst({
                    where: {
                        account__c: cust_id
                    }, 
                    orderBy: {
                        id: 'desc',
                    },
                });
                if(productDet && productDet.product_id)
                {
                    let productData = await prisma.product2.findFirst({
                        where: {
                            sfid: productDet.product_id
                        }
                    });
                    if(productData)
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
                        const getImg = await prisma.contentversion.findMany({
                            where:{
                                firstpublishlocationid: productData.sfid
                            },
                            select:{
                                contentdocumentid: true
                            },
                            orderBy: {
                                id: 'asc',
                            },
                        });
                        const getContentData = await getContentImages(getImg, apiInit);
                        productData.images = getContentData;
                    }
                    return res.status(200).json({ status: "success", message: "Success", data: productData })
                }else{
                    return res.status(200).json({ status: "error", message: "Details not found" })
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
            let imageData = [];
           if(getData)
           {
            await Promise.all(getData.map(async element => {
                const imgsfid = element && element.contentdocumentid?element.contentdocumentid:'';
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
            }));
           }
            resolve(imageData)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}



