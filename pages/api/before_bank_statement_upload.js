// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { statementDownload } from "./statement_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function bankStatementRecord(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return bankStatementRecord();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function bankStatementRecord() {
        const { user_id, doc_id } = req.body;
        if (user_id == "" || user_id == undefined)
            return res.status(500).send({ message: "ID is mandatory" })
        if (doc_id == "" || doc_id == undefined)
            return res.status(500).send({ message: "Document id is mandatory" })

        try {
                let cust_id = Number(user_id);
                const accountDet = await prisma.account.findFirst({
                    where: {
                        id: cust_id
                    }
                });
               if (accountDet) {
                   const sfid = accountDet.sfid;
                   let obj = {
                       cust_id: cust_id,
                       sfid: sfid,
                       doc_id: doc_id
                   }
                   const getData = await statementDownload(obj);
                   console.log("download Data ======>>>>>>", getData);
                  if(getData && (getData.status && getData.status ==="success") ||  (getData.message && getData.message ==="Invalid document."))
                   {
                       const fileStatus = getData && getData.status ==="success"?true:false;
                       return res.status(200).send({status: "success", message: getData.message, isvalid: fileStatus})
                   }else{
                        return res.status(200).send({status: "pending", message: getData.message, isvalid: false})
                   }
                } else {
                    return res.status(500).send({ message: "Account doesnot exists" })
                }
           
            } catch (error) {
                res.status(500).send({ message: error.message ? error.message : error })
            }
    }
}

