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
export default async function bankStatementAfterUpload(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return bankStatementAfterUpload();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function bankStatementAfterUpload() {
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
                    const getDownData = await checkSfid(obj);
                    return res.status(200).send({  status:"success", "message":"Success", data: getDownData });
                } else {
                    return res.status(500).send({ message: "Account doesnot exists" })
                }
           
            } catch (error) {
                res.status(500).send({ message: error.message ? error.message : error })
            }
    }
}


async function checkSfid(getData)
{
    return new Promise(async (resolve, reject) => {
        try {
            let i =  0;
            let startcount = true;
            let callCount = 0;
            const intervalId =  setInterval(async function() {
                i = i+1;
                console.log("i------->", i);
                if(i ==10)
                {
                    callCount = callCount+1;
                    startcount = false;
                    const getObj = await updateSfid(getData);
                    console.log("getData =====>", getObj);
                    if(getObj.status)
                    {
                        i =  0;
                        clearInterval(intervalId);
                        resolve(getObj);
                    }else{
                        if(callCount < 20)
                        {
                            i = 0;
                        }else{
                            clearInterval(intervalId);
                            resolve(getObj);
                        }
                    }
                }

            }, 1000);
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

async function updateSfid(obj)
{
    return new Promise(async (resolve, reject) => {
        try {
            const getData = await statementDownload(obj);
            console.log("download Data ======>>>>>>", getData);
           if(getData && (getData.status && getData.status ==="success") ||  (getData.message && getData.message ==="Invalid document."))
            {
                const fileStatus = getData && getData.status ==="success"?true:false;
                resolve({status: true, message: getData.message, isvalid: fileStatus})
            }else{
                resolve({status: false, message: getData.message, isvalid: false})
            }
        } catch (err) {
            reject(err.message ? err.message : err)
        }
    })
}

