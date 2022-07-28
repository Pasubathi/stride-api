// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function getRole(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return getRoles();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function getRoles() {
        const { owner_id, role_id } = req.body;
        if (role_id == "" || role_id == undefined)
            return res.status(500).send({ message: "Role id is mandatory" })
        if (owner_id == "" || owner_id == undefined)
            return res.status(500).send({ message: "Owner id is mandatory" })
       let rol_id = Number(role_id);
        const ownId = String(owner_id);
        try {
            const rdata = await prisma.role_access__c.findFirst({
                where: {
                    id: rol_id,
                    owner_id: ownId
                }
            });
           
               if (rdata) {
                let proData = [];
                let dashboardAcc = [];
                let leadsAcc = [];
                let settlementsAcc = [];
                let productsAcc = [];
                let settingsAcc = [];
                let roleData = {
                    role_name: rdata.role_name__c,
                    role_id: rdata.id
                }
                
                proData=roleData;
               
                    try {
                    
                        let fetchData = await prisma.role_module__c.findMany({
                            orderBy: {
                                id: 'asc',
                            },
                        });
                            await Promise.all(fetchData.map(async element => {
                                let module_name = element.name__c;
                                if(module_name === "Dashboard")
                                {
                                    const createDashboardAccess = await prisma.module_access__C.findFirst({
                                        where: {
                                            role__id: rol_id,
                                            module__id: element.id,
                                            owner__id: ownId
                                        }
                                    });
                                  let  dashboardAccess = {
                                        dashboard_create:createDashboardAccess.create__c,
                                        dashboard_read:createDashboardAccess.read__c,
                                        dashboard_update:createDashboardAccess.update__c
                                    }
                                    dashboardAcc=dashboardAccess;
                                  
                                }
                                
                                if(module_name === "Leads")
                                {
                                    const createLeadsAccess = await prisma.module_access__C.findFirst({
                                        where: {
                                            role__id: rol_id,
                                            module__id: element.id,
                                            owner__id: ownId
                                        }
                                        
                                    });
                                    let leadsAccess = {
                                        leads_create: createLeadsAccess.create__c,
                                        leads_read: createLeadsAccess.read__c,
                                        leads_update: createLeadsAccess.update__c,
                                    }
                                    leadsAcc=leadsAccess;
                                  
                                }
                                
                                if(module_name === "Settlements")
                                {
                                    const createSettlementsAccess = await prisma.module_access__C.findFirst({
                                        where: {
                                            role__id: rol_id,
                                            module__id: element.id,
                                            owner__id: ownId
                                        }
                                       
                                    });
                                    let settlementsAccess = {
                                        settlements_create: createSettlementsAccess.create__c,
                                        settlements_read: createSettlementsAccess.read__c,
                                        settlements_update: createSettlementsAccess.update__c,
                                    }
                                    settlementsAcc=settlementsAccess;
                                   
                                }

                                if(module_name === "Products")
                                {
                                    const createProductsAccess = await prisma.module_access__C.findFirst({
                                        where: {
                                            role__id: rol_id,
                                            module__id: element.id,
                                            owner__id: ownId
                                        }
                                       
                                    });
                                    let productsAccess = {
                                        products_create:createProductsAccess.create__c,
                                        products_read:createProductsAccess.read__c,
                                        products_update:createProductsAccess.update__c
                                     }
                                     productsAcc=productsAccess;
                                  
                                }

                                if(module_name === "Settings")
                                {
                                    const createSettingsAccess = await prisma.module_access__C.findFirst({
                                        where: {
                                            role__id: rol_id,
                                            module__id: element.id,
                                            owner__id: ownId
                                        }
                                       
                                    });
                                    let settingsAccess = {
                                        settings_create:createSettingsAccess.create__c,
                                        settings_read:createSettingsAccess.read__c,
                                        settings_update:createSettingsAccess.update__c
                                    }
                                    settingsAcc = settingsAccess;
                                    
                                }
                            }));
                           
                            return res.status(200).json({
                                responseCode: 200,
                                message: "success",
                                data: {roleDetail: proData,dashboardAcc: dashboardAcc, leadsAcc: leadsAcc,  settlementsAcc: settlementsAcc, productsAcc: productsAcc,
                                    settingsAcc: settingsAcc},
                                      
                                })
                        
                    } catch (e) {
                        res.status(500).send({ message: e.message ? e.message : e })
                    }
                } else {
                    return res.status(500).send({ message: "Role doesnot exists" })
                }
           
        } catch (error) {
            res.status(500).send({ message: error.message ? error.message : error })
        }
    }
}

