
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function changePassword(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return changePassword();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function changePassword() {
        try {
            const { newPassword, existingPassword, user_sfid } = req.body;
            if (existingPassword == "" || existingPassword == undefined /* || pan_number.length != 11 */)
                return res.status(400).send({ responseCode: 400, message: "Existing password is mandatory" })
            if (newPassword == "" || newPassword == undefined)
                return res.status(400).send({ responseCode: 400, message: "New password is mandatory" })
            if (user_sfid == "" || user_sfid == undefined)
                return res.status(400).send({ responseCode: 400, message: "User sfid is mandatory" })
            const cust_id = String(user_sfid);
            const accountDet = await prisma.account.findFirst({
                where: {
                    sfid: cust_id
                }
            });
            if(accountDet)
            {
                if (accountDet.temp_password__c === existingPassword) {
                    await prisma.account.update({
                        where: {
                            sfid: cust_id
                        },
                        data: {
                            temp_password__c: newPassword
                        }
                    });
                    return res.status(200).json({ responseCode: 200, message: "Password updated successfully" })
                }else {
                    return res.status(400).json({ responseCode: 400, message: "Invalid current password" })
                }
                
            }else {
                return res.status(400).json({ responseCode: 400, message: "Detail is not updated" })
            }


        } catch (error) {
            res.status(400).send({ responseCode: 400, message: error.message ? error.message : error })
        }
    }
}

