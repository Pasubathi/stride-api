import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { checkBankAccount } from "./eduvanz_api";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function checkBAccount(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return checkBAccount();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function checkBAccount() {
        const { account_number, ifsc_code } = req.body;
       
        if (account_number == "" || account_number == undefined)
            return res.status(200).send({ status:"error",message: "Account Number is mandatory" })
        if (ifsc_code == "" || ifsc_code == undefined)
            return res.status(200).send({ status:"error",message: "Ifsc Code is mandatory" })
       
        try {
            let subData = {
                account_number: String(account_number),
                ifsc: String(ifsc_code)
            }
            const searchResult = await checkBankAccount(subData);
            console.log("searchResult", searchResult);
            if(searchResult && searchResult.result)
            {
                const result = searchResult.result?searchResult.result:null;
                if(result && result.bankTxnStatus)
                {
                    return res.status(200).json({ status:"success", message: "success", data:searchResult.result });
                }else{
                    return res.status(200).json({ status:"error", message:searchResult });
                }
            }else{
                return res.status(200).json({ status:"error", message:searchResult });
            }
            
        } catch (error) {
            res.status(200).send({ status:"error",message: error.message ? error.message : error })
        }
    }
}

