// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function addRole(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return createRole();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function createRole() {
        const { role_name, owner_id, createdby_id, dashboard_create,
            dashboard_read,
            dashboard_update,
            leads_create,
            leads_read,
            leads_update,
            settlements_create,
            settlements_read,
            settlements_update,
            products_read,
            products_create,
            products_update,
            settings_read,
            settings_create,
            settings_update, } = req.body;
        if (role_name == "" || role_name == undefined)
            return res.status(500).send({ message: "Role name is mandatory" })
        if (owner_id == "" || owner_id == undefined)
            return res.status(500).send({ message: "Owner id is mandatory" })
       
        
        try {
            const rdata = await prisma.role_access__c.findFirst({
                where: {
                    role_name__c: role_name,
                    owner_id: owner_id
                }
            });
           
               if (!rdata) {
                    try {
                        const createRole = await prisma.role_access__c.create({
                            data: {
                                role_name__c: role_name,
                                owner_id: owner_id,
                                created_id: createdby_id
                            },
                        });
                        if (createRole) {
                            let role_id = Number(createRole.id);
                            let fetchData = await prisma.role_module__c.findMany({
                                orderBy: {
                                  id: 'asc',
                                },
                            });
                            await Promise.all(fetchData.map(async element => {
                                let module_name = element.name__c;
                                if(module_name === "Dashboard")
                                {
                                    const createDashboardAccess = await prisma.module_access__C.create({
                                        data: {
                                            module__id: element.id,
                                            owner__id: owner_id,
                                            createdby_id: createdby_id,
                                            create__c: Number(dashboard_create),
                                            read__c: Number(dashboard_read),
                                            update__c: Number(dashboard_update),
                                            role__id: role_id,
                                        },
                                    });
                                }
                              
                                if(module_name === "Leads")
                                {
                                    const createLeadsAccess = await prisma.module_access__C.create({
                                        data: {
                                            module__id: element.id,
                                            owner__id: owner_id,
                                            createdby_id: createdby_id,
                                            create__c: Number(leads_create),
                                            read__c: Number(leads_read),
                                            update__c: Number(leads_update),
                                            role__id: role_id,
                                        },
                                    });
                                }
                                if(module_name === "Settlements")
                                {
                                    const createSettlementsAccess = await prisma.module_access__C.create({
                                        data: {
                                            module__id: element.id,
                                            owner__id: owner_id,
                                            createdby_id: createdby_id,
                                            create__c: Number(settlements_create),
                                            read__c: Number(settlements_read),
                                            update__c: Number(settlements_update),
                                            role__id: role_id,
                                        },
                                    });
                                }

                                if(module_name === "Products")
                                {
                                    const createProductsAccess = await prisma.module_access__C.create({
                                        data: {
                                            module__id: element.id,
                                            owner__id: owner_id,
                                            createdby_id: createdby_id,
                                            create__c: Number(products_create),
                                            read__c: Number(products_read),
                                            update__c: Number(products_update),
                                            role__id: role_id,
                                        },
                                    });
                                }

                                if(module_name === "Settings")
                                {
                                    const createSettingsAccess = await prisma.module_access__C.create({
                                        data: {
                                            module__id: element.id,
                                            owner__id: owner_id,
                                            createdby_id: createdby_id,
                                            create__c: Number(settings_create),
                                            read__c: Number(settings_read),
                                            update__c: Number(settings_update),
                                            role__id: role_id,
                                        },
                                    });
                                }
                            }));
                            return res.status(200).json({
                                responseCode: 200,
                                message: "Role Created Successfully",
                                id: createRole.id,
                            })
                        }
                    } catch (e) {
                        res.status(500).send({ message: e.message ? e.message : e })
                    }
                } else {
                    return res.status(500).send({ message: "Role already exists" })
                }
           
        } catch (error) {
            res.status(500).send({ message: error.message ? error.message : error })
        }
    }
}

