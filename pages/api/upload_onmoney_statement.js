import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { getAlllTestFidata, getConsentsList, statementUpload, herokrUpload } from "./onemoney_api";
import fs from 'fs';
import { statementDownload } from "./statement_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function uploadOnemoneyStatement(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return uploadOnemoneyStatement();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function uploadOnemoneyStatement() {
        const { id, statement } = req.body;
        if (id == "" || id == undefined)
            return res.status(200).send({ status:"error", message: "id is mandatory" })
        if (statement == "" || statement == undefined)
            return res.status(200).send({ status:"error", message: "Statement is mandatory" })
        try {
            const cust_id = Number(id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id
                }
            });
            if(accountDet)
            {
                const getFile = await readFileData(statement);
                if(getFile && getFile.status == "success")
                {
                    const d = new Date()
                    const time = d.getTime()
                    let obj = {
                        parent_id: accountDet.sfid,
                        fname: "eduvan-"+time+'.json',
                        base64: getFile.baseData,
                        doctype: 'Bank Statement'
                    }
                     console.log("herokuData obj", obj);
                     const herokuData = await herokrUpload(obj);
                     console.log("herokuData", herokuData);
                     if(herokuData && herokuData.status !== undefined && herokuData.status === "Success")
                     {
                        await prisma.account_attachment.create({
                            data: {
                                cust_id: accountDet.id,
                                document_id: herokuData.DocumentId,
                                document_type: "Bank-Statement",
                                doc__type: "application/json"
                            },
                        });
                     }
                     const statemetData =  await statementUpload(getFile.bufData, statement);
                     console.log("statemetData", statemetData);
                     if(statemetData && statemetData.message && statemetData.message == 'success')
                     {
                        await prisma.api_logger__c.create({
                            data: {
                                response__c: JSON.stringify(statemetData.data),
                                service__c: "BANK STATEMENT UPLOAD",
                                account__c: accountDet.sfid
                            },
                        });
                        return res.status(200).json(statemetData )
                     }else{
                        await prisma.custom_error__c.create({
                            data: {
                                exception_message__c: JSON.stringify(statemetData),
                                account__c: accountDet.sfid,
                                service__c: "BANK STATEMENT UPLOAD",
                            },
                          });
                         return res.status(200).json(statemetData )
                     }
                }else{
                    return res.status(200).json(getFile)
                }
                       
            }else{
                return res.status(200).json({ status:"error", message: "Details not found" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

function readFileData(dataUrl) {
    return new Promise((resolve, reject) => {
        try {
            if(!fs.existsSync(dataUrl))
            {
                reject({ status:"error",  message: "File not found"});
            }else{
                fs.readFile(dataUrl, async function read(err, data) {
                    if (err) {
                        reject({ status:"error", message: err });
                    }
                    var content = data;
                    console.log("content", content);
                    if(content)
                    {
                        let base64 = content.toString('base64');
                        resolve({ status:"success",  baseData: base64, bufData: content});
                    }else{
                        reject({ status:"error",  data: data});
                    }
                });
            }
        } catch (err) {
            reject({ status:"error",  message:err.message ? err.message : err});
        }
    })
}