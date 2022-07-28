
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import {  GET_DOCUMENT_BY_ID, SALES_FORCE } from "./api";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getHomeProducts(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getHomeProducts();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function getHomeProducts() {
        const { page, limit, user_sfid } = req.body;
        
        try {
            const userSfid = String(user_sfid);
          //  let category = ['Laptop', 'Mobile', 'Tablet', 'EV', 'Television', 'Test Preparation', 'School', 'University Courses', 'Upskilling'];
            let category = ['Laptop', 'Mobile', 'Tablet', 'EV', 'Television', 'School', 'Upskilling'];
            let getData = {};
            await Promise.all(category.map(async element => {
                console.log("category----------->", element);
                const catDet = await prisma.product_subcategory__c.findFirst({
                    where: {
                        name: element
                    }
                });
                console.log("category Details----------->", catDet);
                if(catDet)
                {
                    const getProData = await getCategoryProducts(catDet.sfid, userSfid);
                    getData[element] = getProData;
                }
            }));
            return res.status(200).json({ responseCode: 200, status: 'success', data: getData, category: category})
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

async function getCategoryProducts(sfid, user_sfid) {
    return new Promise(async (resolve, reject) => {
        try {
            let proData = [];
            let fetchData = await prisma.product2.findMany({
                where: {
                    product_subcategory__c : sfid
                },
                orderBy: {
                    id: 'desc'
                },
            });
            console.log("fetchData Details----------->", fetchData);
            await Promise.all(fetchData.map(async element => {
                let isFavorite = false;
                if(user_sfid)
                {
                    const favDet =  await prisma.favorite_products__c.findFirst({
                        where:{
                            account__id: user_sfid,
                            product__id: element.sfid,
                        }
                    });
                    if(favDet)
                    {
                        isFavorite = true
                    }
                }
                let rowData = {
                    id: element.id,
                    name: element.name,
                    price__c: element.price__c,
                    mrp__c: element.mrp__c,
                    sfid: element.sfid,
                    image_url__c: element.image_url__c
                }
                proData.push(rowData);
            }));
            resolve(proData)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

