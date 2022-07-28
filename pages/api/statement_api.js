import { STATEMENT_UPLOAD, STATEMENT_DOWNLOAD } from "./api";
import { prisma } from "./_base";
import fs from "fs";
import request from "request";
import moment from "moment";

export async function statementUpload(reqData, getData) {
    return  new Promise((resolve, reject) => {
         var options = {
             'method': 'POST',
             'url': STATEMENT_UPLOAD,
             'headers': {
                'channel_id': 'MOB',
                'transaction_id': 'asdasd',
                'client_id': '918e4acddf60379f8ef62a1a07ee4a14d807ab7e',
                'client_secret': 'e448ec974f91c73a23cf1d672b8ba548b34ec182'
              },
             formData: {
                 'file': {
                     'value': fs.createReadStream(reqData.path),
                     'options': {
                         'filename': reqData.originalFilename,
                         'contentType': null
                     }
                 },
                 'metadata': `{ "password": "${getData.pass}", "bank":"${getData.bank}", "name":"${getData.name}" }\n}`
             }
         };
         request(options, function (error, response) {
            if(error)
            reject(error);
            resolve(JSON.parse(response.body))
         });
     })
}

export async function statementDownload(getData) {
    const { cust_id, sfid, doc_id } = getData;
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
                headers: myHeaders
            };
        const getdata = await  fetch("http://s-edvnz-bank-api.sg-s1.cloudhub.io/api/bank/statement/report?reportFile=RD&id="+doc_id, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            return response;
        });
      //  console.log("Bank", getdata);
        if (getdata.data) {
            let stmtData = getdata;
            const resData = stmtData && stmtData.data[0] ? stmtData.data[0] : null;
            const camAnalysisData = resData && resData.camAnalysisData ? resData.camAnalysisData : null;
            const camAnalysisMonthly = camAnalysisData && camAnalysisData.camAnalysisMonthly ? camAnalysisData.camAnalysisMonthly : null;
            const analysisData = resData && resData.analysisData ? resData.analysisData : null;
            const transactions = resData && resData.transactions ? resData.transactions : null;
            const dailyBalances = resData && resData.dailyBalances ? resData.dailyBalances: null;
            
                let accountBankObj = {
                    account_name__c: resData && resData.accountName ? String(resData.accountName): null,
                    account_number__c: resData && resData.accountNumber ? String(resData.accountNumber): null,
                    account_id__c: sfid ? sfid: null,
                    ifsc__c: resData && resData.ifscCode ? String(resData.ifscCode): null,
                }

                await prisma.bank_account__c.create({
                    data: accountBankObj
                });

                let accountObj = {
                    bank_name__c: resData && resData.bankName ? String(resData.bankName): null,
                    ifsc__c: resData && resData.ifscCode ? String(resData.ifscCode): null,
                    bank_account_number__c: resData && resData.accountNumber ? String(resData.accountNumber): null
                   // is_bank_detail_verified__c: true
                }

                await prisma.account.update({
                    where:{ id: cust_id},
                    data: accountObj
                });

                let ObjBankStmt = {
                    "account__c": sfid ? sfid: null,
                    "doc_id__c": stmtData && stmtData.docId ? String(stmtData.docId) : null,
                    "status__c": stmtData && stmtData.status ? String(stmtData.status) : null,
                    //"message__c": message ? message : "",
                    //"bank_statement__c": bankStatement ? bankStatement : "",
                    //"documents__c": documents ? documents: "",
                    "error__c": stmtData && stmtData.error ? true: false,
                    "bank_name__c": resData && resData.bankName ? String(resData.bankName): null,
                    "bank_full_name__c": resData && resData.bankFullName ? String(resData.bankFullName): null,
                    "account_number__c": resData && resData.accountNumber ? String(resData.accountNumber): null,
                    "account_name__c": resData && resData.accountName ? String(resData.accountName): null,
                    "ifsc_code__c": resData && resData.ifscCode ? String(resData.ifscCode): null,
                    "account_type__c": resData && resData.accountType ? String(resData.accountType): null,
                    "product_type__c": resData && resData.productType ? String(resData.productType): null,
                    "period_start__c": resData && resData.periodStart ? String(resData.periodStart): null,
                    "period_end__c": resData && resData.periodEnd ? String(resData.periodEnd): null,
                    "address__c": resData && resData.address ? String(resData.address): null,
                    "email__c": resData && resData.email ? String(resData.email): null,
                    "pan_number__c": resData && resData.panNumber ? String(resData.panNumber): null,
                    "document_type__c": resData && resData.documentType ? String(resData.documentType): null,
                    "od_cc_limit__c": camAnalysisData && camAnalysisData.odCcLimit ? Number(camAnalysisData.odCcLimit): null,
                    "inward_return_count__c": camAnalysisData && camAnalysisData.inwardReturnCount ?  Number(camAnalysisData.inwardReturnCount): null,
                    "outward_return_count__c": camAnalysisData && camAnalysisData.outwardReturnCount ?  Number(camAnalysisData.outwardReturnCount): null,
                    "inward_return_amount__c": camAnalysisData && camAnalysisData.inwardReturnAmount ?  Number(camAnalysisData.inwardReturnAmount): null,
                    "outward_return_amount__c": camAnalysisData && camAnalysisData.outwardReturnAmount ?  Number(camAnalysisData.outwardReturnAmount): null,
                    "total_net_credits__c": camAnalysisData && camAnalysisData.totalNetCredits ?  Number(camAnalysisData.totalNetCredits): null,
                    "average_balance__c": camAnalysisData && camAnalysisData.averageBalance ?  Number(camAnalysisData.averageBalance): null,
                    "custom_average_balance__c": camAnalysisData && camAnalysisData.customAverageBalance ?  Number(camAnalysisData.customAverageBalance): null,
                    "average_balance_last_six_month__c": camAnalysisData && camAnalysisData.averageBalanceLastSixMonth ?  Number(camAnalysisData.averageBalanceLastSixMonth): null,
                    "average_balance_last_twelve_month__c": camAnalysisData && camAnalysisData.averageBalanceLastTwelveMonth ?  Number(camAnalysisData.averageBalanceLastTwelveMonth): null,
                    "average_receipt_last_six_month__c": camAnalysisData && camAnalysisData.averageReceiptLastSixMonth ?  Number(camAnalysisData.averageReceiptLastSixMonth): null,
                    "average_receipt_last_twelve_month__c": camAnalysisData && camAnalysisData.averageReceiptLastTwelveMonth ?  Number(camAnalysisData.averageReceiptLastTwelveMonth): null,
                    "fraud_score__c": resData && resData.fraudScore ?  Number(resData.fraudScore): null
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

                const getBankStmt = await prisma.bank_statement_analysis__c.create({
                    data: ObjBankStmt
                });

                // Cam Analysis Monthly Object.
                let camMonth = [];
                camAnalysisMonthly.forEach(element => {
                let camMonthly = {
                    "bank_statement_analysis__c": String(getBankStmt.id),
                    "month__c":camAnalysisMonthly && element.month ? String(element.month): null,
                    "no_of_credit__c":camAnalysisMonthly && element.noOfCredit ? Number(element.noOfCredit):null,
                    "gross_credit_amount__c":camAnalysisMonthly && element.grossCreditAmount ? Number(element.grossCreditAmount):null,
                    "no_of_net_credit__c":camAnalysisMonthly && element.noOfNetCredit ? Number(element.noOfNetCredit):null,
                    "net_credit_amount__c":camAnalysisMonthly && element.netCreditAmount ? Number(element.netCreditAmount):null,
                    "internal_credits__c":camAnalysisMonthly && element.internalCredits ? Number(element.internalCredits):null,
                    "no_of_debit__c":camAnalysisMonthly && element.noOfDebit ? Number(element.noOfDebit):null,
                    "gross_debit_amount__c":camAnalysisMonthly && element.grossDebitAmount ? Number(element.grossDebitAmount):null,
                    "no_of_net_debit__c":camAnalysisMonthly && element.noOfNetDebit ? Number(element.noOfNetDebit):null,
                    "net_debit_amount__c":camAnalysisMonthly && element.netDebitAmount ? Number(element.netDebitAmount):null,
                    "internal_debit__c":camAnalysisMonthly && element.internalDebit ?  Number(element.internalDebit):null,
                    "no_of_inward_return__c":camAnalysisMonthly && element.noOfInwardReturn ?  Number(element.noOfInwardReturn):null,
                    "inward_return__c":camAnalysisMonthly && element.inwardReturn ? Number(element.inwardReturn):null,
                    "no_of_outward_return__c":camAnalysisMonthly && element.noOfOutwardReturn ? Number(element.noOfOutwardReturn):null,
                    "outward_return__c":camAnalysisMonthly && element.outwardReturn ? Number(element.outwardReturn):null,
                    "loan_disbursal__c":camAnalysisMonthly && element.loanDisbursal ? Number(element.loanDisbursal):null,
                    "custom_day_balances_5__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.five ? Number(element.customDayBalances.five):null,
                    "custom_day_balances_10__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.ten ? Number(element.customDayBalances.ten):null,
                    "custom_day_balances_15__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.fifteen ? Number(element.customDayBalances.fifteen):null,
                    "custom_day_balances_20__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.twenty ? Number(element.customDayBalances.twenty):null,
                    "custom_day_balances_25__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.twentyFive ? Number(element.customDayBalances.twentyFive):null,
                    "custom_day_balances_30__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.thirty ? Number(element.customDayBalances.thirty):null,
                    "maximum_continous_overdrawings__c":camAnalysisMonthly && element.maxContinuousOverdrawings ? Number(element.maxContinuousOverdrawings):null,
                    "monthly_avg_incl_od_cc_limit__c":camAnalysisMonthly && element.monthlyAvgInclOdCcLimit ? Number(element.monthlyAvgInclOdCcLimit):null,
                    "instances_of_overdrawings__c":camAnalysisMonthly && element.instancesOfOverdrawings ? Number(element.instancesOfOverdrawings):null,
                    "max_overdrawn_amount__c":camAnalysisMonthly && element.maxOverdrawnAmount ? Number(element.maxOverdrawnAmount):null,
                    "max_interest_servicing_days__c":camAnalysisMonthly && element.maxInterestServicingDays ? Number(element.maxInterestServicingDays):null,
                    "overall_av_positive_negative_eod_balance__c":camAnalysisMonthly && element.overallAveragePositiveNegativeEODBalance ? Number(element.overallAveragePositiveNegativeEODBalance):null,
                    "average_utilised_negative_eod_balance__c":camAnalysisMonthly && element.averageUtilisedNegativeEODBalance ? Number(element.averageUtilisedNegativeEODBalance):null,
                    "average_unutilised_custom_day_balances__c":camAnalysisMonthly && element.averageUnutilisedCustomDayBalances ? Number(element.averageUnutilisedCustomDayBalances):null,
                    "average_utilised_custom_day_balances__c":camAnalysisMonthly && element.averageUtilisedCustomDayBalances ? Number(element.averageUtilisedCustomDayBalances):null,
                    "min_balance__c":camAnalysisMonthly && element.minBalance ? Number(element.minBalance):null,
                    "max_balance__c":camAnalysisMonthly && element.maxBalance ? Number(element.maxBalance):null,
                }
                camMonth.push(camMonthly);
                });

                await prisma.cam_analysis_monthly__c.createMany({
                    data: camMonth
                });
                        
            //Analysis_Data__c object:
                let analyData = [];
            analysisData.forEach(element => {
                let analyseData = {
                        "bank_statement_analysis__c": String(getBankStmt.id),
                        "month__c":analysisData && element.month ? String(element.month): null,
                        "no_of_credit_transactions__c":analysisData && element.noOfCreditTransactions ? Number(element.noOfCreditTransactions):null,
                        "credit_transactions_amount__c":analysisData && element.creditTransactionsAmount ? Number(element.creditTransactionsAmount):null,
                        "no_of_debit_transactions__c":analysisData && element.noOfDebitTransactions ? Number(element.noOfDebitTransactions):null,
                        "debit_transactions_amount__c":analysisData && element.debitTransactionsAmount ? Number(element.debitTransactionsAmount):null,
                        "no_of_net_credit_transactions__c":analysisData && element.noOfNetCreditTransactions ? Number(element.noOfNetCreditTransactions):null,
                        "net_credit_transactions_amount__c":analysisData && element.netCreditTransactionsAmount ? Number(element.netCreditTransactionsAmount):null,
                        "no_of_net_debit_transactions__c":analysisData && element.noOfNetDebitTransactions ? Number(element.noOfNetDebitTransactions):null,
                        "net_debit_transactions_amount__c":analysisData && element.netDebitTransactionsAmount ? Number(element.netDebitTransactionsAmount):null,
                        "no_of_cash_withdrawals__c":analysisData && element.noOfCashWithdrawals ? Number(element.noOfCashWithdrawals):null,
                        "cash_withdrawals_amount__c":analysisData && element.cashWithdrawalsAmount ? Number(element.cashWithdrawalsAmount):null,
                        "no_of_atm_withdrawals__c":analysisData && element.noOfATMWithdrawals ? Number(element.noOfATMWithdrawals):null,
                        "atm_withdrawals_amount__c":analysisData && element.atmWithdrawalsAmount ? Number(element.atmWithdrawalsAmount):null,
                        "no_of_cash_deposits__c":analysisData && element.noOfCashDeposits ? Number(element.noOfCashDeposits):null,
                        "cash_deposits_amount__c":analysisData && element.cashDepositsAmount ? Number(element.cashDepositsAmount):null,
                        "no_of_cheque_bounce_inward__c":analysisData && element.noOfChequeBounceInward ? Number(element.noOfChequeBounceInward):null,
                        "cheque_bounce_inward_amount__c":analysisData && element.chequeBounceInwardAmount ? Number(element.chequeBounceInwardAmount):null,
                        "no_of_cheque_bounce_outward__c":analysisData && element.noOfChequeBounceOutward ? Number(element.noOfChequeBounceOutward):null,
                        "cheque_bounce_outward_amount__c":analysisData && element.chequeBounceOutwardAmount ? Number(element.chequeBounceOutwardAmount):null,
                        "no_of_technical_cheque_bounce__c":analysisData && element.noOfTechnicalChequeBounce ? Number(element.noOfTechnicalChequeBounce):null,
                        "technical_cheque_bounce_amount__c":analysisData && element.technicalChequeBounceAmount ? Number(element.technicalChequeBounceAmount):null,
                        "no_of_nontechnical_cheque_bounce__c":analysisData && element.noOfNonTechnicalChequeBounce ? Number(element.noOfNonTechnicalChequeBounce):null,
                        "non_technical_cheque_bounce_amount__c":analysisData && element.nonTechnicalChequeBounceAmount ? Number(element.nonTechnicalChequeBounceAmount):null,
                        "no_of_payment_bounce_inward__c":analysisData && element.noOfPaymentBounceInward ? Number(element.noOfPaymentBounceInward):null,
                        "payment_bounce_inward_amount__c":analysisData && element.paymentBounceInwardAmount ? Number(element.paymentBounceInwardAmount):null,
                        "no_of_payment_bounce_outward__c":analysisData && element.noOfPaymentBounceOutward ? Number(element.noOfPaymentBounceOutward):null,
                        "payment_bounce_outward_amount__c":analysisData && element.paymentBounceOutwardAmount ? Number(element.paymentBounceOutwardAmount):null,
                        "no_of_cheque_deposits__c":analysisData && element.noOfChequeDeposits ? Number(element.noOfChequeDeposits):null,
                        "cheque_deposits_amount__c":analysisData && element.chequeDepositsAmount ? Number(element.chequeDepositsAmount):null,
                        "no_of_cheque_issued__c":analysisData && element.noOfChequeIssued ? Number(element.noOfChequeIssued):null,
                        "cheque_issued_amount__c":analysisData && element.chequeIssuedAmount ? Number(element.chequeIssuedAmount):null,
                        "no_of_emi__c":analysisData && element.noOfEMI ? Number(element.noOfEMI):null,
                        "total_emi_amount__c":analysisData && element.totalEMIAmount ? Number(element.totalEMIAmount):null,
                        "no_of_emi_bounce__c":analysisData && element.noOfEMIBounce ? Number(element.noOfEMIBounce):null,
                        "total_emi_bounce_amount__c":analysisData && element.totalEMIBounceAmount ? Number(element.totalEMIBounceAmount):null,
                        "no_of_loan_disbursal__c":analysisData && element.noOfLoanDisbursal ? Number(element.noOfLoanDisbursal):null,
                        "loan_disbursal_amount__c":analysisData && element.loanDisbursalAmount ? Number(element.loanDisbursalAmount):null,
                        "salary_amount__c":analysisData && element.salaryAmount ? Number(element.salaryAmount):null,
                        "other_income_amount__c":analysisData && element.otherIncomeAmount ? Number(element.otherIncomeAmount):null,
                        "no_of_minimum_balance_charges__c":analysisData && element.noOfMinimumBalanceCharges ? Number(element.noOfMinimumBalanceCharges):null,
                        "no_of_dd_issue__c":analysisData && element.noOfDDIssue ? Number(element.noOfDDIssue):null,
                        "total_dd_issue__c":analysisData && element.totalDDIssue ? Number(element.totalDDIssue):null,
                        "no_of_dd_cancel__c":analysisData && element.noOfDDCancel ? Number(element.noOfDDCancel):null,
                        "total_dd_cancel__c":analysisData && element.totalDDCancel ? Number(element.totalDDCancel):null,
                        "no_of_credit_internal_transfer__c":analysisData && element.noOfCreditInternalTransfer ? Number(element.noOfCreditInternalTransfer):null,
                        "total_credit_internal_transfer__c":analysisData && element.totalCreditInternalTransfer ? Number(element.totalCreditInternalTransfer):null,
                        "no_of_debit_internal_transfer__c":analysisData && element.noOfDebitInternalTransfer ? Number(element.noOfDebitInternalTransfer):null,
                        "total_debit_internal_transfer__c":analysisData && element.totalDebitInternalTransfer ? Number(element.totalDebitInternalTransfer):null,
                        "no_of_ecs_nach_transactions__c":analysisData && element.noOfEcsNachTransactions ? Number(element.noOfEcsNachTransactions):null,
                        "total_ecs_nach_amount__c":analysisData && element.totalEcsNachAmount ? Number(element.totalEcsNachAmount):null,
                        "no_of_holiday_transactions__c":analysisData && element.noOfHolidayTransactions ? Number(element.noOfHolidayTransactions):null,
                        "total_holiday_amount__c":analysisData && element.totalHolidayAmount ? Number(element.totalHolidayAmount):null,
                        "minimum_eod_balance__c":analysisData && element.minimumEODBalance ? Number(element.minimumEODBalance):null,
                        "maximum_eod_balance__c":analysisData && element.maximumEODBalance ? Number(element.maximumEODBalance):null,
                        "average_eod_balance__c":analysisData && element.averageEODBalance ? Number(element.averageEODBalance):null,
                        "no_of_penal_charges__c":analysisData && element.noOfPenalCharges ? Number(element.noOfPenalCharges):null,
                        "total_penal_charges_amount__c":analysisData && element.totalPenalChargesAmount ? Number(element.totalPenalChargesAmount):null,
                        "no_of_bank_charges__c":analysisData && element.noOfBankCharges ? Number(element.noOfBankCharges):null,
                        "total_bank_charges_amount__c":analysisData && element.totalBankChargesAmount ? Number(element.totalBankChargesAmount):null,
                        "cash_deposit_percentage__c":analysisData && element.cashDepositPercentage ? Number(element.cashDepositPercentage):null,
                        "no_of_interest_received__c":analysisData && element.noOfInterestReceived ? Number(element.noOfInterestReceived):null,
                        "total_interest_received__c":analysisData && element.totalInterestReceived ? Number(element.totalInterestReceived):null,
                        "no_of_interest_paid__c":analysisData && element.noOfInterestPaid ? Number(element.noOfInterestPaid):null,
                        "total_interest_paid__c":analysisData && element.totalInterestPaid ? Number(element.totalInterestPaid):null,
                        "no_of_reversal__c":analysisData && element.noOfReversal ? Number(element.noOfReversal):null,
                        "total_reversal_amount__c":analysisData && element.totalReversalAmount ? Number(element.totalReversalAmount):null,
                        "no_of_cheque_return_charges__c":analysisData && element.noOfChequeReturnCharges ? Number(element.noOfChequeReturnCharges):null,
                        "total_cheque_return_charges__c":analysisData && element.totalChequeReturnCharges ? Number(element.totalChequeReturnCharges):null,
                        "no_of_payment_bounce_charges__c":analysisData && element.noOfPaymentBounceCharges ? Number(element.noOfPaymentBounceCharges):null,
                        "total_payment_bounce_charges__c":analysisData && element.totalPaymentBounceCharges ? Number(element.totalPaymentBounceCharges):null,
                        "no_of_cash_dep_9_to_10_l__c":analysisData && element.noOfCashDep9To10L ? Number(element.noOfCashDep9To10L):null,
                        "no_of_cash_dep_40_to_50k__c":analysisData && element.noOfCashDep40To50K ? Number(element.noOfCashDep40To50K):null,
                        "no_of_atm_wdl_above_2k__c":analysisData && element.noOfAtmWdlAbove2K ? Number(element.noOfAtmWdlAbove2K):null,
                        "minimum_balance__c":analysisData && element.minimumBalance ? Number(element.minimumBalance):null,
                        "maximum_balance__c":analysisData && element.maximumBalance ? Number(element.maximumBalance):null,
                        "median_balance__c":analysisData && element.medianBalance ? Number(element.medianBalance):null, 
                }
                analyData.push(analyseData);
            });

            await prisma.analysis_data__c.createMany({
                data: analyData
            });
            
            // Bank transactions object:
            let transData = [];
            transactions.forEach(element => {
                let transactionData = {
                    "bank_statement_analysis__c": String(getBankStmt.id),
                    "id__c":transactions && element.id ? Number(element.id): null,
                    "transaction_date__c":transactions && element.transactionDate ? new Date(element.transactionDate): null,
                    "narration__c":transactions && element.narration ? String(element.narration): null,
                    "payment_mode__c":transactions && element.paymentMode ? String(element.paymentMode): null,
                    "cheque__c":transactions && element.cheque ? String(element.cheque): null,
                    "amount__c":transactions && element.amount ? Number(element.amount): null,
                    "type__c":transactions && element.type ? String(element.type): null,
                    "opening_balance__c":transactions && element.openingBalance ? Number(element.openingBalance): null,
                    "closing_balance__c":transactions && element.closingBalance ? Number(element.closingBalance): null,
                    "month_year__c":transactions && element.monthYear ? String(element.monthYear): null,
                    "name__c":transactions && element.name ? String(element.name): null,
                    "ignorable_transaction__c":transactions && element.ignorableTransaction ? element.ignorableTransaction: false,
                    "holiday__c":transactions && element.holiday ? element.holiday: false,
                }
                transData.push(transactionData);
            });

            await prisma.bank_transactions__c.createMany({
                data: transData
            });
                    
            //Daily_Balance__c object:
            let dailyData = [];
            dailyBalances.forEach(elements => {
                const dailyBalanceData = dailyBalances && elements.dailyBalance ? elements.dailyBalance: null;
                dailyBalanceData.forEach(element => {
                    let dailyBalanceDatas = {
                        "bank_statement_analysis__c":  String(getBankStmt.id),
                        "month__c":dailyBalances && elements.month ? String(elements.month): null,
                        "date__c":dailyBalanceData && element.dates ? new Date(element.dates): null,
                        "opening_balance__c":dailyBalanceData && element.openingBalance ? Number(element.openingBalance): null,
                        "closing_balance__c":dailyBalanceData && element.closingBalance ? Number(element.closingBalance): null,
                    }
                    dailyData.push(dailyBalanceDatas);
                });
            });
            
            await prisma.daily_balance__c.createMany({
                data: dailyData
            });
            await prisma.api_logger__c.create({
                data: {
                    request__c: String(doc_id),
                    service__c: "BANK STATEMENT ANALAISIS",
                    account__c: sfid
                },
            });

            return {
                responseCode: 200,
                status: "success",
                message: "success",
                data: getdata,
                ObjBankStmt: ObjBankStmt,
                camMonthly: camMonth,
                analysisData: analyData,
                transactions: transData,
                daily: dailyData
            }
        } else {
            await prisma.custom_error__c.create({
                data: {
                    exception_message__c: JSON.stringify(getdata),
                    account__c: sfid,
                    service__c: "BANK STATEMENT ANALISIS",
                },
              });
            return{ status: "error", message: getdata.message ? getdata.message : getdata };
        }
            
        
    } catch (e) {
        return { status: "error", message: e.message ? e.message : e }
    }
}

