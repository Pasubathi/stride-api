
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { ckycDetails, ckycDetailsDownload } from "./mulesoft_api";
import { prisma } from "./_base";
import moment from 'moment';
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function checkCkycDetails(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return checkCkycDetails();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }

    async function checkCkycDetails() {
        const { id } = req.body
        if (id == "" || id == undefined)
        return res.status(200).send({ status:"error",message: "Id is mandatory" })
        try {
            let cust_id = Number(id)
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id,
                }
            });
            if(accountDet)
            {
                
                const dob = formatDate(accountDet.date_of_birth_applicant__c)
                let data = {
                    pan: accountDet.pan_number__c,
                    dob: dob,
                }
                const getData = await ckycDetails(data);
                if(getData.status ==="success" && getData.data)
                {
                    let objData = {
                        ckyc_id: getData.data,
                        dob: dob
                    }
                    const getObjData = await ckycDetailsDownload(objData);
                    return res.status(200).send(getObjData);
                }else{
                    return res.status(200).send(getData)
                }
               
            } else {
                return res.status(200).json({ status:"error",message: "Account is not found" });
            }
        } catch (error) {
            return res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

function formatDate(DateFormat) {
    return moment.utc(DateFormat).format('YYYY-MM-DD')
}