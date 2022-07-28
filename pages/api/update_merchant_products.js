import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function updateUserProfile(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return updateUserProfile();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function updateUserProfile() {
        const { user_sfid, category, sub_category } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(500).send({ message: "Id is mandatory" })
        try {
            const cust_id = Number(id);
            const updateUser = await prisma.account.update({
                where: {
                    id: cust_id
                },
                data: {
                    first_name__c: first_name,
                    last_name__c: last_name,
                    email__c: email,
                    phone: phone,
                },

            });
            if (updateUser) {
                return res.status(200).json({ message: "Profile updated successfully" })
            } else {
                return res.status(500).json({ message: "Updated not successfull" })
            }
        } catch (error) {
            res.status(500).send({ message: error.message ? error.message : error })
        }
    }
}

