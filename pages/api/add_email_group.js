import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function addEmailGroup(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return addEmailGroup();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function addEmailGroup() {
        const { title, email, user_sfid} = req.body;
        if (title == "" || title == undefined)
            return res.status(200).send({ status:"error",message: "Group name cannot be empty" })
        if (email == "" || email == undefined)
            return res.status(200).send({ status:"error",message: "Email cannot be empty" })
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(200).send({ status:"error",message: "Id cannot be empty" })
       
        try {
                    const groupId = await prisma.email_group_title.create({
                        data: {
                            title: title,
                            created_by: user_sfid
                        }
                    });
                    if(groupId)
                    {
                        if(Array.isArray(email))
                        {
                            await Promise.all(email.map(async element => {
                                await prisma.lender_group_map.create({
                                    data: {
                                        group_id: groupId.id,
                                        recipient_id: Number(element),
                                        lender_sfid: user_sfid
                                    }
                                });
                            }));
                            return res.status(200).json({ status:"success", message:"Group created successfully"});
                        }else{
                            return res.status(200).json({ status:"error",message: "Not a valid email array" })
                        }
                    }
                    else {
                        return res.status(200).json({ status:"error",message: "Group not created" })
                    }
            
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

