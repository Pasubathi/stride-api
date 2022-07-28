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
export default async function onemoneyUpdate(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return onemoneyUpdate();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function onemoneyUpdate() {
        const { id } = req.body;
        if (id == "" || id == undefined)
            return res.status(200).send({ status:"error", message: "id is mandatory" })
        try {
            const cust_id = Number(id);
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: cust_id
                }
            });
            if(accountDet)
            {
                let data2 = {
                    "mobileNumber": accountDet.phone, // "9894204012",  
                    "productID": "06APRIL",
                    "accountID": " loan1122"
                }

                const getReqData2 = await getConsentsList(data2);
                let consent_id = '';
                if(getReqData2 && getReqData2.status == "success")
                {
                    const consentData = getReqData2.data;
                    await Promise.all(consentData.map(async element => {
                        if(element.consentID && !consent_id)
                        {
                            console.log("consentID", element.consentID);
                            consent_id = element.consentID;
                        }
                    }));
                    
                    console.log("consent_id", consent_id);

                    let data1 = {
                        "consentID": consent_id
                    }
                    const getReqData1 = await getAlllTestFidata(data1);
                    if(getReqData1 && getReqData1.status == "success")
                    {
                        const resData = getReqData1;
                        let rand = Math.floor(100000 + Math.random() * 900000);
                        let randName = `${accountDet.sfid}-${rand}.json`;
                        var dir = 'tempFile';
                        var dataUrl = `./${dir}/${randName}`;
                        const getFile = await createFile(dir, randName, resData);
                        if(getFile && getFile.status == 'success')
                        {
                            return res.status(200).json(getFile)
                        }else{
                            return res.status(200).json(getFile)
                        }
                    }else{
                        return res.status(200).json({ status:"error", message: getReqData1 })
                    }
                }else{
                    return res.status(200).json({ status:"error", message: getReqData2 })
                }
                
            }else{
                return res.status(200).json({ status:"error", message: "Details not found" })
            }
            
        } catch (error) {
            return res.status(200).send({ status:"error", message: error.message ? error.message : error })
        }
    }
}

function createFile(dir, randName, resData) {
    return new Promise((resolve, reject) => {
        try {
            if(!fs.existsSync(dir))
            {
                fs.mkdirSync(dir);
            }
            fs.writeFile(`./${dir}/${randName}`, JSON.stringify(resData), function (err) {
                if (err)
                return res.status(200).json({ status:"error", message: err });
            });
            resolve({ status:"success",  message: "Success", data: `./${dir}/${randName}`});
        } catch (err) {
            reject({ status:"error",  message:err.message ? err.message : err});
        }
    })
}
