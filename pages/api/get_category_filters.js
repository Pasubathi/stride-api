import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getCategoryFilters(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getCategoryFilters();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function getCategoryFilters() {
        const { category } = req.body;
        if (category == "" || category == undefined)
            return res.status(200).send({ status:"error",message: "Category is mandatory" })
       
        try {
                const catName = String(category);
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
                    let branCon =  {
                        product2: {
                            product_category_lu__c: {
                                contains: catDet.sfid,
                            },
                        },
                    }
                    let colorCon = {
                        product_category_lu__c: catDet.sfid,
                        color__c: {
                            notIn: ['']
                        }
                    }
                    let processCon = {
                        product_category_lu__c: catDet.sfid,
                        processor__c: {
                            notIn: ['']
                        }
                    }
                    let ramCon = {
                        product_category_lu__c: catDet.sfid,
                        ram__c: {
                            notIn: ['']
                        }
                    }
                    let sizeCon = {
                        product_category_lu__c: catDet.sfid,
                        screen_size__c: {
                            notIn: ['']
                        }
                    }
                    const brandDet = await getCategoryBrand(branCon);
                    const colorDet = await getCategoryColor(colorCon);
                    const ramDet = await getCategoryRam(ramCon);
                    const processorDet = await getCategoryProcessor(processCon);
                    const sizeDet = await getCategorySize(sizeCon);
                    let objData = ["brand", "color", "ram", "processor", "size"];
                    let obj = {
                        brand: brandDet,
                        color: colorDet,
                        ram: ramDet,
                        processor: processorDet,
                        size: sizeDet,
                        filter_name: objData
                    }
                    return res.status(200).json({ status: "success", message: "Success", data: obj})
                }else if(subCatDet)
                {
                        let branCon = {
                            product2: {
                                product_subcategory__c: {
                                  contains: subCatDet.sfid,
                                },
                            },
                        }
                        let colorCon = {
                            product_subcategory__c: subCatDet.sfid,
                            color__c: {
                                notIn: ['']
                            }
                        }
                        let processCon = {
                            product_subcategory__c: subCatDet.sfid,
                            processor__c: {
                                notIn: ['']
                            }
                        } 
                        let ramCon = {
                            product_subcategory__c: subCatDet.sfid,
                            ram__c: {
                                notIn: ['']
                            }
                        }
                        let sizeCon = {
                            product_subcategory__c: subCatDet.sfid,
                            screen_size__c: {
                                notIn: ['']
                            }
                        }
                        const brandDet = await getCategoryBrand(branCon);
                        const colorDet = await getCategoryColor(colorCon);
                        const processorDet = await getCategoryProcessor(processCon);
                        const ramDet = await getCategoryRam(ramCon);
                        const sizeDet = await getCategorySize(sizeCon);
                        let objData = ["brand", "color", "ram", "processor", "size"];
                        let obj = {
                            brand: brandDet,
                            color: colorDet,
                            ram: ramDet,
                            processor: processorDet,
                            size: sizeDet,
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

async function getCategoryColor(getCon) {
    return new Promise(async (resolve, reject) => {
        try {
            const colorDet = await prisma.product2.groupBy({
                by: ['color__c'],
                where: getCon
            });
            resolve(colorDet)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function getCategoryProcessor(getCon) {
    return new Promise(async (resolve, reject) => {
        try {
            const processDet = await prisma.product2.groupBy({
                by: ['processor__c'],
                where: getCon
            });
            resolve(processDet)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function getCategoryRam(getCon) {
    return new Promise(async (resolve, reject) => {
        try {
            const ramDet = await prisma.product2.groupBy({
                by: ['ram__c'],
                where: getCon
            });
            resolve(ramDet)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function getCategorySize(getCon) {
    return new Promise(async (resolve, reject) => {
        try {
            const sizeDet = await prisma.product2.groupBy({
                by: ['screen_size__c'],
                where: getCon
            });
            resolve(sizeDet)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}