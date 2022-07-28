// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function registerHandler(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return doRegister();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function doRegister() {
        const { mobileNumber, username, email, role, owner, active_status } = req.body;
        if (mobileNumber == "" || mobileNumber == undefined)
            return res.status(500).send({ message: "Mobile Number is mandatory" })
        if (username == "" || username == undefined)
            return res.status(500).send({ message: "User Name is mandatory" })
        if (role == "" || role == undefined)
            return res.status(500).send({ message: "Role is mandatory" })
        if (email == "" || email == undefined)
            return res.status(500).send({ message: "Email is mandatory" })
        if (owner == "" || owner == undefined)
        return res.status(500).send({ message: "Owner is mandatory" })
        
        try {
            const user = await prisma.users.findUnique({
                where: {
                    mobileNumber: mobileNumber
                }
            });
            const emailUser = await prisma.users.findFirst({
                where: {
                    email: email
                }
            });
            if (!user) {
               if (!emailUser) {
                    try {
                        const createUser = await prisma.users.create({
                            data: {
                                mobileNumber: mobileNumber,
                                username: username,
                                role: role,
                                email: email,
                                owner: owner,
                                active_status: Number(active_status)
                            },
                        });
                        if (createUser) {
                            return res.status(200).json({
                                responseCode: 200,
                                message: "User Created Successfully",
                                id: createUser.userid,
                            })
                        }
                    } catch (e) {
                        res.status(500).send({ message: e.message ? e.message : e })
                    }
                } else {
                    return res.status(500).send({ message: "Email is present so please try with login" })
                }
            } else {
                return res.status(500).send({ message: "Mobile number is present so please try with login" })
            }
        } catch (error) {
            res.status(500).send({ message: error.message ? error.message : error })
        }
    }
}

