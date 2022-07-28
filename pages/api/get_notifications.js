
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
export default async function getNotifications(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getNotifications();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getNotifications() {
        try {
            const { user_sfid } = req.body;
            if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error", message: "Id is mandatory" })    
            const cust_id = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id,
                }
            });
            if(accountDet)
            {
                let fetchData = await prisma.custom_notification__c.findMany({
                    where:{
                        account__c: accountDet.sfid
                    }
                });
                return res.status(200).json({ status: "success", message: "Success", data: fetchData })
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