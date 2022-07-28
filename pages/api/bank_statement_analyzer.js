// Fake users data
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
const cors = initMiddleware(
    Cors({
      methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function bankStatementRecord(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return bankStatementAnalyze();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
    async function bankStatementAnalyze() {
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
                   let sfid = accountDet.sfid;
                    try {

                            var myHeaders = new Headers();
                            myHeaders.append("Accept", "application/json");
                            myHeaders.append("transaction_id", "asdasd");
                            myHeaders.append("client_id", "918e4acddf60379f8ef62a1a07ee4a14d807ab7e");
                            myHeaders.append("client_secret", "e448ec974f91c73a23cf1d672b8ba548b34ec182");
                            myHeaders.append("channel_id", "MOB");
                            myHeaders.append("x-correlation-id", "8a0563ce-d236-4618-a79e-ab9a1451ebe0");
                            myHeaders.append("x-user-domain", "demo-ica-apac.co.in");
                            myHeaders.append("X-Screenless-Kill-Null", "true");
                            myHeaders.append("Content-Type", "application/json");
                        
                            
                            var requestOptions = {
                            method: 'GET',
                            headers: myHeaders,
                            redirect: 'follow'
                            };
                            
                        const getdata = await  fetch("http://s-edvnz-bank-api.sg-s1.cloudhub.io/api/bank/statement/report?reportFile=RD&id=DOC02118774", requestOptions)
                        .then((response) => response.json())
                        .then((response) => {
                            return response;
                        });
                        console.log("Bank", getdata);
                        if (getdata.data) {
                            let stmtData = getdata;
                            const resData = stmtData && stmtData.data[0] ? stmtData.data[0] : null;
                            const camAnalysisData = resData && resData.camAnalysisData ? resData.camAnalysisData : null;
                            const camAnalysisMonthly = camAnalysisData && camAnalysisData.camAnalysisMonthly ? camAnalysisData.camAnalysisMonthly : null;
                            const analysisData = resData && resData.analysisData ? resData.analysisData : null;
                            const transactions = resData && resData.transactions ? resData.transactions : null;
                            const dailyBalances = resData && resData.dailyBalances ? resData.dailyBalances: null;
                           

                                let ObjBankStmt = {
                                    "account__c": sfid ? sfid: "",
                                    "doc_id__c": stmtData && stmtData.docId ? stmtData.docId : "",
                                    "status__c": stmtData && stmtData.status ? stmtData.status : "",
                                    //"message__c": message ? message : "",
                                    //"bank_statement__c": bankStatement ? bankStatement : "",
                                    //"documents__c": documents ? documents: "",
                                    "error__c": stmtData && stmtData.error ? stmtData.error: "",
                                    "bank_name__c": resData && resData.bankName ? resData.bankName: "",
                                    "bank_full_name__c": resData && resData.bankFullName ? resData.bankFullName: "",
                                    "account_number__c": resData && resData.accountNumber ? resData.accountNumber: "",
                                    "account_name__c": resData && resData.accountName ? resData.accountName: "",
                                    "ifsc_code__c": resData && resData.ifscCode ? resData.ifscCode: "",
                                    "account_type__c": resData && resData.accountType ? resData.accountType: "",
                                    "product_type__c": resData && resData.productType ? resData.productType: "",
                                    "period_start__c": resData && resData.periodStart ? resData.periodStart: "",
                                    "period_end__c": resData && resData.periodEnd ? resData.periodEnd: "",
                                    "address__c": resData && resData.address ? resData.address: "",
                                    "email__c": resData && resData.email ? resData.email: "",
                                    "pan_number__c": resData && resData.panNumber ? resData.panNumber: "",
                                    "document_type__c": resData && resData.documentType ? resData.documentType: "",
                                    "od_cc_limit__c": camAnalysisData && camAnalysisData.odCcLimit ? camAnalysisData.odCcLimit: "",
                                    "inward_return_count__c": camAnalysisData && camAnalysisData.inwardReturnCount ? camAnalysisData.inwardReturnCount: "",
                                    "outward_return_count__c": camAnalysisData && camAnalysisData.outwardReturnCount ? camAnalysisData.outwardReturnCount: "",
                                    "inward_return_amount__c": camAnalysisData && camAnalysisData.inwardReturnAmount ? camAnalysisData.inwardReturnAmount: "",
                                    "outward_return_amount__c": camAnalysisData && camAnalysisData.outwardReturnAmount ? camAnalysisData.outwardReturnAmount: "",
                                    "total_net_credits__c": camAnalysisData && camAnalysisData.totalNetCredits ? camAnalysisData.totalNetCredits: "",
                                    "average_balance__c": camAnalysisData && camAnalysisData.averageBalance ? camAnalysisData.averageBalance: "",
                                    "custom_average_balance__c": camAnalysisData && camAnalysisData.customAverageBalance ? camAnalysisData.customAverageBalance: "",
                                    "average_balance_last_six_month__c": camAnalysisData && camAnalysisData.averageBalanceLastSixMonth ? camAnalysisData.averageBalanceLastSixMonth: "",
                                    "average_balance_last_twelve_month__c": camAnalysisData && camAnalysisData.averageBalanceLastTwelveMonth ? camAnalysisData.averageBalanceLastTwelveMonth: "",
                                    "average_receipt_last_six_month__c": camAnalysisData && camAnalysisData.averageReceiptLastSixMonth ? camAnalysisData.averageReceiptLastSixMonth: "",
                                    "average_receipt_last_twelve_month__c": camAnalysisData && camAnalysisData.averageReceiptLastTwelveMonth ? camAnalysisData.averageReceiptLastTwelveMonth: "",
                                    "fraud_score__c": resData && resData.fraudScore ? resData.fraudScore: "",
                                    //"min_balance_breach_count__c": minBalanceBreachCount ? minBalanceBreachCount: "",
                                    //"salary_count__c": salaryCount ? salaryCount: "",
                                    //"salary_amount__c": salaryAmount ? salaryAmount: "",
                                    // "inward_cheque_bounce_count__c": inwardBounces.chequeBounceCount ? inwardBounces.chequeBounceCount: "",
                                    // "inward_payment_bounce_count__c": inwardBounces.paymentBounceCount ? inwardBounces.paymentBounceCount: "",
                                    // "inward_emi_bounce_count__c": inwardBounces.emiBounceCount ? inwardBounces.emiBounceCount: "",
                                    // "inward_other_bounce_count__c": inwardBounces.otherBounceCount ? inwardBounces.otherBounceCount: "",
                                    // "outward_cheque_bounce_count__c": outwardBounces.chequeBounceCount ? outwardBounces.chequeBounceCount: "",
                                    // "outward_payment_bounce_count__c": outwardBounces.paymentBounceCount ? outwardBounces.paymentBounceCount: "",
                                    // "outward_emi_bounce_count__c": outwardBounces.emiBounceCount ? outwardBounces.emiBounceCount: "",
                                    // "outward_other_bounce_count__c": outwardBounces.otherBounceCount ? outwardBounces.otherBounceCount: "",
                                  
                                }

                     // Cam Analysis Monthly Object.
                     let camMonth = [];
                     camAnalysisMonthly.forEach(element => {
                        let camMonthly = {
                            //"Bank_Statement_Analysis__c": "",
                            "month__c":camAnalysisMonthly && element.month ? element.month:"",
                            "no_of_credit__c":camAnalysisMonthly && element.noOfCredit ? element.noOfCredit:"",
                            "gross_credit_amount__c":camAnalysisMonthly && element.grossCreditAmount ? element.grossCreditAmount:"",
                            "no_of_net_credit__c":camAnalysisMonthly && element.noOfNetCredit ? element.noOfNetCredit:"",
                            "net_credit_amount__c":camAnalysisMonthly && element.netCreditAmount ? element.netCreditAmount:"",
                            "internal_credits__c":camAnalysisMonthly && element.internalCredits ? element.internalCredits:"",
                            "no_of_debit__c":camAnalysisMonthly && element.noOfDebit ? element.noOfDebit:"",
                            "gross_debit_amount__c":camAnalysisMonthly && element.grossDebitAmount ? element.grossDebitAmount:"",
                            "no_of_net_debit__c":camAnalysisMonthly && element.noOfNetDebit ? element.noOfNetDebit:"",
                            "net_debit_amount__c":camAnalysisMonthly && element.netDebitAmount ? element.netDebitAmount:"",
                            "internal_debit__c":camAnalysisMonthly && element.internalDebit ? element.internalDebit:"",
                            "no_of_inward_return__c":camAnalysisMonthly && element.noOfInwardReturn ? element.noOfInwardReturn:"",
                            "inward_return__c":camAnalysisMonthly && element.inwardReturn ? element.inwardReturn:"",
                            "no_of_outward_return__c":camAnalysisMonthly && element.noOfOutwardReturn ? element.noOfOutwardReturn:"",
                            "outward_return__c":camAnalysisMonthly && element.outwardReturn ? element.outwardReturn:"",
                            "loan_disbursal__c":camAnalysisMonthly && element.loanDisbursal ? element.loanDisbursal:"",
                            "custom_day_balances_5__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.five ? element.customDayBalances.five:"",
                            "custom_day_balances_10__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.ten ? element.customDayBalances.ten:"",
                            "custom_day_balances_15__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.fifteen ? element.customDayBalances.fifteen:"",
                            "custom_day_balances_20__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.twenty ? element.customDayBalances.twenty:"",
                            "custom_day_balances_25__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.twentyFive ? element.customDayBalances.twentyFive:"",
                            "custom_day_balances_30__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.thirty ? element.customDayBalances.thirty:"",
                            "maximum_continous_overdrawings__c":camAnalysisMonthly && element.maxContinuousOverdrawings ? element.maxContinuousOverdrawings:"",
                            "monthly_avg_incl_od_cc_limit__c":camAnalysisMonthly && element.monthlyAvgInclOdCcLimit ? element.monthlyAvgInclOdCcLimit:"",
                            "instances_of_overdrawings__c":camAnalysisMonthly && element.instancesOfOverdrawings ? element.instancesOfOverdrawings:"",
                            "max_overdrawn_amount__c":camAnalysisMonthly && element.maxOverdrawnAmount ? element.maxOverdrawnAmount:"",
                            "max_interest_servicing_days__c":camAnalysisMonthly && element.maxInterestServicingDays ? element.maxInterestServicingDays:"",
                            "overall_av_positive_negative_eod_balance__c":camAnalysisMonthly && element.overallAveragePositiveNegativeEODBalance ? element.overallAveragePositiveNegativeEODBalance:"",
                            "average_utilised_negative_eod_balance__c":camAnalysisMonthly && element.averageUtilisedNegativeEODBalance ? element.averageUtilisedNegativeEODBalance:"",
                            "average_unutilised_custom_day_balances__c":camAnalysisMonthly && element.averageUnutilisedCustomDayBalances ? element.averageUnutilisedCustomDayBalances:"",
                            "average_utilised_custom_day_balances__c":camAnalysisMonthly && element.averageUtilisedCustomDayBalances ? element.averageUtilisedCustomDayBalances:"",
                            "min_balance__c":camAnalysisMonthly && element.minBalance ? element.minBalance:"",
                            "max_balance__c":camAnalysisMonthly && element.maxBalance ? element.maxBalance:"",
                        }
                        camMonth.push(camMonthly);
                     });
                               
                    //Analysis_Data__c object:
                        let analyData = [];
                    analysisData.forEach(element => {
                        let analyseData = {
                             //"Bank_Statement_Analysis__c": "",
                             "month__c":analysisData && element.month ? element.month:"",
                             "no_of_credit_transactions__c":analysisData && element.noOfCreditTransactions ? element.noOfCreditTransactions:"",
                             "credit_transactions_amount__c":analysisData && element.creditTransactionsAmount ? element.creditTransactionsAmount:"",
                             "no_of_debit_transactions__c":analysisData && element.noOfDebitTransactions ? element.noOfDebitTransactions:"",
                             "debit_transactions_amount__c":analysisData && element.debitTransactionsAmount ? element.debitTransactionsAmount:"",
                             "no_of_net_credit_transactions__c":analysisData && element.noOfNetCreditTransactions ? element.noOfNetCreditTransactions:"",
                             "net_credit_transactions_amount__c":analysisData && element.netCreditTransactionsAmount ? element.netCreditTransactionsAmount:"",
                             "no_of_net_debit_transactions__c":analysisData && element.noOfNetDebitTransactions ? element.noOfNetDebitTransactions:"",
                             "net_debit_transactions_amount__c":analysisData && element.netDebitTransactionsAmount ? element.netDebitTransactionsAmount:"",
                             "no_of_cash_withdrawals__c":analysisData && element.noOfCashWithdrawals ? element.noOfCashWithdrawals:"",
                             "cash_withdrawals_amount__c":analysisData && element.cashWithdrawalsAmount ? element.cashWithdrawalsAmount:"",
                             "no_of_atm_withdrawals__c":analysisData && element.noOfATMWithdrawals ? element.noOfATMWithdrawals:"",
                             "atm_withdrawals_amount__c":analysisData && element.atmWithdrawalsAmount ? element.atmWithdrawalsAmount:"",
                             "no_of_cash_deposits__c":analysisData && element.noOfCashDeposits ? element.noOfCashDeposits:"",
                             "cash_deposits_amount__c":analysisData && element.cashDepositsAmount ? element.cashDepositsAmount:"",
                             "no_of_cheque_bounce_inward__c":analysisData && element.noOfChequeBounceInward ? element.noOfChequeBounceInward:"",
                             "cheque_bounce_inward_amount__c":analysisData && element.chequeBounceInwardAmount ? element.chequeBounceInwardAmount:"",
                             "no_of_cheque_bounce_outward__c":analysisData && element.noOfChequeBounceOutward ? element.noOfChequeBounceOutward:"",
                             "cheque_bounce_outward_amount__c":analysisData && element.chequeBounceOutwardAmount ? element.chequeBounceOutwardAmount:"",
                             "no_of_technical_cheque_bounce__c":analysisData && element.noOfTechnicalChequeBounce ? element.noOfTechnicalChequeBounce:"",
                             "technical_cheque_bounce_amount__c":analysisData && element.technicalChequeBounceAmount ? element.technicalChequeBounceAmount:"",
                             "no_of_nontechnical_cheque_bounce__c":analysisData && element.noOfNonTechnicalChequeBounce ? element.noOfNonTechnicalChequeBounce:"",
                             "non_technical_cheque_bounce_amount__c":analysisData && element.nonTechnicalChequeBounceAmount ? element.nonTechnicalChequeBounceAmount:"",
                             "no_of_payment_bounce_inward__c":analysisData && element.noOfPaymentBounceInward ? element.noOfPaymentBounceInward:"",
                             "payment_bounce_inward_amount__c":analysisData && element.paymentBounceInwardAmount ? element.paymentBounceInwardAmount:"",
                             "no_of_payment_bounce_outward__c":analysisData && element.noOfPaymentBounceOutward ? element.noOfPaymentBounceOutward:"",
                             "payment_bounce_outward_amount__c":analysisData && element.paymentBounceOutwardAmount ? element.paymentBounceOutwardAmount:"",
                             "no_of_cheque_deposits__c":analysisData && element.noOfChequeDeposits ? element.noOfChequeDeposits:"",
                             "cheque_deposits_amount__c":analysisData && element.chequeDepositsAmount ? element.chequeDepositsAmount:"",
                             "no_of_cheque_issued__c":analysisData && element.noOfChequeIssued ? element.noOfChequeIssued:"",
                             "cheque_issued_amount__c":analysisData && element.chequeIssuedAmount ? element.chequeIssuedAmount:"",
                             "no_of_emi__c":analysisData && element.noOfEMI ? element.noOfEMI:"",
                             "total_emi_amount__c":analysisData && element.totalEMIAmount ? element.totalEMIAmount:"",
                             "no_of_emi_bounce__c":analysisData && element.noOfEMIBounce ? element.noOfEMIBounce:"",
                             "total_emi_bounce_amount__c":analysisData && element.totalEMIBounceAmount ? element.totalEMIBounceAmount:"",
                             "no_of_loan_disbursal__c":analysisData && element.noOfLoanDisbursal ? element.noOfLoanDisbursal:"",
                             "loan_disbursal_amount__c":analysisData && element.loanDisbursalAmount ? element.loanDisbursalAmount:"",
                             "salary_amount__c":analysisData && element.salaryAmount ? element.salaryAmount:"",
                             "other_income_amount__c":analysisData && element.otherIncomeAmount ? element.otherIncomeAmount:"",
                             "no_of_minimum_balance_charges__c":analysisData && element.noOfMinimumBalanceCharges ? element.noOfMinimumBalanceCharges:"",
                             "no_of_dd_issue__c":analysisData && element.noOfDDIssue ? element.noOfDDIssue:"",
                             "total_dd_issue__c":analysisData && element.totalDDIssue ? element.totalDDIssue:"",
                             "no_of_dd_cancel__c":analysisData && element.noOfDDCancel ? element.noOfDDCancel:"",
                             "total_dd_cancel__c":analysisData && element.totalDDCancel ? element.totalDDCancel:"",
                             "no_of_credit_internal_transfer__c":analysisData && element.noOfCreditInternalTransfer ? element.noOfCreditInternalTransfer:"",
                             "total_credit_internal_transfer__c":analysisData && element.totalCreditInternalTransfer ? element.totalCreditInternalTransfer:"",
                             "no_of_debit_internal_transfer__c":analysisData && element.noOfDebitInternalTransfer ? element.noOfDebitInternalTransfer:"",
                             "total_debit_internal_transfer__c":analysisData && element.totalDebitInternalTransfer ? element.totalDebitInternalTransfer:"",
                             "no_of_ecs_nach_transactions__c":analysisData && element.noOfEcsNachTransactions ? element.noOfEcsNachTransactions:"",
                             "total_ecs_nach_amount__c":analysisData && element.totalEcsNachAmount ? element.totalEcsNachAmount:"",
                             "no_of_holiday_transactions__c":analysisData && element.noOfHolidayTransactions ? element.noOfHolidayTransactions:"",
                             "total_holiday_amount__c":analysisData && element.totalHolidayAmount ? element.totalHolidayAmount:"",
                             "minimum_eod_balance__c":analysisData && element.minimumEODBalance ? element.minimumEODBalance:"",
                             "maximum_eod_balance__c":analysisData && element.maximumEODBalance ? element.maximumEODBalance:"",
                             "average_eod_balance__c":analysisData && element.averageEODBalance ? element.averageEODBalance:"",
                             "no_of_penal_charges__c":analysisData && element.noOfPenalCharges ? element.noOfPenalCharges:"",
                             "total_penal_charges_amount__c":analysisData && element.totalPenalChargesAmount ? element.totalPenalChargesAmount:"",
                             "no_of_bank_charges__c":analysisData && element.noOfBankCharges ? element.noOfBankCharges:"",
                             "total_bank_charges_amount__c":analysisData && element.totalBankChargesAmount ? element.totalBankChargesAmount:"",
                             "cash_deposit_percentage__c":analysisData && element.cashDepositPercentage ? element.cashDepositPercentage:"",
                             "no_of_interest_received__c":analysisData && element.noOfInterestReceived ? element.noOfInterestReceived:"",
                             "total_interest_received__c":analysisData && element.totalInterestReceived ? element.totalInterestReceived:"",
                             "no_of_interest_paid__c":analysisData && element.noOfInterestPaid ? element.noOfInterestPaid:"",
                             "total_interest_paid__c":analysisData && element.totalInterestPaid ? element.totalInterestPaid:"",
                             "no_of_reversal__c":analysisData && element.noOfReversal ? element.noOfReversal:"",
                             "total_reversal_amount__c":analysisData && element.totalReversalAmount ? element.totalReversalAmount:"",
                             "no_of_cheque_return_charges__c":analysisData && element.noOfChequeReturnCharges ? element.noOfChequeReturnCharges:"",
                             "total_cheque_return_charges__c":analysisData && element.totalChequeReturnCharges ? element.totalChequeReturnCharges:"",
                             "no_of_payment_bounce_charges__c":analysisData && element.noOfPaymentBounceCharges ? element.noOfPaymentBounceCharges:"",
                             "total_payment_bounce_charges__c":analysisData && element.totalPaymentBounceCharges ? element.totalPaymentBounceCharges:"",
                             "no_of_cash_dep_9_to_10_l__c":analysisData && element.noOfCashDep9To10L ? element.noOfCashDep9To10L:"",
                             "no_of_cash_dep_40_to_50k__c":analysisData && element.noOfCashDep40To50K ? element.noOfCashDep40To50K:"",
                             "no_of_atm_wdl_above_2k__c":analysisData && element.noOfAtmWdlAbove2K ? element.noOfAtmWdlAbove2K:"",
                             "minimum_balance__c":analysisData && element.minimumBalance ? element.minimumBalance:"",
                             "maximum_balance__c":analysisData && element.maximumBalance ? element.maximumBalance:"",
                             "median_balance__c":analysisData && element.medianBalance ? element.medianBalance:"",
                           
                        }
                        analyData.push(analyseData);
                    });
                    
                    // Bank transactions object:
                    let transData = [];
                    transactions.forEach(element => {
                        let transactionData = {
                            //"Bank_Statement_Analysis__c": "",
                            "id__c":transactions && element.id ? element.id:"",
                            "transaction_date__c":transactions && element.transactionDate ? element.transactionDate:"",
                            "narration__c":transactions && element.narration ? element.narration:"",
                            "payment_mode__c":transactions && element.paymentMode ? element.paymentMode:"",
                            "cheque__c":transactions && element.cheque ? element.cheque:"",
                            "amount__c":transactions && element.amount ? element.amount:"",
                            "type__c":transactions && element.type ? element.type:"",
                            "opening_balance__c":transactions && element.openingBalance ? element.openingBalance:"",
                            "closing_balance__c":transactions && element.closingBalance ? element.closingBalance:"",
                            "month_year__c":transactions && element.monthYear ? element.monthYear:"",
                            "name__c":transactions && element.name ? element.name:"",
                            "ignorable_transaction__c":transactions && element.ignorableTransaction ? element.ignorableTransaction:"",
                            "holiday__c":transactions && element.holiday ? element.holiday:"",
                          
                        }
                        transData.push(transactionData);
                    });
                           
                    //Daily_Balance__c object:
                    let dailyData = [];
                    dailyBalances.forEach(elements => {
                        const dailyBalanceData = dailyBalances && elements.dailyBalance ? elements.dailyBalance: null;
                        dailyBalanceData.forEach(element => {
                            let dailyBalanceDatas = {
                                "month__c":dailyBalances && elements.month ? elements.month:"",
                                "date__c":dailyBalanceData && element.dates ? element.dates:"",
                                "opening_balance__c":dailyBalanceData && element.openingBalance ? element.openingBalance:"",
                                "closing_balance__c":dailyBalanceData && element.closingBalance ? element.closingBalance:"",
                            }
                            dailyData.push(dailyBalanceDatas);
                        });
                    });


                                    return res.status(200).json({
                                        responseCode: 200,
                                        message: "success",
                                        data: getdata,
                                        ObjBankStmt: ObjBankStmt,
                                        camMonthly: camMonth,
                                        analysisData: analyData,
                                        transactions: transData,
                                        daily: dailyData
                                    })
                        } else {
                            return res.status(200).send({ status: "error", message: getdata.message ? getdata.message : getdata });
                        }
                            
                        
                    } catch (e) {
                        res.status(500).send({ message: e.message ? e.message : e })
                    }
                } else {
                    return res.status(500).send({ message: "Account doesnot exists" })
                }
           
        } catch (error) {
            res.status(500).send({ message: error.message ? error.message : error })
        }
    }
}

