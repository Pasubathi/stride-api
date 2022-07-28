
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function createProduct(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return createProduct();
        default:
            return res.status(500).send({ responseCode: 500, message: `Method ${req.method} Not Allowed` })
    }
    async function createProduct() {
        try {
            const { products, merchant_id } = req.body;
           
            if (merchant_id == "" || merchant_id == undefined )
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Id is mandatory" })
           
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: merchant_id,
                }
            });
           
            if(accountDet)
            {
                const getProduct = await prisma.product2.findFirst({ orderBy: { id: 'desc' } });
                const externa_id = (getProduct.id+1).toString();
                if(Array.isArray(products))
                {
                    for(var i =0; i < products.length; i++)
                    {
                        if(i !==0)
                        {
                            const category  = products[i][0];
                            const sub_cat  = products[i][1];
                            const brand  = products[i][2];
                            const product_name = products[i][3];
                            const amount = Number(products[i][4]);
                            const sfid = await generateSfid(7);
                            const createAccount = await prisma.product2.create({
                                data: {
                                    name: product_name,
                                    product_category__c: category,
                                    product_sub_category__c: sub_cat,
                                    price__c: amount,
                                    mrp__c: amount,
                                 //   brand__c: brand,
                                    heroku_external_id__c: externa_id,
                                //   sfid: sfid,
                                },
                            });
                    
                
                            let obj = {
                                    amount: amount,
                                //    product_id: sfid,
                                    merchant_id: merchant_id,
                                    ext_id: externa_id
                            }
                            const productMerchant = await createMerchat(obj);
                            checkSfid(externa_id);
                        }
                    }
                }
                    return res.status(200).send({ responseCode: 200, status:"success",  message: "Product Created Successfully", product: createAccount, data: productMerchant})
                
            }else{
                return res.status(200).send({ responseCode: 200, status:"error",  message: "Details not found", })
            }
            
        } catch (error) {
            res.status(500).send({ responseCode: 500, message: error.message ? error.message : error })
        }
    }
}

async function createMerchat(getData)
{
    const { amount, product_id, merchant_id, ext_id } = getData
    return new Promise(async (resolve, reject) => {
        try {
            const merchatPro = await prisma.merchant_product__c.create({
                data:{
                    productid__c: product_id,
                    createdbyid: merchant_id,
                    accountid__c: merchant_id,
                    loan_amount__c: amount,
                    heroku_external_id__c: ext_id
                }
            });
            resolve(merchatPro);
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    });
}

async function checkMerchant(getData)
{
    const { amount, product_id, merchant_id } = getData
    return new Promise(async (resolve, reject) => {
        try {
            const checkMerProDet = await prisma.merchant_product__c.findFirst({
                where:{
                    productid__c: product_id,
                    accountid__c: merchant_id
                }
            });
            if(!checkMerProDet)
            {
                const merchatPro = await prisma.merchant_product__c.create({
                    data:{
                        productid__c: product_id,
                        createdbyid: merchant_id,
                        accountid__c: merchant_id,
                        loan_amount__c: amount
                    }
                });
                resolve(merchatPro);
            }else{
                resolve(checkMerProDet);
            }
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    });
}

function randstr(prefix)
{
    return Math.random().toString(36).replace('0.',prefix || '');
}

function generateSfid(length) {
    return new Promise((resolve, reject) => {
        try {
            let result = '01t71000000';
            const characters ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const charactersLength = characters.length;
            for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            resolve(result)
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function checkSfid(external_id)
{
    return new Promise(async (resolve, reject) => {
        try {
            let i =  0;
            let startcount = true;
            const intervalId =  setInterval(async function() {
                i = i+1;
               // console.log("i------->", i);
                if(i ==25)
                {
                    startcount = false;
                    const updateSfid1 = await updateSfid(external_id);
                  //  console.log("updateSfid =====>", updateSfid1);
                    if(updateSfid1)
                    {
                        i =  0;
                        clearInterval(intervalId);
                        resolve(true);
                    }else{
                        i = 0;
                    }
                }
            }, 1000);
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function updateSfid(external_id)
{
    return new Promise(async (resolve, reject) => {
        try {
            const getData = await prisma.product2.findFirst({ where: { heroku_external_id__c: external_id } });
           if(getData.sfid)
            {
                await prisma.merchant_product__c.update({
                    where:{
                        heroku_external_id__c: external_id
                    },
                    data:{
                        productid__c: getData.sfid
                    }
                });
                resolve(true)
            }else{
                resolve(false)
            }
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

