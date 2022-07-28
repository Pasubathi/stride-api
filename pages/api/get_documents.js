
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { GET_DOCUMENT_BY_ID , SALES_FORCE } from "./api";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getDocuments(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getDocuments();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getDocuments() {
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
                    const getImg = await prisma.contentversion.findMany({
                        where:{
                            firstpublishlocationid: id
                        },
                        select:{
                            contentdocumentid: true
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    const getContentData = await getContentImages(getImg, apiInit);
                return res.status(200).json({ status: 'success', message: "Success", data: getContentData})
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

async function chekViewdProduct(user_id, product_id) {
    const checkPro = await prisma.viewed_products__c.findFirst({
        where:{
            account__id: user_id,
            product__id: product_id
        }
    });
    if(!checkPro)
    {
        await prisma.viewed_products__c.create({
            data:{
                account__id: user_id,
                product__id: product_id
            }
        });
    }
}

