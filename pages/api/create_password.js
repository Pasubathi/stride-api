
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { apiHandler } from '../../helpers/api';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function createPassword(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return createPassword();
        default:
            return res.status(500).send({ responseCode: 500, message: `Method ${req.method} Not Allowed` })
    }
    async function createPassword() {
        try {
            const { newPassword, confirmPassword, id } = req.body;
            if (confirmPassword == "" || confirmPassword == undefined )
                return res.status(500).send({ responseCode: 500, message: "Confirm password is mandatory" })
            if (newPassword == "" || newPassword == undefined)
                return res.status(500).send({ responseCode: 500, message: "New password is mandatory" })
            if (id == "" || id == undefined)
                return res.status(500).send({ responseCode: 500, message: "Account id is mandatory" })
            const cust_id = Number(id)
            if(newPassword == confirmPassword)
            {
                const accountDet = await prisma.account.findFirst({
                    where: {
                        id: cust_id,
                    }
                });
                if(accountDet)
                {
                   const updatepan = await prisma.account.update({
                        where: {
                            id: cust_id
                        },
                        data: {
                            temp_password__c: confirmPassword
                        }
                    });
                    if (updatepan) {
                        return res.status(200).json({ responseCode: 200, message: "new password is Updated successfully" })
                    } else {
                        return res.status(500).json({ responseCode: 500, message: "Detail is not updated" })
                    }
                }else{
                    return res.status(500).json({ responseCode: 500, message: "Account not found" });
                }
            }else{
                return res.status(500).json({ responseCode: 500, message: "Password mismatch" })
            }

        } catch (error) {
            res.status(500).send({ responseCode: 500, message: error.message ? error.message : error })
        }
    }
}

