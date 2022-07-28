import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { sendEmail } from "./eduvanz_api"
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function addLender(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return addLender();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function addLender() {
        const { first_name, last_name, user_sfid, email, mobile, role_id, permissions } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "id is mandatory" })
        if (last_name == "" || last_name == undefined)
            return res.status(200).send({ status:"error",message: "Last Name is mandatory" })
        if (first_name == "" || first_name == undefined)
            return res.status(200).send({ status:"error",message: "First Name is mandatory" })
        if (email == "" || email == undefined)
            return res.status(200).send({ status:"error",message: "Email id is mandatory" })
        if (mobile == "" || mobile == undefined)
            return res.status(200).send({ status:"error",message: "Mobile number is mandatory" })
        if (role_id == "" || role_id == undefined)
            return res.status(200).send({ status:"error",message: "Role id is mandatory" })
        if (permissions == "" || permissions == undefined)
            return res.status(200).send({ status:"error",message: "Permissions is mandatory" })
        try {
            
            if(Array.isArray(permissions))
            {
                const userSfid = String(user_sfid);
                const accountDet = await prisma.account.findFirst({
                    where: {
                        sfid: userSfid
                    }
                });
                const recordDet = await prisma.recordtype.findFirst({
                    where: {
                        name: "Lender",
                    },
                });
                const sfId = recordDet.sfid;
                let RecordId = (accountDet && accountDet.recordtypeid !=undefined && accountDet.recordtypeid !=null)?accountDet.recordtypeid.toString():null;
                if (accountDet && sfId == RecordId)
                {
                    const pass = await generateRandomPass(8);
                    const createUser = await prisma.account.create({
                            data: {
                                phone: String(mobile),
                                email__c: String(email),
                                first_name__c: first_name,
                                firstname: first_name,
                                last_name__c: last_name,
                                lastname: last_name,
                                temp_password__c: String(pass),
                                accountsource: 'Unregistered User',
                                lender_id__c: accountDet.lender_id__c?accountDet.lender_id__c:accountDet.sfid,
                                createdbyid: accountDet.sfid,
                                recordtypeid: recordDet.sfid
                            },
                        });
                        if(createUser) {
                            const obj = {
                                email: email,
                                message: `Your eduvanz account password is ${pass}`,
                                subject: 'Notification'
                            }
                            await sendEmail(obj);
                            await  prisma.lender_role__c.create({
                                data: {
                                    role__c: Number(role_id),
                                    account__c: String(createUser.id),
                                },
                            });
                            await Promise.all(permissions.map(async element => {
                                await prisma.lender_permissions__c.create({
                                    data: {
                                        permission__c: String(element),
                                        account__c: String(createUser.id)
                                    }
                                });
                            }));
                        }
                    return res.status(200).json({ status:"success", message: "User created successfully" })
                }else{
                    return res.status(200).json({ status:"error",message: "You are not autorized to create user!." })
                }
            }else{
                return res.status(200).json({ status:"error",message: "Not a valid permission array" })
            }
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

function generateRandomPass(length) {
    return new Promise((resolve, reject) => {
        try {
            let result = '';
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