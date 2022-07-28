// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import initMiddleware from '../../lib/init-middleware'
import getConfig from 'next/config';
import { GET_DOCUMENT_BY_ID } from "./api";
const { serverRuntimeConfig } = getConfig();

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
 )
export default async function getAccountDocument(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getAccountDocument();
        default:
            return res.status(405).send({ message: `Method ${req.method} Not Allowed` })
    }
    async function getAccountDocument() {
        const { id, token } = req.body;
        if (id == "" || id == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "Unauthorized access" })
        if(token == "" || token == undefined)
            return res.status(200).send({ responseCode: 200,status:"error", message: "Unauthorized access" })
        try {
            const cust_id = Number(id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id,
                }
            });
            if(accountDet)
            {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer "+token);
                myHeaders.append("content-type", "application/json");
                const apiInit = {
                    method: 'GET',
                    headers: myHeaders,
                };
                const getImg = await prisma.contentversion.findMany({
                    where:{
                        firstpublishlocationid: accountDet.sfid
                    },
                    orderBy: {
                        id: 'asc',
                    },
                });
                const getContentData = await getContentImages(getImg, apiInit);
                return res.status(200).send({ status:"success", message:"Success", data: getContentData });
            }else{
                return res.status(200).send({ status:"error", message:"Details not found" });
            }
        } catch (error) {
            res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

async function getContentImages(getData, apiInit) {
    return new Promise(async (resolve, reject) => {
        try {
            let imageData = [];
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
            resolve(imageData)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

