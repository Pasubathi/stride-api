// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { statementDownloadBeforeLimitS } from "./statement_api";
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
        const { user_sfid, doc_id } = req.body;
        if (user_sfid == "" || user_sfid == undefined)
            return res.status(500).send({ message: "User sfid is mandatory" })
        if (doc_id == "" || doc_id == undefined)
            return res.status(500).send({ message: "Document id is mandatory" })

        try {
                const cust_id = String(user_sfid);
                const accountDet = await prisma.account.findFirst({
                    where: {
                        sfid: cust_id
                    }
                });
               if (accountDet) {
                   const sfid = accountDet.sfid;
                   let obj = {
                       cust_id: cust_id,
                       sfid: accountDet.sfid,
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
                const getData = await statementDownloadBeforeLimitS(obj);
                console.log("download Data ======>>>>>>", getData);
            if(getData && getData.status && getData.status ==="success")
                {
                  //  resolve({status: true, message: getData.message, isvalid: true, limit: "100000"})
                    resolve({status: true, message: getData.message, isvalid: true})
                }if(getData && getData.message && getData.message ==="Invalid document.")
                {
                    resolve({status: true, message: getData.message, isvalid: false})
                }else{
                        resolve({status: false, message: getData.message, isvalid: false})
                }
            } catch (err) {
                reject(err.message ? err.message : err)
            }
    })
}

