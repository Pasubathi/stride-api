// Fake users data
import Cors from 'cors';
import { prisma } from "./_base";
import getConfig from 'next/config';
const { serverRuntimeConfig } = getConfig();
import initMiddleware from '../../lib/init-middleware'
import moment from 'moment';

const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function updateUserAddress(req, res) {
    await cors(req, res);
    try {
        switch (req.method) {
            case 'POST':
                return getUserAddress();
            default:
                return res.status(500).end(`Method ${req.method} Not Allowed`)
        }
        async function getUserAddress() {
            const { plan_id, user_sfid } = req.body;
           if (plan_id == "" || plan_id == undefined)
                return res.status(200).send({ status: "error", message: "Plan id is mandatory" })
            try {
                let id = Number(plan_id);
                const sfid = user_sfid?String(user_sfid):null;
                const planDet = await prisma.payment_plan__c.findFirst({
                    where: {
                        id: id
                    }
                });
                let accountDet;
                if(sfid)
                {
                    accountDet = await prisma.account.findFirst({
                        where: {
                            sfid: sfid
                        }
                    });
                }
                
                if(planDet)
                {
                    let planData = planDet;
                    planData.first_emi_date__c = await getDateFormate(planDet.first_emi_date__c);
                    planData.last_emi_date__c  = await getDateFormate(planDet.last_emi_date__c);
                    if(accountDet)
                    {
                        let obj = {
                            account_number__c : accountDet.bank_account_number__c
                        }
                        const bankDet = await prisma.bank_name_details__c.findFirst({
                            where: {
                                bank_code__c: accountDet.bank_name__c
                            }
                        });
                        if(bankDet)
                        {
                            obj.bank_icon = bankDet.bank_logo_url__c;
                        }
                        return res.status(200).json({ status: "success", message: "Success", data: planData, bank: obj })
                    }else{
                        return res.status(200).json({ status: "success", message: "Success", data: planData })
                    }
                }else{
                    return res.status(200).json({ status: "error", message: "Plan not found" })
                }

            } catch (e) {
                res.status(500).send({ responseCode:500,message: e.message ? e.message : e });
                return;
            }
        }
    } catch (error) {
        res.status(500).send({responseCode:500, message: error.message ? error.message : error })
    } 

}

async function getDateFormate(date)
{
    return new Promise(async (resolve, reject) => {
        try {
                let data = '';
                if(date)
                {
                    data = moment(date).format("D MMMM, YYYY"); // "12 August 2019"
                }
                resolve(data);
            } catch (err) {
                reject(err.message ? err.message : err)
            }
    })
}



