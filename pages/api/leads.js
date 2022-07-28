
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function fetchLeadsData(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'GET':
            return fetchLeadsData();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function fetchLeadsData() {
        try {
            const query = req.query;
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const recordDet = await prisma.recordtype.findFirst({
                where: {
                    name: "Customer Account",
                },
            });
            let sfId = recordDet.sfid.toString();
            let fetchData = await prisma.account.findMany({
                skip: startIndex,
                take: limit,
                where: {
                  recordtypeid: sfId
                },
                orderBy: {
                  id: 'desc',
                }
            });
            if (fetchData) {
                let proData = [];
                await Promise.all(fetchData.map(async element => {
                    let rowDet = element;
                    const getProData = await prisma.account_products.findFirst({
                        where:{
                            cust_id: element.id
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    });
                    if(getProData && getProData.product_id)
                    {
                        const productDet = await prisma.product2.findFirst({
                            where:{
                                sfid: getProData.product_id
                            }
                        });
                        if(productDet)
                        {
                            rowDet.product_name = productDet.name;
                            rowDet.mrp__c = productDet.mrp__c;
                            rowDet.price__c = productDet.price__c;
                        }
                    }
                    proData.push(rowDet);
                }));
                return res.status(200).json(proData)
            } else {
                return res.status(400).json({ responseCode: 400, message: "Detail is not updated" })
            }
        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }

        /*  if (id == "" || id == undefined)
              return res.status(400).send({ responseCode: 400, message: "Account id is mandatory" })
          try {
              let updatepan = await prisma.account.update({
                  where: {
                      id: id
                  },
                  data: {
                      pan_number__c: pan_number
                  }
              });
              if (updatepan) {
                  return res.status(200).json({ responseCode: 200, message: "pan is Updated successfully" })
              } else {
                  return res.status(400).json({ responseCode: 400, message: "Detail is not updated" })
              }
  
  
          } catch (error) {
              res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
          } */
    }
}

