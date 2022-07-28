
import Cors from 'cors';
import moment from 'moment';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
import { GET_DOCUMENT_BY_ID, SALES_FORCE } from "./api";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getTransactions(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return getTransactions();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getTransactions() {
        try {
            let getDate = await getData();
              let obj = {
                  "due_date": getDate,
                  "amount": `20000`,
                  "products":[
                      {"store": "images/store/apple_logo.png", "product_name": "MacBook PRO 256GB", "amount": "10000", "due_date":"Due on Nov 20"},
                      {"store": "images/store/flipkart.png", "product_name": "OnePLUS Nord 56GB ", "amount": "10000", "due_date":"Due on Nov 20"},
                      {"store": "images/store/amazon.png", "product_name": "Dell Laptop 14 In", "amount": "10000", "due_date":"Due on Nov 20"}
                    ],
                  "monthly_streak":[
                      {"month":"JAN", "status":"paid"},
                      {"month":"FEB", "status":"paid"},
                      {"month":"MAR", "status":"overdue"},
                      {"month":"APR", "status":"paid"},
                      {"month":"MAY", "status":"paid"},
                      {"month":"JUN", "status":"paid"},
                      {"month":"JUL", "status":"paid"},
                      {"month":"AUG", "status":"upcoming"},
                      {"month":"SEP", "status":"paid"},
                      {"month":"OCT", "status":"paid"},
                      {"month":"NOV", "status":"paid"},
                      {"month":"DEC", "status":"paid"}
                   ]
              }
                return res.status(200).json({status: 'success', data: obj})
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

async function getData()
{
    return new Promise(async (resolve, reject)=>{
        let date = await moment().format("MMM Do, YYYY");
        console.log("date", date);
        resolve(date);
    });
}

