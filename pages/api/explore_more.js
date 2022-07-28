
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
export default async function getExploreMore(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return getExploreMore();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getExploreMore() {
        try {
            const query = req.query;
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const startIndex = (page - 1) * limit;
            let fetchData = await prisma.product2.findMany({
                skip: startIndex,
                take: limit,
                select:{
                    id: true,
                    name: true,
                    price__c: true,
                    mrp__c: true,
                 //   brand__c: true,
                    product_category__c: true,
                    image_url__c: true,
                    sfid: true,
                },
                orderBy: {
                  id: 'desc',
                },
            });
            if (fetchData) {
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
                    const img = getImg && getImg.contentdocumentid?getImg.contentdocumentid:'';
                    let imgBase = '';
                    let rowData = {
                        id: element.id,
                        name: element.name,
                        price__c: element.price__c,
                        mrp__c: element.mrp__c,
                     //   brand__c: element.brand__c,
                        sfid: element.sfid,
                        image_url__c: img,
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

