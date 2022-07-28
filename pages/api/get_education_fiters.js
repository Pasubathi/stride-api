import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getEducatioFilters(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getEducatioFilters();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function getEducatioFilters() {
        const { category } = req.body;
        if (category == "" || category == undefined)
            return res.status(200).send({ status:"error",message: "Category is mandatory" })
       
        try {
                const catName = String(category);
                const subCatDet = await prisma.product_subcategory__c.findFirst({
                    where: {
                        name: catName
                    }
                });
               if(subCatDet)
                {
                        let branCon = {
                            product2: {
                                product_subcategory__c: {
                                  contains: subCatDet.sfid,
                                },
                            },
                        }
                        let durationCon = {
                            product_subcategory__c: subCatDet.sfid,
                            course_duration__c: {
                                notIn: ['']
                            }
                        }
                        let courseTypeCon = {
                            product_subcategory__c: subCatDet.sfid,
                            course_type__c: {
                                notIn: ['']
                            }
                        } 
                        let ratingCon = {
                            product_subcategory__c: subCatDet.sfid
                        }
                        const brandDet = await getCategoryBrand(branCon);
                        const durationDet = await getDurations(durationCon);
                        const courseTypeDet = await getCourseType(courseTypeCon);
                       // const ratingDet = await getCourseRating(ratingCon);
                        let objData = ["brand", "duration", "course_type"];
                        let obj = {
                            brand: brandDet,
                            duration: durationDet,
                            course_type: courseTypeDet,
                       //     rating: ratingDet,
                            filter_name: objData
                        }
                        return res.status(200).json({ status: "success", message: "Success", data: obj})
                }else{
                    return res.status(200).json({ status: "error", message: "Category not found" })
                }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}


async function getCategoryBrand(getCon) {
    return new Promise(async (resolve, reject) => {
        try {
            const fetchData = await prisma.product_brand__c.findMany({
                select:{
                    name: true,
                    sfid: true,
                    id: true,
                },
                 where: getCon,
             });
            resolve(fetchData)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function getDurations(getCon) {
    return new Promise(async (resolve, reject) => {
        try {
            const colorDet = await prisma.product2.groupBy({
                by: ['course_duration__c'],
                where: getCon
            });
            resolve(colorDet)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function getCourseType(getCon) {
    return new Promise(async (resolve, reject) => {
        try {
            const processDet = await prisma.product2.groupBy({
                by: ['course_type__c'],
                where: getCon
            });
            resolve(processDet)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function getCourseRating(getCon) {
    return new Promise(async (resolve, reject) => {
        try {
            const ramDet = await prisma.product2.groupBy({
                by: ['product_rating__c'],
                where: getCon
            });
            resolve(ramDet)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}