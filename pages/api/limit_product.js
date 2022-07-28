
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { LIMIT_PRODUCT } from "./api";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function limitProductResponse(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return limitProductResponse();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function limitProductResponse() {
        try {
            /*  const { id } = req.body;
             if (id == "" || id == undefined)
                 return res.status(200).send({ status: "error", message: "Account id is mandatory" })
              const accountDet = await prisma.account.findFirst({
                  where: {
                      id: id
                  }
              }); */
            let accountDet = true;
            if (accountDet) {
                /*  const addressDet = await prisma.address__c.findFirst({
                     where: {
                         account__c: accountDet.sfid
                     }
                 }); */
                let bankStatementAnalysisId = 2;
                let new_data = _generateRequestBody(bankStatementAnalysisId)
                console.log('new_datanew_datanew_datanew_data',typeof new_data)
                let data = {
                    "applicationin": {
                        "emi": 5000,
                        "typeofsurrogateprogram": "IMDBB SURROGATE PROGRAM",
                        "protectiontype": "NO PROTECTION",
                        "effectivereturnrate": 0,
                        "coursetype": "COURSE CAT B",
                        "loanappliedstudent": 100000,
                        "institutelocation": "MUMBAI",
                        "modeofteaching": "PART TIME",
                        "product": "ZZ",
                        "cibilsuccessful": "N",
                        "institutioncategory": "ZZ",
                        "vertical": "VOCATIONAL COURSES",
                        "loantenor": 0,
                        "coursefees": 100000,
                        "interesttratetype": "FIXED",
                        "institutename": "ARENA ANIMATION",
                        "noofcourses": 3,
                        "institutememberorrecognized": 2,
                        "droppedleads": 0,
                        "instituteoperatingyears": 1,
                        "instituteaccredited": 2,
                        "operationalyearsofinstitute": 2,
                        "corporatecourse": 0,
                        "residentialcampus": 2,
                        "coursetenor": 12,
                        "costoffunds": 0,
                        "derogfound": "",
                        "imdbfail": "",
                        "productselection": [
                            {
                                "product": "HYBRID LOANS",
                                "tenor": 9,
                                "discount": 9,
                                "emitype": "Advance",
                                "noofadvanceemi": 1,
                                "downpaymentamount": 0,
                                "rateofinterestfixed": 10,
                                "effectivereturnrate": 52.75252
                            },
                            {
                                "product": "HYBRID LOANS",
                                "tenor": 12,
                                "discount": 12,
                                "emitype": "Advance",
                                "noofadvanceemi": 1,
                                "downpaymentamount": 0,
                                "rateofinterestfixed": 10,
                                "effectivereturnrate": 52.79759
                            }
                        ],
                        "callsegmentation": 2,
                        "alias": "EDVNZ2"

                    },
                    "applicant": [
                        {
                            "applicantin": {
                                "applicantdetails": {
                                    "financialapplicant": "Y",
                                    "cashsalaried": "N",
                                    "dateofbirth": "19990901",
                                    "maritalstatus": "SINGLE",
                                    "gender": "FEMALE",
                                    "profession": "SALARIED",
                                    "constitution": "SALARIED",
                                    "cccid": "1182"
                                },
                                "addressdetails1":
                                {
                                    "residencetype": "ZZ",
                                    "pincode": 40001,
                                    "addresstype": "PERMANENT ADDRESS",
                                    "city": "ZZ"
                                }
                                ,
                                "addressdetails2":
                                {
                                    "residencetype": "ZZ",
                                    "pincode": 400001,
                                    "addresstype": "CURRENT ADDRESS",
                                    "city": "MUMBAI"
                                }
                                ,
                                "bankingdetails": [
                                    {
                                        "dateoflasttransaction": "20200430",
                                        "accountholdingtype": "SINGLE",
                                        "bankinmegativelist": "N",
                                        "salarycreditedinbankaccount": "Y",
                                        "accounttype": "SAVING",
                                        "statementfrom": "20200131",
                                        "statementto": "20200430",
                                        "avgtotalamountofecsnachissuedwoe": 0,
                                        "avgtotalamountofdebitinternaltransactionwoe": 0,
                                        "avgtotalamountofcreditinternaltransactionwoe": 0,
                                        "avgclosingbalancewoe": 275810.8275,
                                        "avgtotalnumberofcashdepositwoe": 0,
                                        "avgtotalnumberofcredittransactionswoe": 7,
                                        "avgtotalnumberofdebittransactionswoe": 13.75,
                                        "avgmaxbalancewoe": 276759.0775,
                                        "avgmaxeodbalancewoe": 275810.8275,
                                        "avgmedianeodbalancewoe": 68852.07,
                                        "avgopeningwoe": 184834.035,
                                        "avgtotalamontofemiloanpaymentwoe": 0,
                                        "avgtotalamountofcashwithdrawwoe": 2500,
                                        "avgtotalamountofcredittransactionswoe": 236558,
                                        "avgtotalamountofdebittransationswoe": 145581.2075,
                                        "avgbalancewoe": 80436.305416667,
                                        "avgnoofpenaltychargeswoe": 0,
                                        "avgtotalamountofcashdepositwoe": 0,
                                        "avgtotalnumberofcashwithdrawwoe": 0,
                                        "avgnoofemiloanpaymentswoe": 0,
                                        "avgtotalamountofcreditcardtransactionswoe": 0,
                                        "months": [
                                            {
                                                "totalnumberofdebittransactions": 21,
                                                "totalnumberofcredittransactions": 17,
                                                "minbalance": 0,
                                                "averagebankbalance": 208616.90833333,
                                                "averagemonthlybalance": 192622,
                                                "netsalary": 189407
                                            }
                                            ,
                                            {
                                                "totalnumberofdebittransactions": 21,
                                                "totalnumberofcredittransactions": 9,
                                                "minbalance": 0,
                                                "averagebankbalance": 60152.993333333,
                                                "averagemonthlybalance": 283600,
                                                "netsalary": 196793
                                            }
                                            ,
                                            {
                                                "totalnumberofdebittransactions": 13,
                                                "totalnumberofcredittransactions": 1,
                                                "minbalance": 0,
                                                "averagebankbalance": 52975.32,
                                                "averagemonthlybalance": 196792,
                                                "netsalary": 196792
                                            }
                                            ,
                                            {
                                                "totalnumberofdebittransactions": 0,
                                                "totalnumberofcredittransactions": 1,
                                                "minbalance": 0,
                                                "averagebankbalance": 0,
                                                "averagemonthlybalance": 273218,
                                                "netsalary": 273218
                                            }
                                        ]
                                    }
                                ],
                                "employmentdetails": {
                                    "companycategory": "ZZ",
                                    "employertype": "PRIVATE",
                                    "industrycategory": "CAT A INDUSTRY"
                                },
                                "bureau": {
                                    "enquirydetail": [
                                        {
                                            "dateofenquiry": "20211206",
                                            "enquirypurpose": "ZZ",
                                            "enqiuryamount": 0,
                                            "membername": "ZZ"
                                        }
                                    ],
                                    "bureauemploymentdetails": {
                                        "income": 1500000,
                                        "occupationcode": "0"
                                    },
                                    "bureauaddressdetail": [
                                        {
                                            "addresscategory": "0",
                                            "residencecode": "0",
                                            "addressline1": "ZZ",
                                            "addressline2": "ZZ",
                                            "addressline3": "ZZ",
                                            "addressline4": "ZZ",
                                            "addressline5": "ZZ",
                                            "statecode": "0",
                                            "pincode": "0"
                                        }
                                    ],
                                    "scoredetail": {
                                        "score": 785,
                                        "cibildate": "19000101"
                                    }
                                }
                            }
                        }
                    ]
                }

                var myHeaders = new Headers();
                myHeaders.append("Accept", "application/json");
                myHeaders.append("transaction_id", "ebf96f29-7174-45ad-9a51-a0f94324fe35");
                myHeaders.append("client_id", "918e4acddf60379f8ef62a1a07ee4a14d807ab7e");
                myHeaders.append("client_secret", "e448ec974f91c73a23cf1d672b8ba548b34ec182");
                myHeaders.append("channel_id", "MOB");
                myHeaders.append("x-correlation-id", "1c4ca504-6205-4780-86cd-3e7d6d00ffab");
                myHeaders.append("Content-Type", "application/json");

                const init = {
                    method: 'POST',
                    headers: myHeaders,
                    body: new_data//JSON.stringify(new_data)
                };
              //  console.log(myHeaders, 'LIMIT_PRODUCT', LIMIT_PRODUCT)
                const getdata = await fetch(LIMIT_PRODUCT, init).then((response) => response.json())
                    .then((response) => {
                        return response;
                    });

               // console.log("get Data ----------->", JSON.stringify(getdata))
                let objfinanciallimit = [];
                if (getdata.applicationout !== undefined) {
                    let applicationoutVal = getdata.applicationout;
                    let applicationoutArr = getdata.applicant ? getdata.applicant : [];
                    objfinanciallimit.push({
                        "application_status__c": applicationoutVal.applicationstatus ? String(applicationoutVal.applicationstatus): null,
                        "imdb_status__c": applicationoutVal.imdbstatus ? String(applicationoutVal.imdbstatus) : null,
                        "institute_score__c": applicationoutVal.institutescore ? Number(applicationoutVal.institutescore) : null,
                        "institute_score_category__c": applicationoutVal.institutescorecategory ? String(applicationoutVal.institutescorecategory) : null
                    })
                   
                    await Promise.all(applicationoutArr.map( async (el)=> {
                        let applicantoutVal = el.applicantout ? el.applicantout : {};
                        let salariedVal = applicantoutVal.salaried ? applicantoutVal.salaried : {};
                        let senpVal = applicantoutVal.senp ? applicantoutVal.senp : {};
                        let emiArr = applicantoutVal.emi ? applicantoutVal.emi : [];
                        objfinanciallimit.push({
                            "abb__c": applicantoutVal.abb ? String(applicantoutVal.abb) : null,
                            "banking_score__c": applicantoutVal.bankingscore ? Number(applicantoutVal.bankingscore) : null,
                            "banking_score_category__c": applicantoutVal.bankingscorecategory ? String(applicantoutVal.bankingscorecategory) : null,
                            "bureau_score__c": applicantoutVal.bureauscore ? applicantoutVal.bureauscore : null,
                            "derog_status__c": applicantoutVal.bureausurrogate && applicantoutVal.bureausurrogate.derogstatus ? String(applicantoutVal.bureausurrogate.derogstatus) : null,
                            // alary
                            "account_holding_type__c": salariedVal.accountholdingtype ? String(salariedVal.accountholdingtype) : null,
                            "bank_negative_list__c": salariedVal.banknegativelist ? String(salariedVal.banknegativelist) : null,
                            "salary__c": salariedVal.salary ? String(salariedVal.salary) : null,
                            "min_credit_debit_txns__c": salariedVal.mincreditdebittxns ? String(salariedVal.mincreditdebittxns) : null,
                            "date_of_last_transaction__c": salariedVal.dateoflasttransaction ? String(salariedVal.dateoflasttransaction) : null,
                            "bank_statement__c": salariedVal.bankstatement ? String(salariedVal.bankstatement) : null,
                            //senp
                            "senp_abb__c": senpVal.abb ? String(senpVal.abb) : null,
                            "average_monthly_balance__c": senpVal.averagemonthlybalance ? String(senpVal.averagemonthlybalance) : null,
                            "min_12_txn_in_last_3_months__c": senpVal.min12txninlast3months ? String(senpVal.min12txninlast3months) : null,
                            "account_type__c": senpVal.accounttype ? String(senpVal.accounttype) : null,
                            "min_balance__c": senpVal.minbalance ? String(senpVal.minbalance) : null,
                            "accountage__c": senpVal.accountage ? String(senpVal.accountage) : null,
                            "cccid__c": el.cccid ? String(el.cccid) : null,

                            "final_salary__c": applicantoutVal.finalsalary ? Number(applicantoutVal.finalsalary) : null,
                            "ipan_on_ipa__c": applicantoutVal.ipanonipa ? String(applicantoutVal.ipanonipa) : null,
                            "bligation__c": applicantoutVal.obligation ? Number(applicantoutVal.obligation): null,
                            "decimal_01__c": applicantoutVal.decimal01 ? String(applicantoutVal.decimal01) : null,
                        })
                        emiArr.forEach(function (elm) {
                            objfinanciallimit.push({
                                "base_rate_plus_risk_premium__c": elm.baserateplusriskpremium ? Number(elm.baserateplusriskpremium) : null,
                                "discount__c": elm.discount ? Number(elm.discount) : null,
                                "discount_rate__c": elm.discountrate ? Number(elm.discountrate) : null,
                                "down_payment_amount__c": elm.downpaymentamount ? Number(elm.downpaymentamount) : null,
                                "effective_return_rate__c": elm.effectivereturnrate ? Number(elm.effectivereturnrate) : null,
                                "emi__c": elm.emi ? Number(elm.emi) : null,
                                "emi_type__c": elm.emitype ? String(elm.emitype) : null,
                                "final_interest_rate__c": elm.finalinterestrate ? Number(elm.finalinterestrate) : null,
                                "loan_tenure__c": elm.loantenure ? Number(elm.loantenure) : null,
                                "no_of_advance_emi__c": elm.noofadvanceemi ? Number(elm.noofadvanceemi) : null,
                                "product__c": elm.product ? String(elm.product) : null,
                                "rate_of_interest_fixed__c": elm.rateofinterestfixed ? Number(elm.rateofinterestfixed) : null,
                                "tenure_premium__c": elm.tenurepremium ? Number(elm.tenurepremium) : null,
                            })
                        })
                    })
                    
                    );
                  
                    console.log("objfinanciallimit", objfinanciallimit);
                   
                    try {
                    const bureau_hardpull = await prisma.financial_limit_list__c.createMany({
                        data: objfinanciallimit
                    })
                }  catch (error) {
                    console.log("eroorr----->", error)

                }
                    return res.status(200).send({ status: "success", message: 'Success' });
                } else {
                 //   console.log(getdata)
                    return res.status(200).send({ status: "error", message: getdata.message ? getdata.message : getdata });
                }
            } else {
                return res.status(200).send({ status: "error", message: "Account not found" });
            }

        } catch (error) {
            console.log(error)
            return res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}


function _generateRequestBody(bankId) {


    let bankStatementAnalysisList = [];
    let requestJson = '';
    requestJson = '{';
    requestJson += '"applicationin":' + '{';
    requestJson += '"emi":5000' + ',';
    requestJson += '"typeofsurrogateprogram": "IMDBB SURROGATE PROGRAM"' + ',';
    requestJson += '"protectiontype": "NO PROTECTION"' + ',';
    requestJson += '"effectivereturnrate": 0' + ',';
    requestJson += '"coursetype": "COURSE CAT B"' + ',';
    requestJson += '"loanappliedstudent": 100000' + ',';
    requestJson += '"institutelocation": "MUMBAI"' + ',';
    requestJson += '"modeofteaching": "PART TIME"' + ',';
    requestJson += '"product": "ZZ"' + ',';
    requestJson += '"cibilsuccessful": "N"' + ',';
    requestJson += '"institutioncategory": "ZZ"' + ',';
    requestJson += '"vertical": "VOCATIONAL COURSES"' + ',';
    requestJson += '"loantenor": 0' + ',';
    requestJson += '"coursefees": 100000' + ',';
    requestJson += '"interesttratetype": "FIXED"' + ',';
    requestJson += '"institutename": "ARENA ANIMATION"' + ',';
    requestJson += '"noofcourses": 3' + ',';
    requestJson += '"institutememberorrecognized": 2' + ',';
    requestJson += '"droppedleads": 0' + ',';
    requestJson += '"instituteoperatingyears": 1' + ',';
    requestJson += '"instituteaccredited": 2' + ',';
    requestJson += '"operationalyearsofinstitute": 2' + ',';
    requestJson += '"corporatecourse": 0' + ',';
    requestJson += '"residentialcampus": 2' + ',';
    requestJson += '"coursetenor": 12' + ',';
    requestJson += '"costoffunds": 0' + ',';
    requestJson += '"derogfound": ""' + ',';
    requestJson += '"imdbfail": ""' + ',';

    requestJson += '"productselection":' + '[';


    requestJson += '{';
    requestJson += '"product": "HYBRID LOANS"' + ',';
    requestJson += '"tenor": 12' + ',';
    requestJson += '"discount": 12' + ',';
    requestJson += '"emitype": "Advance"' + ',';
    requestJson += '"noofadvanceemi": 1' + ',';
    requestJson += '"downpaymentamount": 0' + ',';
    requestJson += '"rateofinterestfixed": 10' + ',';
    requestJson += '"effectivereturnrate": 52.79759';
    requestJson += '}';
    requestJson += ']' + ',';

    requestJson += '"callsegmentation": 2' + ',';
    requestJson += '"alias": "EDVNZ2"';
    requestJson += '}' + ',';

    requestJson += '"applicant":' + '[';
    requestJson += '{';
    requestJson += '"applicantin":' + '{';

    requestJson += '"applicantdetails":' + '{';
    requestJson += '"financialapplicant": "Y"' + ',';
    requestJson += '"cashsalaried": "N"' + ',';
    requestJson += '"dateofbirth": "19990901"' + ',';
    requestJson += '"maritalstatus": "SINGLE"' + ',';
    requestJson += '"gender": "FEMALE"' + ',';
    requestJson += '"profession": "SALARIED"' + ',';
    requestJson += '"constitution": "SALARIED"' + ',';
    requestJson += '"cccid": "1182"';
    requestJson += '}' + ',';

    requestJson += '"addressdetails1":' + '{';
    requestJson += '"residencetype": "ZZ"' + ',';
    requestJson += '"pincode": 40001' + ',';
    requestJson += '"addresstype": "PERMANENT ADDRESS"' + ',';
    requestJson += '"city": "ZZ"';
    requestJson += '}' + ',';

    requestJson += '"addressdetails2":' + '{';
    requestJson += '"residencetype": "ZZ"' + ',';
    requestJson += '"pincode": 40001' + ',';
    requestJson += '"addresstype": "CURRENT ADDRESS"' + ',';
    requestJson += '"city": "MUMBAI"';
    requestJson += '}' + ',';


    // -> set values to 2 to 3 decimal places.
    // -> dateoflasttransaction, statementfrom, statementto -> convert timestamped values to readable date format as yyyymmdd.
    // -> Not working for -> Accept:application/json rather content-type:application/json
    // -> otherwise 500 internal server error.

    requestJson += '"bankingdetails":' + '[';
    requestJson += '{';

    if (bankStatementAnalysisList.length > 0 && bankStatementAnalysisList[0].Bank_Transactions__r != null && bankStatementAnalysisList[0].Bank_Transactions__r.length > 0) {
        //requestJson +=  '"dateoflasttransaction": "'+ApiUtility.Bre2Date( bankStatementAnalysisList[0].Bank_Transactions__r[0].transaction_Date__c )+'"'+',';   
        requestJson += '"dateoflasttransaction": "20200430"' + ',';
    }

    requestJson += '"accountholdingtype": "SINGLE"' + ',';
    requestJson += '"bankinmegativelist": "N"' + ',';

    if (bankStatementAnalysisList.length > 0 && bankStatementAnalysisList[0].Salary_Count__c > 0) {
        requestJson += '"salarycreditedinbankaccount": "Y"' + ',';
    } else {
        requestJson += '"salarycreditedinbankaccount": "N"' + ',';
    }

    if (bankStatementAnalysisList != null && bankStatementAnalysisList.length > 0) {
        requestJson += '"accounttype": "' + bankStatementAnalysisList[0].Account_Type__c + '"' + ',';
        requestJson += '"statementto": "' + ApiUtility.Bre2Date(bankStatementAnalysisList[0].Period_Start__c) + '"' + ',';     //20220101
        requestJson += '"statementfrom": "' + ApiUtility.Bre2Date(bankStatementAnalysisList[0].Period_End__c) + '"' + ',';     //20220131
        //requestJson +=  '"statementfrom": "20200131"'+',';
        //requestJson +=  '"statementto": "20200430"'+','; 
    }

    let avgTotalEcsNachAmount = 0.0;
    let sumTotalEcsNachAmount = 0.0;

    let avgtotalDebitInternalTransfer = 0.0;
    let sumtotalDebitInternalTransfer = 0.0;

    let avgtotalCreditInternalTransfer = 0.0;
    let sumtotalCreditInternalTransfer = 0.0;

    let avgNoOfCashDeposits = 0.0;
    let sumNoOfCashDeposits = 0.0;

    let avgNoOfCreditTransactions = 0.0;
    let sumNoOfCreditTransactions = 0.0;

    let avgNoOfDebitTransactions = 0.0;
    let sumNoOfDebitTransactions = 0.0;

    let avgMaximumBalance = 0.0;
    let sumMaximumBalance = 0.0;

    let avgMaximumEODBalance = 0.0;
    let sumMaximumEODBalance = 0.0;

    let avgMedianBalance = 0.0;
    let sumMedianBalance = 0.0;

    let avgTotalEMIAmount = 0.0;
    let sumTotalEMIAmount = 0.0;

    let avgCashWithdrawalsAmount = 0.0;
    let sumCashWithdrawalsAmount = 0.0;

    let avgCreditTransactionsAmount = 0.0;
    let sumCreditTransactionsAmount = 0.0;

    let avgDebitTransactionsAmount = 0.0;
    let sumDebitTransactionsAmount = 0.0;

    let avgNoOfPenalCharges = 0.0;
    let sumNoOfPenalCharges = 0.0;

    let avgCashDepositsAmount = 0.0;
    let sumCashDepositsAmount = 0.0;

    let avgNoOfCashWithdrawals = 0.0;
    let sumNoOfCashWithdrawals = 0.0;

    let avgNoOfEMI = 0.0;
    let sumNoOfEMI = 0.0;

    let count = 0;

    if (bankStatementAnalysisList.length > 0 && bankStatementAnalysisList[0].Analysis_Data__r != null && bankStatementAnalysisList[0].Analysis_Data__r.length > 0) {
        //for (Analysis_Data__c objAnalData : bankStatementAnalysisList[0].Analysis_Data__r ) {
        bankStatementAnalysisList[0].Analysis_Data__r.forEach(function (objAnalData) {

            sumTotalEcsNachAmount = sumTotalEcsNachAmount + objAnalData.Total_Ecs_Nach_Amount__c;
            sumtotalDebitInternalTransfer = sumtotalDebitInternalTransfer + objAnalData.Total_Debit_Internal_Transfer__c;
            sumtotalCreditInternalTransfer = sumtotalCreditInternalTransfer + objAnalData.Total_Credit_Internal_Transfer__c;
            sumNoOfCashDeposits = sumNoOfCashDeposits + objAnalData.No_Of_Cash_Deposits__c;
            sumNoOfCreditTransactions = sumNoOfCreditTransactions + objAnalData.No_Of_Credit_Transactions__c;
            sumNoOfDebitTransactions = sumNoOfDebitTransactions + objAnalData.No_Of_Debit_Transactions__c;
            sumMaximumBalance = sumMaximumBalance + objAnalData.Maximum_Balance__c;
            sumMaximumEODBalance = sumMaximumEODBalance + objAnalData.Maximum_EOD_Balance__c;
            sumMedianBalance = sumMedianBalance + objAnalData.Median_Balance__c;
            sumTotalEMIAmount = sumTotalEMIAmount + objAnalData.Total_EMI_Amount__c;
            sumCashWithdrawalsAmount = sumCashWithdrawalsAmount + objAnalData.Cash_Withdrawals_Amount__c;
            sumCreditTransactionsAmount = sumCreditTransactionsAmount + objAnalData.Credit_Transactions_Amount__c;
            sumDebitTransactionsAmount = sumDebitTransactionsAmount + objAnalData.Debit_Transactions_Amount__c;
            sumNoOfPenalCharges = sumNoOfPenalCharges + objAnalData.No_Of_Penal_Charges__c;
            sumCashDepositsAmount = sumCashDepositsAmount + objAnalData.Cash_Deposits_Amount__c;
            sumNoOfCashWithdrawals = sumNoOfCashWithdrawals + objAnalData.No_Of_Cash_Withdrawals__c;
            sumNoOfEMI = sumNoOfEMI + objAnalData.No_Of_EMI__c;
            count = count + 1;
        })
        avgTotalEcsNachAmount = sumTotalEcsNachAmount / count;
        avgtotalDebitInternalTransfer = sumtotalDebitInternalTransfer / count;
        avgtotalCreditInternalTransfer = sumtotalCreditInternalTransfer / count;
        avgNoOfCashDeposits = sumNoOfCashDeposits / count;
        avgNoOfCreditTransactions = sumNoOfCreditTransactions / count;
        avgNoOfDebitTransactions = sumNoOfDebitTransactions / count;
        avgMaximumBalance = sumMaximumBalance / count;
        avgMaximumEODBalance = sumMaximumEODBalance / count;
        avgMedianBalance = sumMedianBalance / count;
        avgTotalEMIAmount = sumTotalEMIAmount / count;
        avgCashWithdrawalsAmount = sumCashWithdrawalsAmount / count;
        avgCreditTransactionsAmount = sumCreditTransactionsAmount / count;
        avgDebitTransactionsAmount = sumDebitTransactionsAmount / count;
        avgNoOfPenalCharges = sumNoOfPenalCharges / count;
        avgCashDepositsAmount = sumCashDepositsAmount / count;
        avgNoOfCashWithdrawals = sumNoOfCashWithdrawals / count;
        avgNoOfEMI = sumNoOfEMI / count;
    }
    // console.log('avgTotalEcsNachAmount >>> ' +avgTotalEcsNachAmount );
    // console.log('avgtotalDebitInternalTransfer >>> ' +avgtotalDebitInternalTransfer );
    // console.log('avgtotalCreditInternalTransfer >>> ' +avgtotalCreditInternalTransfer );
    // console.log('avgNoOfCashDeposits >>> ' +avgNoOfCashDeposits );
    // console.log('avgNoOfCreditTransactions >>> ' +avgNoOfDebitTransactions );
    // console.log('avgNoOfDebitTransactions >>> ' +avgNoOfDebitTransactions );
    // console.log('avgMaximumBalance >>> ' +avgMaximumBalance );
    // console.log('avgMaximumEODBalance >>> ' +avgMaximumEODBalance );
    // console.log('avgMedianBalance >>> ' +avgMedianBalance );
    // console.log('avgTotalEMIAmount >>> ' +avgTotalEMIAmount );
    // console.log('avgCashWithdrawalsAmount >>> ' +avgCashWithdrawalsAmount );
    // console.log('avgCreditTransactionsAmount >>> ' +avgCreditTransactionsAmount );
    // console.log('avgDebitTransactionsAmount >>> ' +avgDebitTransactionsAmount );
    // console.log('avgCashDepositsAmount >>> ' +avgCashDepositsAmount );
    // console.log('avgNoOfCashWithdrawals >>> ' +avgNoOfCashWithdrawals );
    // console.log('avgNoOfEMI >>> ' +avgNoOfEMI );

    requestJson += '"avgtotalamountofecsnachissuedwoe": ' + avgTotalEcsNachAmount + ',';
    requestJson += '"avgtotalamountofdebitinternaltransactionwoe": ' + avgtotalDebitInternalTransfer + ',';
    requestJson += '"avgtotalamountofcreditinternaltransactionwoe": ' + avgtotalCreditInternalTransfer + ',';
    requestJson += '"avgclosingbalancewoe": 275810.8275' + ',';//-------------
    requestJson += '"avgtotalnumberofcashdepositwoe": ' + avgNoOfCashDeposits + ',';
    requestJson += '"avgtotalnumberofcredittransactionswoe": ' + avgNoOfDebitTransactions + ',';
    requestJson += '"avgtotalnumberofdebittransactionswoe": ' + avgNoOfDebitTransactions + ',';
    requestJson += '"avgmaxbalancewoe": ' + avgMaximumBalance + ',';
    requestJson += '"avgmaxeodbalancewoe": ' + avgMaximumEODBalance + ',';
    requestJson += '"avgmedianeodbalancewoe": ' + avgMedianBalance + ',';
    requestJson += '"avgopeningwoe": 184834.035' + ',';//-----------
    requestJson += '"avgtotalamontofemiloanpaymentwoe": ' + avgTotalEMIAmount + ',';
    requestJson += '"avgtotalamountofcashwithdrawwoe": ' + avgCashWithdrawalsAmount + ',';
    requestJson += '"avgtotalamountofcredittransactionswoe": ' + avgCreditTransactionsAmount + ',';
    requestJson += '"avgtotalamountofdebittransationswoe": ' + avgDebitTransactionsAmount + ',';

    if (bankStatementAnalysisList != null && bankStatementAnalysisList.length > 0) {

        let toround = bankStatementAnalysisList[0].Average_Balance__c;
        let rounded = toround.setScale(2);
        requestJson += '"avgbalancewoe": ' + rounded + ',';
        //requestJson +=  '"avgbalancewoe": '+bankStatementAnalysisList[0].Average_Balance__c+',';
    }

    requestJson += '"avgnoofpenaltychargeswoe": ' + avgNoOfPenalCharges + ',';
    requestJson += '"avgtotalamountofcashdepositwoe": ' + avgCashDepositsAmount + ',';
    requestJson += '"avgtotalnumberofcashwithdrawwoe": ' + avgNoOfCashWithdrawals + ',';
    requestJson += '"avgnoofemiloanpaymentswoe": ' + avgNoOfEMI + ',';
    requestJson += '"avgtotalamountofcreditcardtransactionswoe": 0' + ',';

    requestJson += '"months":' + '[';

    if (bankStatementAnalysisList.length > 0 && bankStatementAnalysisList[0].Analysis_Data__r != null && bankStatementAnalysisList[0].Analysis_Data__r.length > 0) {
        //for (Analysis_Data__c objAnaData : bankStatementAnalysisList[0].Analysis_Data__r ) {
        bankStatementAnalysisList[0].Analysis_Data__r.forEach(function (objAnaData) {

            requestJson += '{';
            requestJson += '"totalnumberofdebittransactions": ' + objAnaData.No_Of_Debit_Transactions__c + ',';
            requestJson += '"totalnumberofcredittransactions": ' + objAnaData.No_Of_Credit_Transactions__c + ',';
            requestJson += '"minbalance": ' + objAnaData.No_Of_Minimum_Balance_Charges__c + ',';
            requestJson += '"averagebankbalance": 208616.90' + ',';
            requestJson += '"averagemonthlybalance": 192622' + ',';
            requestJson += '"netsalary": ' + objAnaData.Salary_Amount__c + '';
            requestJson += '}' + ',';
        })
    }
    //requestJson = requestJson.removeEnd(',');
    requestJson = requestJson.replace(/,\s*$/, "");
    requestJson += ']';
    requestJson += '}';
    requestJson += ']' + ',';

    requestJson += '"employmentdetails":' + '{';
    requestJson += '"companycategory": "ZZ"' + ',';
    requestJson += '"employertype": "PRIVATE"' + ',';
    requestJson += '"industrycategory": "CAT A INDUSTRY"';
    requestJson += '}' + ',';

    requestJson += '"bureau":' + '{';
    requestJson += '"enquirydetail":' + '[';
    requestJson += '{';
    requestJson += '"dateofenquiry": "20211206"' + ',';
    requestJson += '"enquirypurpose": "ZZ"' + ',';
    requestJson += '"enqiuryamount": 0' + ',';
    requestJson += '"membername": "ZZ"';
    requestJson += '}';
    requestJson += ']' + ',';

    requestJson += '"bureauemploymentdetails":' + '{';
    requestJson += '"income": 1500000' + ',';
    requestJson += '"occupationcode": "0"';
    requestJson += '}' + ',';

    requestJson += '"bureauaddressdetail":' + '[';
    requestJson += '{';


    requestJson += '"addresscategory": "0"' + ',';
    requestJson += '"residencecode": "0"' + ',';
    requestJson += '"addressline1": "ZZ"' + ',';
    requestJson += '"addressline2": "ZZ"' + ',';
    requestJson += '"addressline3": "ZZ"' + ',';
    requestJson += '"addressline4": "ZZ"' + ',';
    requestJson += '"addressline5": "ZZ"' + ',';
    requestJson += '"statecode": "0"' + ',';
    requestJson += '"pincode": "0"';
    requestJson += '}';
    requestJson += ']' + ',';

    requestJson += '"scoredetail":' + '{';

    requestJson += '"score": 785' + ',';
    requestJson += '"cibildate": "19000101"';
    requestJson += '}';
    requestJson += '}';
    requestJson += '}';
    requestJson += '}';
    requestJson += ']';
    requestJson += '}';

    console.log('requestJson >>> ' + requestJson);
    return requestJson;
}