export async function statementDownloadBeforeLimitS(getData) {
    const { cust_id, sfid, doc_id } = getData;
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
                headers: myHeaders
            };
        const getdata = await  fetch("http://s-edvnz-bank-api.sg-s1.cloudhub.io/api/bank/statement/report?reportFile=RD&id="+doc_id, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            return response;
        });
      //  console.log("Bank", getdata);
        if (getdata.data) {
            let stmtData = getdata;
            const resData = stmtData && stmtData.data[0] ? stmtData.data[0] : null;
            const camAnalysisData = resData && resData.camAnalysisData ? resData.camAnalysisData : null;
            const camAnalysisMonthly = camAnalysisData && camAnalysisData.camAnalysisMonthly ? camAnalysisData.camAnalysisMonthly : null;
            const analysisData = resData && resData.analysisData ? resData.analysisData : null;
            const transactions = resData && resData.transactions ? resData.transactions : null;
            const dailyBalances = resData && resData.dailyBalances ? resData.dailyBalances: null;
            
                let accountBankObj = {
                    account_name__c: resData && resData.accountName ? resData.accountName: '',
                    account_number__c: resData && resData.accountNumber ? resData.accountNumber: '',
                    account_id__c: sfid ? sfid: "",
                    ifsc__c: resData && resData.ifscCode ? resData.ifscCode: '',
                }

                await prisma.bank_account__c.create({
                    data: accountBankObj
                });

                let accountObj = {
                    bank_name__c: resData && resData.bankName ? resData.bankName: '',
                    ifsc__c: resData && resData.ifscCode ? resData.ifscCode: '',
                    bank_account_number__c: resData && resData.accountNumber ? resData.accountNumber: '',
                   // is_bank_detail_verified__c: true,
                  //  ipa_basic_bureau__c: 100000
                }

                await prisma.account.update({
                    where:{ sfid: sfid},
                    data: accountObj
                });

                let ObjBankStmt = {
                    "account__c": sfid ? sfid: null,
                    "doc_id__c": stmtData && stmtData.docId ? String(stmtData.docId) : null,
                    "status__c": stmtData && stmtData.status ? String(stmtData.status) : null,
                    //"message__c": message ? message : "",
                    //"bank_statement__c": bankStatement ? bankStatement : "",
                    //"documents__c": documents ? documents: "",
                    "error__c": stmtData && stmtData.error ? true: false,
                    "bank_name__c": resData && resData.bankName ? String(resData.bankName): null,
                    "bank_full_name__c": resData && resData.bankFullName ? String(resData.bankFullName): null,
                    "account_number__c": resData && resData.accountNumber ? String(resData.accountNumber): null,
                    "account_name__c": resData && resData.accountName ? String(resData.accountName): null,
                    "ifsc_code__c": resData && resData.ifscCode ? String(resData.ifscCode): null,
                    "account_type__c": resData && resData.accountType ? String(resData.accountType): null,
                    "product_type__c": resData && resData.productType ? String(resData.productType): null,
                    "period_start__c": resData && resData.periodStart ? String(resData.periodStart): null,
                    "period_end__c": resData && resData.periodEnd ? String(resData.periodEnd): null,
                    "address__c": resData && resData.address ? String(resData.address): null,
                    "email__c": resData && resData.email ? String(resData.email): null,
                    "pan_number__c": resData && resData.panNumber ? String(resData.panNumber): null,
                    "document_type__c": resData && resData.documentType ? String(resData.documentType): null,
                    "od_cc_limit__c": camAnalysisData && camAnalysisData.odCcLimit ? Number(camAnalysisData.odCcLimit): null,
                    "inward_return_count__c": camAnalysisData && camAnalysisData.inwardReturnCount ?  Number(camAnalysisData.inwardReturnCount): null,
                    "outward_return_count__c": camAnalysisData && camAnalysisData.outwardReturnCount ?  Number(camAnalysisData.outwardReturnCount): null,
                    "inward_return_amount__c": camAnalysisData && camAnalysisData.inwardReturnAmount ?  Number(camAnalysisData.inwardReturnAmount): null,
                    "outward_return_amount__c": camAnalysisData && camAnalysisData.outwardReturnAmount ?  Number(camAnalysisData.outwardReturnAmount): null,
                    "total_net_credits__c": camAnalysisData && camAnalysisData.totalNetCredits ?  Number(camAnalysisData.totalNetCredits): null,
                    "average_balance__c": camAnalysisData && camAnalysisData.averageBalance ?  Number(camAnalysisData.averageBalance): null,
                    "custom_average_balance__c": camAnalysisData && camAnalysisData.customAverageBalance ?  Number(camAnalysisData.customAverageBalance): null,
                    "average_balance_last_six_month__c": camAnalysisData && camAnalysisData.averageBalanceLastSixMonth ?  Number(camAnalysisData.averageBalanceLastSixMonth): null,
                    "average_balance_last_twelve_month__c": camAnalysisData && camAnalysisData.averageBalanceLastTwelveMonth ?  Number(camAnalysisData.averageBalanceLastTwelveMonth): null,
                    "average_receipt_last_six_month__c": camAnalysisData && camAnalysisData.averageReceiptLastSixMonth ?  Number(camAnalysisData.averageReceiptLastSixMonth): null,
                    "average_receipt_last_twelve_month__c": camAnalysisData && camAnalysisData.averageReceiptLastTwelveMonth ?  Number(camAnalysisData.averageReceiptLastTwelveMonth): null,
                    "fraud_score__c": resData && resData.fraudScore ?  Number(resData.fraudScore): null
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

                const getBankStmt = await prisma.bank_statement_analysis__c.create({
                    data: ObjBankStmt
                });

                // Cam Analysis Monthly Object.
                let camMonth = [];
                camAnalysisMonthly.forEach(element => {
                let camMonthly = {
                    "bank_statement_analysis__c": String(getBankStmt.id),
                    "month__c":camAnalysisMonthly && element.month ? String(element.month): null,
                    "no_of_credit__c":camAnalysisMonthly && element.noOfCredit ? Number(element.noOfCredit):null,
                    "gross_credit_amount__c":camAnalysisMonthly && element.grossCreditAmount ? Number(element.grossCreditAmount):null,
                    "no_of_net_credit__c":camAnalysisMonthly && element.noOfNetCredit ? Number(element.noOfNetCredit):null,
                    "net_credit_amount__c":camAnalysisMonthly && element.netCreditAmount ? Number(element.netCreditAmount):null,
                    "internal_credits__c":camAnalysisMonthly && element.internalCredits ? Number(element.internalCredits):null,
                    "no_of_debit__c":camAnalysisMonthly && element.noOfDebit ? Number(element.noOfDebit):null,
                    "gross_debit_amount__c":camAnalysisMonthly && element.grossDebitAmount ? Number(element.grossDebitAmount):null,
                    "no_of_net_debit__c":camAnalysisMonthly && element.noOfNetDebit ? Number(element.noOfNetDebit):null,
                    "net_debit_amount__c":camAnalysisMonthly && element.netDebitAmount ? Number(element.netDebitAmount):null,
                    "internal_debit__c":camAnalysisMonthly && element.internalDebit ?  Number(element.internalDebit):null,
                    "no_of_inward_return__c":camAnalysisMonthly && element.noOfInwardReturn ?  Number(element.noOfInwardReturn):null,
                    "inward_return__c":camAnalysisMonthly && element.inwardReturn ? Number(element.inwardReturn):null,
                    "no_of_outward_return__c":camAnalysisMonthly && element.noOfOutwardReturn ? Number(element.noOfOutwardReturn):null,
                    "outward_return__c":camAnalysisMonthly && element.outwardReturn ? Number(element.outwardReturn):null,
                    "loan_disbursal__c":camAnalysisMonthly && element.loanDisbursal ? Number(element.loanDisbursal):null,
                    "custom_day_balances_5__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.five ? Number(element.customDayBalances.five):null,
                    "custom_day_balances_10__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.ten ? Number(element.customDayBalances.ten):null,
                    "custom_day_balances_15__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.fifteen ? Number(element.customDayBalances.fifteen):null,
                    "custom_day_balances_20__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.twenty ? Number(element.customDayBalances.twenty):null,
                    "custom_day_balances_25__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.twentyFive ? Number(element.customDayBalances.twentyFive):null,
                    "custom_day_balances_30__c":camAnalysisMonthly && element.customDayBalances && element.customDayBalances.thirty ? Number(element.customDayBalances.thirty):null,
                    "maximum_continous_overdrawings__c":camAnalysisMonthly && element.maxContinuousOverdrawings ? Number(element.maxContinuousOverdrawings):null,
                    "monthly_avg_incl_od_cc_limit__c":camAnalysisMonthly && element.monthlyAvgInclOdCcLimit ? Number(element.monthlyAvgInclOdCcLimit):null,
                    "instances_of_overdrawings__c":camAnalysisMonthly && element.instancesOfOverdrawings ? Number(element.instancesOfOverdrawings):null,
                    "max_overdrawn_amount__c":camAnalysisMonthly && element.maxOverdrawnAmount ? Number(element.maxOverdrawnAmount):null,
                    "max_interest_servicing_days__c":camAnalysisMonthly && element.maxInterestServicingDays ? Number(element.maxInterestServicingDays):null,
                    "overall_av_positive_negative_eod_balance__c":camAnalysisMonthly && element.overallAveragePositiveNegativeEODBalance ? Number(element.overallAveragePositiveNegativeEODBalance):null,
                    "average_utilised_negative_eod_balance__c":camAnalysisMonthly && element.averageUtilisedNegativeEODBalance ? Number(element.averageUtilisedNegativeEODBalance):null,
                    "average_unutilised_custom_day_balances__c":camAnalysisMonthly && element.averageUnutilisedCustomDayBalances ? Number(element.averageUnutilisedCustomDayBalances):null,
                    "average_utilised_custom_day_balances__c":camAnalysisMonthly && element.averageUtilisedCustomDayBalances ? Number(element.averageUtilisedCustomDayBalances):null,
                    "min_balance__c":camAnalysisMonthly && element.minBalance ? Number(element.minBalance):null,
                    "max_balance__c":camAnalysisMonthly && element.maxBalance ? Number(element.maxBalance):null,
                }
                camMonth.push(camMonthly);
                });

                await prisma.cam_analysis_monthly__c.createMany({
                    data: camMonth
                });
                        
            //Analysis_Data__c object:
                let analyData = [];
            analysisData.forEach(element => {
                let analyseData = {
                    "bank_statement_analysis__c": String(getBankStmt.id),
                    "month__c":analysisData && element.month ? String(element.month): null,
                    "no_of_credit_transactions__c":analysisData && element.noOfCreditTransactions ? Number(element.noOfCreditTransactions):null,
                    "credit_transactions_amount__c":analysisData && element.creditTransactionsAmount ? Number(element.creditTransactionsAmount):null,
                    "no_of_debit_transactions__c":analysisData && element.noOfDebitTransactions ? Number(element.noOfDebitTransactions):null,
                    "debit_transactions_amount__c":analysisData && element.debitTransactionsAmount ? Number(element.debitTransactionsAmount):null,
                    "no_of_net_credit_transactions__c":analysisData && element.noOfNetCreditTransactions ? Number(element.noOfNetCreditTransactions):null,
                    "net_credit_transactions_amount__c":analysisData && element.netCreditTransactionsAmount ? Number(element.netCreditTransactionsAmount):null,
                    "no_of_net_debit_transactions__c":analysisData && element.noOfNetDebitTransactions ? Number(element.noOfNetDebitTransactions):null,
                    "net_debit_transactions_amount__c":analysisData && element.netDebitTransactionsAmount ? Number(element.netDebitTransactionsAmount):null,
                    "no_of_cash_withdrawals__c":analysisData && element.noOfCashWithdrawals ? Number(element.noOfCashWithdrawals):null,
                    "cash_withdrawals_amount__c":analysisData && element.cashWithdrawalsAmount ? Number(element.cashWithdrawalsAmount):null,
                    "no_of_atm_withdrawals__c":analysisData && element.noOfATMWithdrawals ? Number(element.noOfATMWithdrawals):null,
                    "atm_withdrawals_amount__c":analysisData && element.atmWithdrawalsAmount ? Number(element.atmWithdrawalsAmount):null,
                    "no_of_cash_deposits__c":analysisData && element.noOfCashDeposits ? Number(element.noOfCashDeposits):null,
                    "cash_deposits_amount__c":analysisData && element.cashDepositsAmount ? Number(element.cashDepositsAmount):null,
                    "no_of_cheque_bounce_inward__c":analysisData && element.noOfChequeBounceInward ? Number(element.noOfChequeBounceInward):null,
                    "cheque_bounce_inward_amount__c":analysisData && element.chequeBounceInwardAmount ? Number(element.chequeBounceInwardAmount):null,
                    "no_of_cheque_bounce_outward__c":analysisData && element.noOfChequeBounceOutward ? Number(element.noOfChequeBounceOutward):null,
                    "cheque_bounce_outward_amount__c":analysisData && element.chequeBounceOutwardAmount ? Number(element.chequeBounceOutwardAmount):null,
                    "no_of_technical_cheque_bounce__c":analysisData && element.noOfTechnicalChequeBounce ? Number(element.noOfTechnicalChequeBounce):null,
                    "technical_cheque_bounce_amount__c":analysisData && element.technicalChequeBounceAmount ? Number(element.technicalChequeBounceAmount):null,
                    "no_of_nontechnical_cheque_bounce__c":analysisData && element.noOfNonTechnicalChequeBounce ? Number(element.noOfNonTechnicalChequeBounce):null,
                    "non_technical_cheque_bounce_amount__c":analysisData && element.nonTechnicalChequeBounceAmount ? Number(element.nonTechnicalChequeBounceAmount):null,
                    "no_of_payment_bounce_inward__c":analysisData && element.noOfPaymentBounceInward ? Number(element.noOfPaymentBounceInward):null,
                    "payment_bounce_inward_amount__c":analysisData && element.paymentBounceInwardAmount ? Number(element.paymentBounceInwardAmount):null,
                    "no_of_payment_bounce_outward__c":analysisData && element.noOfPaymentBounceOutward ? Number(element.noOfPaymentBounceOutward):null,
                    "payment_bounce_outward_amount__c":analysisData && element.paymentBounceOutwardAmount ? Number(element.paymentBounceOutwardAmount):null,
                    "no_of_cheque_deposits__c":analysisData && element.noOfChequeDeposits ? Number(element.noOfChequeDeposits):null,
                    "cheque_deposits_amount__c":analysisData && element.chequeDepositsAmount ? Number(element.chequeDepositsAmount):null,
                    "no_of_cheque_issued__c":analysisData && element.noOfChequeIssued ? Number(element.noOfChequeIssued):null,
                    "cheque_issued_amount__c":analysisData && element.chequeIssuedAmount ? Number(element.chequeIssuedAmount):null,
                    "no_of_emi__c":analysisData && element.noOfEMI ? Number(element.noOfEMI):null,
                    "total_emi_amount__c":analysisData && element.totalEMIAmount ? Number(element.totalEMIAmount):null,
                    "no_of_emi_bounce__c":analysisData && element.noOfEMIBounce ? Number(element.noOfEMIBounce):null,
                    "total_emi_bounce_amount__c":analysisData && element.totalEMIBounceAmount ? Number(element.totalEMIBounceAmount):null,
                    "no_of_loan_disbursal__c":analysisData && element.noOfLoanDisbursal ? Number(element.noOfLoanDisbursal):null,
                    "loan_disbursal_amount__c":analysisData && element.loanDisbursalAmount ? Number(element.loanDisbursalAmount):null,
                    "salary_amount__c":analysisData && element.salaryAmount ? Number(element.salaryAmount):null,
                    "other_income_amount__c":analysisData && element.otherIncomeAmount ? Number(element.otherIncomeAmount):null,
                    "no_of_minimum_balance_charges__c":analysisData && element.noOfMinimumBalanceCharges ? Number(element.noOfMinimumBalanceCharges):null,
                    "no_of_dd_issue__c":analysisData && element.noOfDDIssue ? Number(element.noOfDDIssue):null,
                    "total_dd_issue__c":analysisData && element.totalDDIssue ? Number(element.totalDDIssue):null,
                    "no_of_dd_cancel__c":analysisData && element.noOfDDCancel ? Number(element.noOfDDCancel):null,
                    "total_dd_cancel__c":analysisData && element.totalDDCancel ? Number(element.totalDDCancel):null,
                    "no_of_credit_internal_transfer__c":analysisData && element.noOfCreditInternalTransfer ? Number(element.noOfCreditInternalTransfer):null,
                    "total_credit_internal_transfer__c":analysisData && element.totalCreditInternalTransfer ? Number(element.totalCreditInternalTransfer):null,
                    "no_of_debit_internal_transfer__c":analysisData && element.noOfDebitInternalTransfer ? Number(element.noOfDebitInternalTransfer):null,
                    "total_debit_internal_transfer__c":analysisData && element.totalDebitInternalTransfer ? Number(element.totalDebitInternalTransfer):null,
                    "no_of_ecs_nach_transactions__c":analysisData && element.noOfEcsNachTransactions ? Number(element.noOfEcsNachTransactions):null,
                    "total_ecs_nach_amount__c":analysisData && element.totalEcsNachAmount ? Number(element.totalEcsNachAmount):null,
                    "no_of_holiday_transactions__c":analysisData && element.noOfHolidayTransactions ? Number(element.noOfHolidayTransactions):null,
                    "total_holiday_amount__c":analysisData && element.totalHolidayAmount ? Number(element.totalHolidayAmount):null,
                    "minimum_eod_balance__c":analysisData && element.minimumEODBalance ? Number(element.minimumEODBalance):null,
                    "maximum_eod_balance__c":analysisData && element.maximumEODBalance ? Number(element.maximumEODBalance):null,
                    "average_eod_balance__c":analysisData && element.averageEODBalance ? Number(element.averageEODBalance):null,
                    "no_of_penal_charges__c":analysisData && element.noOfPenalCharges ? Number(element.noOfPenalCharges):null,
                    "total_penal_charges_amount__c":analysisData && element.totalPenalChargesAmount ? Number(element.totalPenalChargesAmount):null,
                    "no_of_bank_charges__c":analysisData && element.noOfBankCharges ? Number(element.noOfBankCharges):null,
                    "total_bank_charges_amount__c":analysisData && element.totalBankChargesAmount ? Number(element.totalBankChargesAmount):null,
                    "cash_deposit_percentage__c":analysisData && element.cashDepositPercentage ? Number(element.cashDepositPercentage):null,
                    "no_of_interest_received__c":analysisData && element.noOfInterestReceived ? Number(element.noOfInterestReceived):null,
                    "total_interest_received__c":analysisData && element.totalInterestReceived ? Number(element.totalInterestReceived):null,
                    "no_of_interest_paid__c":analysisData && element.noOfInterestPaid ? Number(element.noOfInterestPaid):null,
                    "total_interest_paid__c":analysisData && element.totalInterestPaid ? Number(element.totalInterestPaid):null,
                    "no_of_reversal__c":analysisData && element.noOfReversal ? Number(element.noOfReversal):null,
                    "total_reversal_amount__c":analysisData && element.totalReversalAmount ? Number(element.totalReversalAmount):null,
                    "no_of_cheque_return_charges__c":analysisData && element.noOfChequeReturnCharges ? Number(element.noOfChequeReturnCharges):null,
                    "total_cheque_return_charges__c":analysisData && element.totalChequeReturnCharges ? Number(element.totalChequeReturnCharges):null,
                    "no_of_payment_bounce_charges__c":analysisData && element.noOfPaymentBounceCharges ? Number(element.noOfPaymentBounceCharges):null,
                    "total_payment_bounce_charges__c":analysisData && element.totalPaymentBounceCharges ? Number(element.totalPaymentBounceCharges):null,
                    "no_of_cash_dep_9_to_10_l__c":analysisData && element.noOfCashDep9To10L ? Number(element.noOfCashDep9To10L):null,
                    "no_of_cash_dep_40_to_50k__c":analysisData && element.noOfCashDep40To50K ? Number(element.noOfCashDep40To50K):null,
                    "no_of_atm_wdl_above_2k__c":analysisData && element.noOfAtmWdlAbove2K ? Number(element.noOfAtmWdlAbove2K):null,
                    "minimum_balance__c":analysisData && element.minimumBalance ? Number(element.minimumBalance):null,
                    "maximum_balance__c":analysisData && element.maximumBalance ? Number(element.maximumBalance):null,
                    "median_balance__c":analysisData && element.medianBalance ? Number(element.medianBalance):null, 
                }
                analyData.push(analyseData);
            });

            await prisma.analysis_data__c.createMany({
                data: analyData
            });
            
            // Bank transactions object:
            let transData = [];
            transactions.forEach(element => {
                let transactionData = {
                    "bank_statement_analysis__c": String(getBankStmt.id),
                    "id__c":transactions && element.id ? Number(element.id): null,
                    "transaction_date__c":transactions && element.transactionDate ? new Date(element.transactionDate): null,
                    "narration__c":transactions && element.narration ? String(element.narration): null,
                    "payment_mode__c":transactions && element.paymentMode ? String(element.paymentMode): null,
                    "cheque__c":transactions && element.cheque ? String(element.cheque): null,
                    "amount__c":transactions && element.amount ? Number(element.amount): null,
                    "type__c":transactions && element.type ? String(element.type): null,
                    "opening_balance__c":transactions && element.openingBalance ? Number(element.openingBalance): null,
                    "closing_balance__c":transactions && element.closingBalance ? Number(element.closingBalance): null,
                    "month_year__c":transactions && element.monthYear ? String(element.monthYear): null,
                    "name__c":transactions && element.name ? String(element.name): null,
                    "ignorable_transaction__c":transactions && element.ignorableTransaction ? element.ignorableTransaction: false,
                    "holiday__c":transactions && element.holiday ? element.holiday: false,
                }
                transData.push(transactionData);
            });

            await prisma.bank_transactions__c.createMany({
                data: transData
            });
                    
            //Daily_Balance__c object:
            let dailyData = [];
            dailyBalances.forEach(elements => {
                const dailyBalanceData = dailyBalances && elements.dailyBalance ? elements.dailyBalance: null;
                dailyBalanceData.forEach(element => {
                    let dailyBalanceDatas = {
                        "bank_statement_analysis__c":  String(getBankStmt.id),
                        "month__c":dailyBalances && elements.month ? String(elements.month): null,
                        "date__c":dailyBalanceData && element.dates ? new Date(element.dates): null,
                        "opening_balance__c":dailyBalanceData && element.openingBalance ? Number(element.openingBalance): null,
                        "closing_balance__c":dailyBalanceData && element.closingBalance ? Number(element.closingBalance): null,
                    }
                    dailyData.push(dailyBalanceDatas);
                });
            });
            
            await prisma.daily_balance__c.createMany({
                data: dailyData
            });

            await prisma.api_logger__c.create({
                data: {
                    request__c: String(doc_id),
                    service__c: "BANK STATEMENT ANALISIS",
                    account__c: sfid
                },
            });

            return {
                responseCode: 200,
                status: "success",
                message: "success",
                data: getdata,
                ObjBankStmt: ObjBankStmt,
                camMonthly: camMonth,
                analysisData: analyData,
                transactions: transData,
                daily: dailyData
            }
        } else {
            await prisma.custom_error__c.create({
                data: {
                    exception_message__c: JSON.stringify(getdata),
                    account__c: sfid,
                    service__c: "BANK STATEMENT ANALISIS",
                },
              });
            return{ status: "error", message: getdata.message ? getdata.message : getdata };
        }
            
        
    } catch (e) {
        return { status: "error", message: e.message ? e.message : e }
    }
}

function formatDate(DateFormat) {
    if (!DateFormat) {
        return null;
    }
    const date = new Date(DateFormat);
    return date;
}
