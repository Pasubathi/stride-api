import { prisma } from "./_base";
import moment from "moment";
import { updateAccount } from "./salesforce_api"
import { TU_HARD_PULL, PAN_CHECK, PAN_PROFILE, SOFT_PULL, D2C_BUREAU, BUREAU_LIMIT, CKYC_DETAIL, CKYC_DOWNLOAD,HARD_PULL_LIVE } from "./api";

export async function softtPull(getData) {
    try {
        const { id, first_name, last_name, mobile, sfid, tempid } = getData;
        
        const channel_id = process.env.MOB_CHANNEL_ID;
        const client_id = process.env.MOB_CLIENT_ID;
        const client_secret = process.env.MOB_CLIENT_SECRET;
        const transaction_id = Math.floor(100000 + Math.random() * 900000);
       // const external_id = String(tempid);
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("transaction_id", "ebf96f29-7174-45ad-9a51-a0f94324fe35");
        myHeaders.append("client_id", client_id);
        myHeaders.append("client_secret", client_secret);
        myHeaders.append("channel_id", channel_id);
        myHeaders.append("x-correlation-id", "8a0563ce-d236-4618-a79e-ab9a1451ebe0");
        myHeaders.append("x-user-domain", "demo-ica-apac.co.in");
        myHeaders.append("X-Screenless-Kill-Null", "true");
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "applicationin": {
            "alias": "EDVNZSM",
            "appno": "155390"
            },
            "applicant": [
            {
                "applicantin": {
                "applicantdetails": {
                    "cccid": "198724",
                    "lname": last_name,
                    "fname": first_name,
                    "mobilephone": mobile
                }
                }
            }
            ]
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        
        let loggerObj = {
            method: "POST",
            sfid: sfid,
          //  tempid: external_id,
            service: "BRE1 SOFT PULL",
            resData: raw
        }
        await apiLogger(loggerObj);
          
        const getdata = await  fetch(SOFT_PULL, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            return response;
        });
        console.log("getdata ========>", JSON.stringify(getdata));
        if (getdata.applicant) {
                let applicationoutVal = getdata.applicationout;
                let imdbfailObj = applicationoutVal.imdbfail ? applicationoutVal.imdbfail : null;
                let appData = getdata.applicant ? getdata.applicant : [];
                let appSingleData = appData.length > 0 ? appData[0] : null;
                const applicatOutData   = appSingleData && appSingleData.applicantout ? appSingleData.applicantout : null;
                const bureausurrogate   = applicatOutData && applicatOutData.bureausurrogate?applicatOutData.bureausurrogate:null;
                const inprofileresponse = applicatOutData && applicatOutData.inprofileresponse?applicatOutData.inprofileresponse: null;
                const inproHeader       = inprofileresponse && inprofileresponse.header ? inprofileresponse.header:null;
                const userMsg           = inprofileresponse && inprofileresponse.usermessage?inprofileresponse.usermessage:null;
                const creditProfile     = inprofileresponse && inprofileresponse.creditprofileheader?inprofileresponse.creditprofileheader:null;
                const curntApp          = inprofileresponse && inprofileresponse.currentapplication?inprofileresponse.currentapplication:null;
                const curntAppData      = curntApp && curntApp.currentapplicationdetails?curntApp.currentapplicationdetails:null;
                const curntApplicantData= curntAppData && curntAppData.currentapplicantdetails?curntAppData.currentapplicantdetails:null;
                const currentotherObj   = curntAppData && curntAppData.currentotherdetails?curntAppData.currentotherdetails: null;
                const currentAppAddress = curntAppData && curntAppData.currrentapplicantaddressdetails?curntAppData.currrentapplicantaddressdetails: null;
                const caisAccountObj    = inprofileresponse && inprofileresponse.caisaccount?inprofileresponse.caisaccount:null;
                const caissummaryObj    = caisAccountObj && caisAccountObj.caissummary?caisAccountObj.caissummary:null
                const creditaccountObj  = caissummaryObj && caissummaryObj.creditaccount?caissummaryObj.creditaccount: null;
                const totaloutstandingObj = caissummaryObj && caissummaryObj.totaloutstandingbalance?caissummaryObj.totaloutstandingbalance:null;
                const caisAccountDetails  = caisAccountObj &&  caisAccountObj.caisaccountdetails? caisAccountObj.caisaccountdetails: [];
                const caisaAccountRow     = caisAccountDetails && caisAccountDetails.length > 0? caisAccountDetails[0]: null;
                const caisholderData      = caisaAccountRow && caisaAccountRow.caisholderdetails?caisaAccountRow.caisholderdetails: null;
                const caisholderphoneData = caisaAccountRow && caisaAccountRow.caisholderphonedetails? caisaAccountRow.caisholderphonedetails: null;
                const caisaccountHistory  = caisaAccountRow && caisaAccountRow.caisaccounthistory?caisaAccountRow.caisaccounthistory: null;
                const caisholderaddressData = caisaAccountRow && caisaAccountRow.caisholderaddressdetails?caisaAccountRow.caisholderaddressdetails:null;
                const totalcapssummaryObj    = inprofileresponse && inprofileresponse.totalcapssummary?inprofileresponse.totalcapssummary:null;
                const capsData    = inprofileresponse && inprofileresponse.caps?inprofileresponse.caps:null;
                const capssummaryObj = capsData && capsData.capssummary?capsData.capssummary: null;
                const noncreditcapsObj = inprofileresponse && inprofileresponse.noncreditcaps?inprofileresponse.noncreditcaps:null;
                const noncreditcapssummaryObj = noncreditcapsObj && noncreditcapsObj.noncreditcapssummary ? noncreditcapsObj.noncreditcapssummary: null;


                let bureauscoreObj = imdbfailObj && imdbfailObj.bureauscore ? imdbfailObj.bureauscore : null;
                let inprofileresponseObj = bureauscoreObj && bureauscoreObj.inprofileresponse ? bureauscoreObj.inprofileresponse : null;
                let scoreObj = inprofileresponseObj && inprofileresponseObj.score ? inprofileresponseObj.score : null;
                let bureauscoreconfidlevelObj = scoreObj && scoreObj.bureauscoreconfidlevel ? scoreObj.bureauscoreconfidlevel : null;
                let noncreditcapslast180daysObj = bureauscoreconfidlevelObj && bureauscoreconfidlevelObj.noncreditcapslast180days ? bureauscoreconfidlevelObj.noncreditcapslast180days : null;
                const limit = applicatOutData && applicatOutData.ipabasisbureau ? applicatOutData.ipabasisbureau: null;
                const pan = curntApplicantData && curntApplicantData.incometaxpan?curntApplicantData.incometaxpan:null;
                const limit2 = caisaAccountRow && caisaAccountRow.highestcreditororiginalloanamount ? caisaAccountRow.highestcreditororiginalloanamount : null;
                console.log("limit ==================>", limit);
                let obj = {
                    limit: limit,
                    pan: pan
                }
                let ObjBreuResp = {
                   // "heroku_external_id__c": String(external_id),
                    "account__c": sfid,
                    "app_no__c": applicationoutVal.appno ? applicationoutVal.appno : "",
                    "derog_found__c": applicationoutVal.derogfound ? applicationoutVal.derogfound : "",
                    "imdb_fail__c": imdbfailObj.referenceNumber ? imdbfailObj.referenceNumber : "",
                    "bureau_desc__c": applicatOutData.bureaudesc ? applicatOutData.bureaudesc : "",
                    "bureau_msg__c": applicatOutData.bureaumsg ? applicatOutData.bureaumsg : "",
                    "bureau_score__c": applicatOutData.bureauscore ? String(applicatOutData.bureauscore): "",
                    //"ipa_basis_bureau__c": imdbfailObj.enquiryControlNumber ? imdbfailObj.enquiryControlNumber : "",
                    //"ipan_on_ipa__c": imdbfailObj.enquiryControlNumber ? imdbfailObj.enquiryControlNumber : "",
                    //"non_cc_tradelines__c": "",
                    "account_type__c": bureausurrogate.accounttype ? String(bureausurrogate.accounttype): "",
                    "age_in_bureau_gt_24_months__c": bureausurrogate.ageinbureaugt24months ? Number(bureausurrogate.ageinbureaugt24months) : "",
                    "credit_card_utilization__c": bureausurrogate.creditcardutilization ? Number(bureausurrogate.creditcardutilization) : null,
                    "derog_status__c": bureausurrogate.derogstatus ? String(bureausurrogate.derogstatus) : "",
                    "experian_score__c": bureausurrogate.experianscore ? String(bureausurrogate.experianscore) : "",
                    "high_sanction_amount__c": bureausurrogate.highsanctionamount ? Number(bureausurrogate.highsanctionamount) : "",
                    "mob__c": bureausurrogate.mob ? Number(bureausurrogate.mob) : "",
                    "multiplier__c": bureausurrogate.multiplier ? Number(bureausurrogate.multiplier) : null,
                    //"ninty_plus_in_last_12_months__c": bureauscoreObj.nintyplusinlast12months ?  getNumber(bureauscoreObj.nintyplusinlast12months) : 0,
                    "no_credit_card_in_180_pl_dpd__c": bureausurrogate.nocreditcardin180pldpd ?Number(bureausurrogate.nocreditcardin180pldpd) : 0,
                    "non_addon_trade_last_24mon_min_24vin__c": bureausurrogate.noofnonaddontradelinesinlast24monthswithmin24monthsvintage ? Number(bureausurrogate.noofnonaddontradelinesinlast24monthswithmin24monthsvintage) : null,
                    "secured_tradewithin_24mon_with_18rtr__c": bureausurrogate.noofsecuredtradelineswithin24monthswith18rtr ? getNumber(bureausurrogate.noofsecuredtradelineswithin24monthswith18rtr) : 0,
                    "over_due_amoun_tgt_0__c": bureausurrogate.overdueamountgt0 ? Number(bureausurrogate.overdueamountgt0) : 0,
                    "over_due_gt_5000_in_tradeline__c": bureausurrogate.overduegt5000intradeline ? Number(bureausurrogate.overduegt5000intradeline) : 0,
                    "secured_tradelines__c": bureausurrogate.securedtradeline ? bureausurrogate.securedtradeline : "",
                    "sf_will_fulde_fault_dbt_lsssma_sub__c": bureausurrogate.sfwillfuldefaultdbtlsssmasub ? Number(bureausurrogate.sfwillfuldefaultdbtlsssmasub) : 0,
                    "thick_or_thin__c": bureausurrogate.thickorthin ? bureausurrogate.thickorthin : "",
                    "thin__c": bureausurrogate.thin ? bureausurrogate.thin : "",
                    "thirty_plus_in_last_3_months__c": bureausurrogate.thirtyplusinlast3months ? Number(bureausurrogate.thirtyplusinlast3months) : 0,
                    "total_no_of_tradeline__c": bureausurrogate.totalnooftradeline ? Number(bureausurrogate.totalnooftradeline) : null,
                    "unsecured_tradelines__c": bureausurrogate.unsecuredtradeline ? bureausurrogate.unsecuredtradeline : null,
                    "unsecure_utilization_exclude_creditc__c": bureausurrogate.unsecuredutilizationexcludingcreditcards ? bureausurrogate.unsecuredutilizationexcludingcreditcards : "",
                    "zero_plus_in_last_12_months__c": bureausurrogate.zeroplusinlast12months ? Number(bureausurrogate.zeroplusinlast12months) : 0,
                    "system_code__c": inproHeader.systemcode ? Number(inproHeader.systemcode) : 0,
                    "report_date__c": inproHeader.reportdate ? new Date(inproHeader.reportdate) : null,
                    "report_time__c": inproHeader.reporttime ? inproHeader.reporttime : null,
                    "user_message_text__c": userMsg.usermessagetext ? userMsg.usermessagetext : null,
                    "enquiry_username__c": creditProfile.enquiryusername ? creditProfile.enquiryusername : null,
                    "version__c": creditProfile.version ? creditProfile.version : null,
                    "report_number__c": creditProfile.reportnumber ? Number(creditProfile.reportnumber) : 0,
                    "subscriber__c": creditProfile.subscriber ? creditProfile.subscriber : "",
                    "subscriber_name__c": creditProfile.subscribername ? creditProfile.subscribername : "",
                    "customer_reference_id__c": creditProfile.customerreferenceid ? creditProfile.customerreferenceid : "",
                    "enquiry_reason__c": curntAppData.enquiryreason ? curntAppData.enquiryreason : "",
                    "finance_purpose__c": curntAppData.financepurpose ? curntAppData.financepurpose : "",
                    "amount_financed__c": curntAppData.amountfinanced ? Number(curntAppData.amountfinanced) : 0,
                    "duration_of_agreement__c": curntAppData.durationofagreement ? Number(curntAppData.durationofagreement) : 0,
                    "credit_account_total__c": creditaccountObj.creditaccounttotal ? creditaccountObj.creditaccounttotal : "",
                    "credit_account_active__c": creditaccountObj.creditaccountactive ? creditaccountObj.creditaccountactive : "",
                    "credit_account_default__c": creditaccountObj.creditaccountdefault ? Number(creditaccountObj.creditaccountdefault) : 0,
                    "credit_account_closed__c": creditaccountObj.creditaccountclosed ? creditaccountObj.creditaccountclosed : "",
                    "cad_suit_filed_current_balance__c": creditaccountObj.cadsuitfiledcurrentbalance ? Number(creditaccountObj.cadsuitfiledcurrentbalance) : 0,
                    "out_standing_balance_secured__c": totaloutstandingObj.outstandingbalancesecured ? totaloutstandingObj.outstandingbalancesecured : "",
                    "out_standing_balance_secured_percentage__c": totaloutstandingObj.outstandingbalancesecuredpercentage ? totaloutstandingObj.outstandingbalancesecuredpercentage : "",
                    "outstanding_balance_unsecured__c": totaloutstandingObj.outstandingbalanceunsecured ? totaloutstandingObj.outstandingbalanceunsecured : "",
                    "outstanding_balance_unsecured_percentage__c": totaloutstandingObj.totaloutstandingObj ? totaloutstandingObj.outstandingbalanceunsecuredpercentage : "",
                    "outstanding_balance_all__c": totaloutstandingObj.outstandingbalanceall ? totaloutstandingObj.outstandingbalanceall : ""

                }

                console.log("obj", obj);
                console.log("ObjBreuResp", ObjBreuResp);


                let ObjApplicantDetail = {
                  //  "heroku_external_id__c": String(external_id),
                    "last_name__c": curntApplicantData && curntApplicantData.lastname ? curntApplicantData.lastname : "",
                    "first_name__c": curntApplicantData && curntApplicantData.firstname ? curntApplicantData.firstname : "",
                    "gender_code__c": curntApplicantData && curntApplicantData.gendercode ? curntApplicantData.gendercode : "",
                    "income_tax_pan__c": curntApplicantData && curntApplicantData.incometaxpan ? curntApplicantData.incometaxpan : "",
                  //  "date_of_birth_applicant__c": curntApplicantData && curntApplicantData.dateofbirthapplicant ? new Date(curntApplicantData.dateofbirthapplicant) : null,
                    "mobile_phone_number__c": curntApplicantData && curntApplicantData.mobilephonenumber ? curntApplicantData.mobilephonenumber : "",
                    "income__c": currentotherObj && currentotherObj.income ? Number(currentotherObj.income) : null,
                    "flat_no_plot_no_house_no__c": currentAppAddress && currentAppAddress.flatnoplotnohouseno ? currentAppAddress.flatnoplotnohouseno : "",
                    "city__c": currentAppAddress && currentAppAddress.city ? currentAppAddress.city : "",
                    "state__c": currentAppAddress && currentAppAddress.state ? currentAppAddress.state : "",
                    "pin_code__c": currentAppAddress && currentAppAddress.pincode ? currentAppAddress.pincode : "",
                    "country_code__c":currentAppAddress && currentAppAddress.countrycode ? currentAppAddress.countrycode : ""
                }
                console.log("ObjApplicantDetail", ObjApplicantDetail);

                const getData = await prisma.address__c.findFirst({ orderBy: { id: 'desc' } });
                let tempid = (getData.id+1).toString();
                let reqAdd =  currentAppAddress && currentAppAddress.flatnoplotnohouseno ? currentAppAddress.flatnoplotnohouseno : "";
                let addressData = {
                   // heroku_external_id__c: external_id,
                    name: "BRE1 SOFTPULL",
                    account__c: sfid,
                    country__c: currentAppAddress && currentAppAddress.countrycode ? currentAppAddress.countrycode : "",
                    state__c: currentAppAddress && currentAppAddress.state ? currentAppAddress.state : "",
                    address__c: reqAdd,
                    city__c: currentAppAddress && currentAppAddress.city ? currentAppAddress.city : "",
                    pincode__c: currentAppAddress && currentAppAddress.pincode ? currentAppAddress.pincode : "",
                };

                await prisma.address__c.create({
                    data: addressData
                });

                let ObjCaisAccountDetail = {
                  //  "heroku_external_id__c": String(external_id),
                    "identification_number__c": caisaAccountRow && caisaAccountRow.identificationnumber ? caisaAccountRow.identificationnumber : null,
                    "subscriber_name__c": caisaAccountRow && caisaAccountRow.subscribername ? caisaAccountRow.subscribername : null,
                    "account_number__c": caisaAccountRow && caisaAccountRow.accountnumber ? caisaAccountRow.accountnumber : null,
                    "portfolio_type__c": caisaAccountRow && caisaAccountRow.portfoliotype ? caisaAccountRow.portfoliotype : null,
                    "account_type__c": caisaAccountRow && caisaAccountRow.accounttype ? caisaAccountRow.accounttype : null,
                    "open_date__c": caisaAccountRow && caisaAccountRow.opendate ? new Date(caisaAccountRow.opendate) : null,
                    "highest_credit_ororiginal_loan_amount__c": caisaAccountRow && caisaAccountRow.highestcreditororiginalloanamount ? caisaAccountRow.highestcreditororiginalloanamount : null,
                    "terms_frequency__c": caisaAccountRow && caisaAccountRow.termsfrequency ? caisaAccountRow.termsfrequency : null,
                    "account_status__c": caisaAccountRow && caisaAccountRow.accountstatus ? caisaAccountRow.accountstatus : null,
                    "payment_rating__c": caisaAccountRow && caisaAccountRow.paymentrating ? Number(caisaAccountRow.paymentrating) : 0,
                    "payment_history_profile__c": caisaAccountRow && caisaAccountRow.paymenthistoryprofile ? caisaAccountRow.paymenthistoryprofile : null,
                    "current_balance__c": caisaAccountRow && caisaAccountRow.currentbalance ? caisaAccountRow.currentbalance : null,
                    "amount_past_due__c": caisaAccountRow && caisaAccountRow.amountpastdue ? Number(caisaAccountRow.amountpastdue) : 0,
                    "date_reported__c": caisaAccountRow && caisaAccountRow.datereported ? new Date(caisaAccountRow.datereported) : null,
                    "date_of_last_payment__c": caisaAccountRow && caisaAccountRow.dateoflastpayment ? new Date(caisaAccountRow.dateoflastpayment) : null,
                    "occupation_code__c": caisaAccountRow && caisaAccountRow.occupationcode ? caisaAccountRow.occupationcode : null,
                    "repayment_tenure__c": caisaAccountRow && caisaAccountRow.reppaymenttenure ? caisaAccountRow.reppaymenttenure : null,
                    "date_of_addition__c": caisaAccountRow && caisaAccountRow.dateofaddition ? new Date(caisaAccountRow.dateofaddition) : null,
                    "currency_code__c": caisaAccountRow && caisaAccountRow.currencycode ? caisaAccountRow.currencycode : null,
                    "account_holder_type_code__c": caisaAccountRow && caisaAccountRow.accountholdertypecode ? caisaAccountRow.accountholdertypecode : null,
                    "first_name_nonnormalized__c": caisholderData && caisholderData.firstnamenonnormalized ? caisholderData.firstnamenonnormalized : null,
                    "gender_code__c": caisholderData && caisholderData.gendercode ? caisholderData.gendercode : null,
                    "income_tax_pan__c": caisholderData && caisholderData.incometaxpan ? caisholderData.incometaxpan : null,
                    "date_of_birth__c": caisholderData && caisholderData.dateofbirth ? new Date(caisholderData.dateofbirth) : null,
                    "email_id__c": caisholderphoneData && caisholderphoneData.emailid ? caisholderphoneData.emailid : null,
                    "year__c": caisaccountHistory && caisaccountHistory.year ? caisaccountHistory.year : null,
                    "month__c": caisaccountHistory && caisaccountHistory.month ? caisaccountHistory.month : null,
                    "days_past_due__c": caisaccountHistory && caisaccountHistory.dayspastdue ? Number(caisaccountHistory.dayspastdue) : null,
                    "asset_classification__c": caisaccountHistory && caisaccountHistory.assetclassification ? caisaccountHistory.assetclassification : null,
                    "first_line_of_address_nonnormalized__c": caisholderaddressData && caisholderaddressData.firstlineofaddressnonnormalized ? caisholderaddressData.firstlineofaddressnonnormalized : null,
                    "second_line_of_address_nonnormalized__c": caisholderaddressData && caisholderaddressData.secondlineofaddressnonnormalized ? caisholderaddressData.secondlineofaddressnonnormalized : null,
                    "city_nonnormalized__c": caisholderaddressData && caisholderaddressData.citynonnormalized ? caisholderaddressData.citynonnormalized : null,
                    "state_nonnormalized__c": caisholderaddressData && caisholderaddressData.statenonnormalized ? caisholderaddressData.statenonnormalized : null,
                    "zip_postal_code_nonnormalized__c": caisholderaddressData && caisholderaddressData.zippostalcodenonnormalized ? caisholderaddressData.zippostalcodenonnormalized : null,
                    "country_code_nonnormalized__c": caisholderaddressData && caisholderaddressData.countrycodenonnormalized ? caisholderaddressData.countrycodenonnormalized : null,
                    "address_indicator_nonnormalized__c": caisholderaddressData && caisholderaddressData.addressindicatornonnormalized ? caisholderaddressData.addressindicatornonnormalized : null,
                    "telephone_number__c": caisholderphoneData && caisholderphoneData.telephonenumber ? caisholderphoneData.telephonenumber : null,
                    "telephone_type__c": caisholderphoneData && caisholderphoneData.telephonetype ? caisholderphoneData.telephonetype : null,
                    "total_caps_last_7_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast7days ? getNumber(totalcapssummaryObj.totalcapslast7days) : 0,
                    "total_caps_last_30_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast30days ? getNumber(totalcapssummaryObj.totalcapslast30days) : 0,
                    "total_caps_last_90_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast90days ? getNumber(totalcapssummaryObj.totalcapslast90days) : 0,
                    "total_caps_last_180_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast180days ? getNumber(totalcapssummaryObj.totalcapslast180days) : 0,
                    "caps_last_7_days__c": capssummaryObj && capssummaryObj.capslast7days ? getNumber(capssummaryObj.capslast7days) : 0,
                    "caps_last_30_days__c": capssummaryObj && capssummaryObj.capslast30days ? getNumber(capssummaryObj.capslast30days) : 0,
                    "caps_last_90_days__c": capssummaryObj && capssummaryObj.capslast90days ? getNumber(capssummaryObj.capslast90days) : 0,
                    "caps_last_180_days__c": capssummaryObj && capssummaryObj.capslast180days ? getNumber(capssummaryObj.capslast180days) : 0,
                    "non_credit_caps_last_7_days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast7days ? getNumber(noncreditcapssummaryObj.noncreditcapslast7days) : null,
                    "non_credit_caps_last_30_days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast30days ? getNumber(noncreditcapssummaryObj.noncreditcapslast30days) : null,
                    "non_credit_caps_last_90_days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast90days ? getNumber(noncreditcapssummaryObj.noncreditcapslast90days) : null,
                    "bureau_score__c": noncreditcapssummaryObj && noncreditcapssummaryObj.capslast90days ? noncreditcapssummaryObj.capslast90days : null,
                }

                console.log("ObjCaisAccountDetail", ObjCaisAccountDetail);

                const bureau_resp = await prisma.bureau_response__c.create({
                    data: ObjBreuResp
                }); 
                const appData_resp = await prisma.applicant_detail__c.create({
                    data: ObjApplicantDetail
                });

                const caiseData_resp = await prisma.cais_account_detail__c.create({
                    data: ObjCaisAccountDetail
                }); 

            return { status: "success", message: 'Success', data: obj }
        } else {
            let errorObj = {
                method: "POST",
                sfid: sfid,
                service: "BRE1 SOFT PULL",
              //  tempid: external_id,
                resData: JSON.stringify(getdata)
            }
            await customError(errorObj);
            return { status: "error", message: getdata.message ? getdata.message : getdata }
        }

    } catch (error) {
        return { status: "error", message: error.message ? error.message : error }
    }
}

export async function checkSofttPull(getData) {
    try {
        const { id, first_name, last_name, mobile, sfid, tempid } = getData;
        
        const channel_id = process.env.MOB_CHANNEL_ID;
        const client_id = process.env.MOB_CLIENT_ID;
        const client_secret = process.env.MOB_CLIENT_SECRET;
        const transaction_id = Math.floor(100000 + Math.random() * 900000);
      //  const external_id = String(tempid);
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("transaction_id", "ebf96f29-7174-45ad-9a51-a0f94324fe35");
        myHeaders.append("client_id", client_id);
        myHeaders.append("client_secret", client_secret);
        myHeaders.append("channel_id", channel_id);
        myHeaders.append("x-correlation-id", "8a0563ce-d236-4618-a79e-ab9a1451ebe0");
        myHeaders.append("x-user-domain", "demo-ica-apac.co.in");
        myHeaders.append("X-Screenless-Kill-Null", "true");
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "applicationin": {
            "alias": "EDVNZSM",
            "appno": "155390"
            },
            "applicant": [
            {
                "applicantin": {
                "applicantdetails": {
                    "cccid": "198724",
                    "lname": last_name,
                    "fname": first_name,
                    "mobilephone": mobile
                }
                }
            }
            ]
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        
        let loggerObj = {
            method: "POST",
            sfid: sfid,
            service: "BRE1 SOFT PULL",
            resData: raw
        }
        await apiLogger(loggerObj);
          
        const getdata = await  fetch(SOFT_PULL, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            return response;
        });
        console.log("getdata ========>", JSON.stringify(getdata));
        if (getdata.applicant) {
                let applicationoutVal = getdata.applicationout;
                let imdbfailObj = applicationoutVal.imdbfail ? applicationoutVal.imdbfail : null;
                let appData = getdata.applicant ? getdata.applicant : [];
                let appSingleData = appData.length > 0 ? appData[0] : null;
                const applicatOutData   = appSingleData && appSingleData.applicantout ? appSingleData.applicantout : null;
                const bureausurrogate   = applicatOutData && applicatOutData.bureausurrogate?applicatOutData.bureausurrogate:null;
                const inprofileresponse = applicatOutData && applicatOutData.inprofileresponse?applicatOutData.inprofileresponse: null;
                const inproHeader       = inprofileresponse && inprofileresponse.header ? inprofileresponse.header:null;
                const userMsg           = inprofileresponse && inprofileresponse.usermessage?inprofileresponse.usermessage:null;
                const creditProfile     = inprofileresponse && inprofileresponse.creditprofileheader?inprofileresponse.creditprofileheader:null;
                const curntApp          = inprofileresponse && inprofileresponse.currentapplication?inprofileresponse.currentapplication:null;
                const curntAppData      = curntApp && curntApp.currentapplicationdetails?curntApp.currentapplicationdetails:null;
                const curntApplicantData= curntAppData && curntAppData.currentapplicantdetails?curntAppData.currentapplicantdetails:null;
                const currentotherObj   = curntAppData && curntAppData.currentotherdetails?curntAppData.currentotherdetails: null;
                const currentAppAddress = curntAppData && curntAppData.currrentapplicantaddressdetails?curntAppData.currrentapplicantaddressdetails: null;
                const caisAccountObj    = inprofileresponse && inprofileresponse.caisaccount?inprofileresponse.caisaccount:null;
                const caissummaryObj    = caisAccountObj && caisAccountObj.caissummary?caisAccountObj.caissummary:null
                const creditaccountObj  = caissummaryObj && caissummaryObj.creditaccount?caissummaryObj.creditaccount: null;
                const totaloutstandingObj = caissummaryObj && caissummaryObj.totaloutstandingbalance?caissummaryObj.totaloutstandingbalance:null;
                const caisAccountDetails  = caisAccountObj &&  caisAccountObj.caisaccountdetails? caisAccountObj.caisaccountdetails: [];
                const caisaAccountRow     = caisAccountDetails && caisAccountDetails.length > 0? caisAccountDetails[0]: null;
                const caisholderData      = caisaAccountRow && caisaAccountRow.caisholderdetails?caisaAccountRow.caisholderdetails: null;
                const caisholderphoneData = caisaAccountRow && caisaAccountRow.caisholderphonedetails? caisaAccountRow.caisholderphonedetails: null;
                const caisaccountHistory  = caisaAccountRow && caisaAccountRow.caisaccounthistory?caisaAccountRow.caisaccounthistory: null;
                const caisholderaddressData = caisaAccountRow && caisaAccountRow.caisholderaddressdetails?caisaAccountRow.caisholderaddressdetails:null;
                const totalcapssummaryObj    = inprofileresponse && inprofileresponse.totalcapssummary?inprofileresponse.totalcapssummary:null;
                const capsData    = inprofileresponse && inprofileresponse.caps?inprofileresponse.caps:null;
                const capssummaryObj = capsData && capsData.capssummary?capsData.capssummary: null;
                const noncreditcapsObj = inprofileresponse && inprofileresponse.noncreditcaps?inprofileresponse.noncreditcaps:null;
                const noncreditcapssummaryObj = noncreditcapsObj && noncreditcapsObj.noncreditcapssummary ? noncreditcapsObj.noncreditcapssummary: null;


                let bureauscoreObj = imdbfailObj && imdbfailObj.bureauscore ? imdbfailObj.bureauscore : null;
                let inprofileresponseObj = bureauscoreObj && bureauscoreObj.inprofileresponse ? bureauscoreObj.inprofileresponse : null;
                let scoreObj = inprofileresponseObj && inprofileresponseObj.score ? inprofileresponseObj.score : null;
                let bureauscoreconfidlevelObj = scoreObj && scoreObj.bureauscoreconfidlevel ? scoreObj.bureauscoreconfidlevel : null;
                let noncreditcapslast180daysObj = bureauscoreconfidlevelObj && bureauscoreconfidlevelObj.noncreditcapslast180days ? bureauscoreconfidlevelObj.noncreditcapslast180days : null;
                const limit = applicatOutData && applicatOutData.ipabasisbureau ? applicatOutData.ipabasisbureau: null;
                const pan = curntApplicantData && curntApplicantData.incometaxpan?curntApplicantData.incometaxpan:null;
                const limit2 = caisaAccountRow && caisaAccountRow.highestcreditororiginalloanamount ? caisaAccountRow.highestcreditororiginalloanamount : null;
                console.log("limit ==================>", limit);
                let obj = {
                    limit: limit,
                    pan: pan
                }
                let ObjBreuResp = {
                    //"heroku_external_id__c": String(external_id),
                    //"ipa_basis_bureau__c": imdbfailObj.enquiryControlNumber ? imdbfailObj.enquiryControlNumber : "",
                    //"ipan_on_ipa__c": imdbfailObj.enquiryControlNumber ? imdbfailObj.enquiryControlNumber : "",
                    //"non_cc_tradelines__c": "",
                    "account__c": String(sfid),
                    "app_no__c": applicationoutVal.appno ? String(applicationoutVal.appno) : null,
                    "derog_found__c": applicationoutVal.derogfound ? String(applicationoutVal.derogfound) : null,
                    "imdb_fail__c": imdbfailObj.referenceNumber ? String(imdbfailObj.referenceNumber) : null,
                    "bureau_desc__c": applicatOutData.bureaudesc ? String(applicatOutData.bureaudesc) : null,
                    "bureau_msg__c": applicatOutData.bureaumsg ? String(applicatOutData.bureaumsg) : null,
                    "bureau_score__c": applicatOutData.bureauscore ? String(applicatOutData.bureauscore): null,
                    "account_type__c": bureausurrogate.accounttype ? String(bureausurrogate.accounttype): null,
                    "age_in_bureau_gt_24_months__c": bureausurrogate.ageinbureaugt24months ? Number(bureausurrogate.ageinbureaugt24months) : null,
                    "credit_card_utilization__c": bureausurrogate.creditcardutilization ? Number(bureausurrogate.creditcardutilization) : null,
                    "derog_status__c": bureausurrogate.derogstatus ? String(bureausurrogate.derogstatus) : null,
                    "experian_score__c": bureausurrogate.experianscore ? String(bureausurrogate.experianscore) : null,
                    "high_sanction_amount__c": bureausurrogate.highsanctionamount ? Number(bureausurrogate.highsanctionamount) : null,
                    "mob__c": bureausurrogate.mob ? Number(bureausurrogate.mob) : null,
                    "multiplier__c": bureausurrogate.multiplier ? Number(bureausurrogate.multiplier) : null,
                    "no_credit_card_in_180_pl_dpd__c": bureausurrogate.nocreditcardin180pldpd ?Number(bureausurrogate.nocreditcardin180pldpd) : null,
                    "non_addon_trade_last_24mon_min_24vin__c": bureausurrogate.noofnonaddontradelinesinlast24monthswithmin24monthsvintage ? Number(bureausurrogate.noofnonaddontradelinesinlast24monthswithmin24monthsvintage) : null,
                    "secured_tradewithin_24mon_with_18rtr__c": bureausurrogate.noofsecuredtradelineswithin24monthswith18rtr ? Number(bureausurrogate.noofsecuredtradelineswithin24monthswith18rtr) : null,
                    "over_due_amoun_tgt_0__c": bureausurrogate.overdueamountgt0 ? Number(bureausurrogate.overdueamountgt0) : null,
                    "over_due_gt_5000_in_tradeline__c": bureausurrogate.overduegt5000intradeline ? Number(bureausurrogate.overduegt5000intradeline) : null,
                    "secured_tradelines__c": bureausurrogate.securedtradeline ? String(bureausurrogate.securedtradeline) : null,
                    "sf_will_fulde_fault_dbt_lsssma_sub__c": bureausurrogate.sfwillfuldefaultdbtlsssmasub ? Number(bureausurrogate.sfwillfuldefaultdbtlsssmasub) : null,
                    "thick_or_thin__c": bureausurrogate.thickorthin ? String(bureausurrogate.thickorthin) : null,
                    "thin__c": bureausurrogate.thin ? String(bureausurrogate.thin) : null,
                    "thirty_plus_in_last_3_months__c": bureausurrogate.thirtyplusinlast3months ? Number(bureausurrogate.thirtyplusinlast3months) : null,
                    "total_no_of_tradeline__c": bureausurrogate.totalnooftradeline ? Number(bureausurrogate.totalnooftradeline) : null,
                    "unsecured_tradelines__c": bureausurrogate.unsecuredtradeline ? String(bureausurrogate.unsecuredtradeline) : null,
                    "unsecure_utilization_exclude_creditc__c": bureausurrogate.unsecuredutilizationexcludingcreditcards ? String(bureausurrogate.unsecuredutilizationexcludingcreditcards) : null,
                    "zero_plus_in_last_12_months__c": bureausurrogate.zeroplusinlast12months ? Number(bureausurrogate.zeroplusinlast12months) : null,
                    "system_code__c": inproHeader.systemcode ? Number(inproHeader.systemcode) : null,
                    "report_date__c": inproHeader.reportdate ? new Date(inproHeader.reportdate) : null,
                    "report_time__c": inproHeader.reporttime ? String(inproHeader.reporttime) : null,
                    "user_message_text__c": userMsg.usermessagetext ? String(userMsg.usermessagetext) : null,
                    "enquiry_username__c": creditProfile.enquiryusername ? String(creditProfile.enquiryusername) : null,
                    "version__c": creditProfile.version ? String(creditProfile.version) : null,
                    "report_number__c": creditProfile.reportnumber ? Number(creditProfile.reportnumber) : null,
                    "subscriber__c": creditProfile.subscriber ? String(creditProfile.subscriber) : null,
                    "subscriber_name__c": creditProfile.subscribername ? String(creditProfile.subscribername) : null,
                    "customer_reference_id__c": creditProfile.customerreferenceid ? String(creditProfile.customerreferenceid) :null,
                    "enquiry_reason__c": curntAppData.enquiryreason ? String(curntAppData.enquiryreason) : null,
                    "finance_purpose__c": curntAppData.financepurpose ? String(curntAppData.financepurpose) : null,
                    "amount_financed__c": curntAppData.amountfinanced ? Number(curntAppData.amountfinanced) : null,
                    "duration_of_agreement__c": curntAppData.durationofagreement ? Number(curntAppData.durationofagreement) : null,
                    "credit_account_total__c": creditaccountObj.creditaccounttotal ? String(creditaccountObj.creditaccounttotal) : null,
                    "credit_account_active__c": creditaccountObj.creditaccountactive ? String(creditaccountObj.creditaccountactive) : null,
                    "credit_account_default__c": creditaccountObj.creditaccountdefault ? Number(creditaccountObj.creditaccountdefault) : null,
                    "credit_account_closed__c": creditaccountObj.creditaccountclosed ?  String(creditaccountObj.creditaccountclosed) : null,
                    "cad_suit_filed_current_balance__c": creditaccountObj.cadsuitfiledcurrentbalance ? Number(creditaccountObj.cadsuitfiledcurrentbalance) : null,
                    "out_standing_balance_secured__c": totaloutstandingObj.outstandingbalancesecured ? String(totaloutstandingObj.outstandingbalancesecured) : null,
                    "out_standing_balance_secured_percentage__c": totaloutstandingObj.outstandingbalancesecuredpercentage ? String(totaloutstandingObj.outstandingbalancesecuredpercentage) : null,
                    "outstanding_balance_unsecured__c": totaloutstandingObj.outstandingbalanceunsecured ? String(totaloutstandingObj.outstandingbalanceunsecured) : null,
                    "outstanding_balance_unsecured_percentage__c": totaloutstandingObj.totaloutstandingObj ? String(totaloutstandingObj.outstandingbalanceunsecuredpercentage) : null,
                    "outstanding_balance_all__c": totaloutstandingObj.outstandingbalanceall ? String(totaloutstandingObj.outstandingbalanceall) : null

                }

                console.log("obj", obj);
                console.log("ObjBreuResp", ObjBreuResp);


                let ObjApplicantDetail = {
                   // "heroku_external_id__c": String(external_id),
                    "last_name__c": curntApplicantData && curntApplicantData.lastname ? String(curntApplicantData.lastname) : null,
                    "first_name__c": curntApplicantData && curntApplicantData.firstname ? String(curntApplicantData.firstname) : null,
                    "gender_code__c": curntApplicantData && curntApplicantData.gendercode ? String(curntApplicantData.gendercode) : null,
                    "income_tax_pan__c": curntApplicantData && curntApplicantData.incometaxpan ? String(curntApplicantData.incometaxpan) : null,
                  //  "date_of_birth_applicant__c": curntApplicantData && curntApplicantData.dateofbirthapplicant ? new Date(curntApplicantData.dateofbirthapplicant) : null,
                    "mobile_phone_number__c": curntApplicantData && curntApplicantData.mobilephonenumber ? String(curntApplicantData.mobilephonenumber) : null,
                    "income__c": currentotherObj && currentotherObj.income ? Number(currentotherObj.income) : null,
                    "flat_no_plot_no_house_no__c": currentAppAddress && currentAppAddress.flatnoplotnohouseno ? String(currentAppAddress.flatnoplotnohouseno) : null,
                    "city__c": currentAppAddress && currentAppAddress.city ? String(currentAppAddress.city) : null,
                    "state__c": currentAppAddress && currentAppAddress.state ? String(currentAppAddress.state) : null,
                    "pin_code__c": currentAppAddress && currentAppAddress.pincode ? String(currentAppAddress.pincode) : null,
                    "country_code__c":currentAppAddress && currentAppAddress.countrycode ? String(currentAppAddress.countrycode) : null
                }
                console.log("ObjApplicantDetail", ObjApplicantDetail);

                const getData = await prisma.address__c.findFirst({ orderBy: { id: 'desc' } });
                let tempid = (getData.id+1).toString();
                let reqAdd =  currentAppAddress && currentAppAddress.flatnoplotnohouseno ? currentAppAddress.flatnoplotnohouseno : "";
                let addressData = {
                  //  heroku_external_id__c: external_id,
                    name: "Softpull",
                    account__c: sfid,
                    country__c: currentAppAddress && currentAppAddress.countrycode ? String(currentAppAddress.countrycode) : null,
                    state__c: currentAppAddress && currentAppAddress.state ? String(currentAppAddress.state) : null,
                    address__c: String(reqAdd),
                    city__c: currentAppAddress && currentAppAddress.city ? String(currentAppAddress.city) : null,
                    pincode__c: currentAppAddress && currentAppAddress.pincode ? String(currentAppAddress.pincode) : null,
                };

                await prisma.address__c.create({
                    data: addressData
                });

                let ObjCaisAccountDetail = {
                  //  "heroku_external_id__c": String(external_id),
                    "identification_number__c": caisaAccountRow && caisaAccountRow.identificationnumber ? String(caisaAccountRow.identificationnumber) : null,
                    "subscriber_name__c": caisaAccountRow && caisaAccountRow.subscribername ? String(caisaAccountRow.subscribername) : null,
                    "account_number__c": caisaAccountRow && caisaAccountRow.accountnumber ? String(caisaAccountRow.accountnumber) : null,
                    "portfolio_type__c": caisaAccountRow && caisaAccountRow.portfoliotype ? String(caisaAccountRow.portfoliotype) : null,
                    "account_type__c": caisaAccountRow && caisaAccountRow.accounttype ? String(caisaAccountRow.accounttype) : null,
                    "open_date__c": caisaAccountRow && caisaAccountRow.opendate ? new Date(caisaAccountRow.opendate) : null,
                    "highest_credit_ororiginal_loan_amount__c": caisaAccountRow && caisaAccountRow.highestcreditororiginalloanamount ? String(caisaAccountRow.highestcreditororiginalloanamount) : null,
                    "terms_frequency__c": caisaAccountRow && caisaAccountRow.termsfrequency ? String(caisaAccountRow.termsfrequency) : null,
                    "account_status__c": caisaAccountRow && caisaAccountRow.accountstatus ? String(caisaAccountRow.accountstatus) : null,
                    "payment_rating__c": caisaAccountRow && caisaAccountRow.paymentrating ? Number(caisaAccountRow.paymentrating) : 0,
                    "payment_history_profile__c": caisaAccountRow && caisaAccountRow.paymenthistoryprofile ? String(caisaAccountRow.paymenthistoryprofile) : null,
                    "current_balance__c": caisaAccountRow && caisaAccountRow.currentbalance ? String(caisaAccountRow.currentbalance) : null,
                    "amount_past_due__c": caisaAccountRow && caisaAccountRow.amountpastdue ? Number(caisaAccountRow.amountpastdue) : 0,
                    "date_reported__c": caisaAccountRow && caisaAccountRow.datereported ? new Date(caisaAccountRow.datereported) : null,
                    "date_of_last_payment__c": caisaAccountRow && caisaAccountRow.dateoflastpayment ? new Date(caisaAccountRow.dateoflastpayment) : null,
                    "occupation_code__c": caisaAccountRow && caisaAccountRow.occupationcode ? String(caisaAccountRow.occupationcode) : null,
                    "repayment_tenure__c": caisaAccountRow && caisaAccountRow.reppaymenttenure ? String(caisaAccountRow.reppaymenttenure) : null,
                    "date_of_addition__c": caisaAccountRow && caisaAccountRow.dateofaddition ? new Date(caisaAccountRow.dateofaddition) : null,
                    "currency_code__c": caisaAccountRow && caisaAccountRow.currencycode ? String(caisaAccountRow.currencycode) : null,
                    "account_holder_type_code__c": caisaAccountRow && caisaAccountRow.accountholdertypecode ? String(caisaAccountRow.accountholdertypecode) : null,
                    "first_name_nonnormalized__c": caisholderData && caisholderData.firstnamenonnormalized ? String(caisholderData.firstnamenonnormalized) : null,
                    "gender_code__c": caisholderData && caisholderData.gendercode ? String(caisholderData.gendercode) : null,
                    "income_tax_pan__c": caisholderData && caisholderData.incometaxpan ? String(caisholderData.incometaxpan) : null,
                    "date_of_birth__c": caisholderData && caisholderData.dateofbirth ? new Date(caisholderData.dateofbirth) : null,
                    "email_id__c": caisholderphoneData && caisholderphoneData.emailid ? String(caisholderphoneData.emailid) : null,
                    "year__c": caisaccountHistory && caisaccountHistory.year ? String(caisaccountHistory.year) : null,
                    "month__c": caisaccountHistory && caisaccountHistory.month ? String(caisaccountHistory.month) : null,
                    "days_past_due__c": caisaccountHistory && caisaccountHistory.dayspastdue ? Number(caisaccountHistory.dayspastdue) : null,
                    "asset_classification__c": caisaccountHistory && caisaccountHistory.assetclassification ? String(caisaccountHistory.assetclassification) : null,
                    "first_line_of_address_nonnormalized__c": caisholderaddressData && caisholderaddressData.firstlineofaddressnonnormalized ? String(caisholderaddressData.firstlineofaddressnonnormalized) : null,
                    "second_line_of_address_nonnormalized__c": caisholderaddressData && caisholderaddressData.secondlineofaddressnonnormalized ? String(caisholderaddressData.secondlineofaddressnonnormalized) : null,
                    "city_nonnormalized__c": caisholderaddressData && caisholderaddressData.citynonnormalized ? String(caisholderaddressData.citynonnormalized) : null,
                    "state_nonnormalized__c": caisholderaddressData && caisholderaddressData.statenonnormalized ? String(caisholderaddressData.statenonnormalized) : null,
                    "zip_postal_code_nonnormalized__c": caisholderaddressData && caisholderaddressData.zippostalcodenonnormalized ? String(caisholderaddressData.zippostalcodenonnormalized) : null,
                    "country_code_nonnormalized__c": caisholderaddressData && caisholderaddressData.countrycodenonnormalized ? String(caisholderaddressData.countrycodenonnormalized) : null,
                    "address_indicator_nonnormalized__c": caisholderaddressData && caisholderaddressData.addressindicatornonnormalized ? String(caisholderaddressData.addressindicatornonnormalized) : null,
                    "telephone_number__c": caisholderphoneData && caisholderphoneData.telephonenumber ? String(caisholderphoneData.telephonenumber) : null,
                    "telephone_type__c": caisholderphoneData && caisholderphoneData.telephonetype ? String(caisholderphoneData.telephonetype) : null,
                    "total_caps_last_7_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast7days ? Number(totalcapssummaryObj.totalcapslast7days) : null,
                    "total_caps_last_30_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast30days ? Number(totalcapssummaryObj.totalcapslast30days) : null,
                    "total_caps_last_90_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast90days ? Number(totalcapssummaryObj.totalcapslast90days) : null,
                    "total_caps_last_180_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast180days ? Number(totalcapssummaryObj.totalcapslast180days) : null,
                    "caps_last_7_days__c": capssummaryObj && capssummaryObj.capslast7days ? Number(capssummaryObj.capslast7days) : 0,
                    "caps_last_30_days__c": capssummaryObj && capssummaryObj.capslast30days ? Number(capssummaryObj.capslast30days) : 0,
                    "caps_last_90_days__c": capssummaryObj && capssummaryObj.capslast90days ? Number(capssummaryObj.capslast90days) : 0,
                    "caps_last_180_days__c": capssummaryObj && capssummaryObj.capslast180days ? Number(capssummaryObj.capslast180days) : 0,
                    "non_credit_caps_last_7_days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast7days ? Number(noncreditcapssummaryObj.noncreditcapslast7days) : null,
                    "non_credit_caps_last_30_days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast30days ? Number(noncreditcapssummaryObj.noncreditcapslast30days) : null,
                    "non_credit_caps_last_90_days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast90days ? Number(noncreditcapssummaryObj.noncreditcapslast90days) : null,
                    "bureau_score__c": noncreditcapssummaryObj && noncreditcapssummaryObj.capslast90days ? String(noncreditcapssummaryObj.capslast90days) : null,
                }

                console.log("ObjCaisAccountDetail", ObjCaisAccountDetail);

                const bureau_resp = await prisma.bureau_response__c.create({
                    data: ObjBreuResp
                }); 
                const appData_resp = await prisma.applicant_detail__c.create({
                    data: ObjApplicantDetail
                });

                const caiseData_resp = await prisma.cais_account_detail__c.create({
                    data: ObjCaisAccountDetail
                }); 

            return { status: "success", message: 'Success', data: obj }
        } else {
            let errorObj = {
                method: "POST",
                sfid: sfid,
                service: "BRE1 SOFT PULL",
                resData: JSON.stringify(getdata)
            }
            await customError(errorObj);
            return { status: "error", message: getdata.message ? getdata.message : getdata }
        }

    } catch (error) {
        return { status: "error", message: error.message ? error.message : error }
    }
}

export async function d2c_bureaucheck(givenData) {
        try {
            const { id } = givenData;
            const accountDet = await prisma.account.findFirst({
                where: {
                    id: id
                }
            });
            if (accountDet) {
                    const addressDet = await prisma.address__c.findFirst({
                        where: {
                            account__c: accountDet.sfid
                        }
                    });
                    let data = {
                        "firstName": accountDet.first_name__c ? accountDet.first_name__c : "KUSHAL",
                        "surName": accountDet.last_name__c ? accountDet.last_name__c : "MAHAJAN",
                        "dateOfBirth": accountDet.date_of_birth_applicant__c ? formatDate(accountDet.date_of_birth_applicant__c) : "18-Jul-1985",
                        "gender": accountDet.gender__c =="male"?2:1,
                        "mobileNo": accountDet.phone ? accountDet.phone : "8299928292",
                        "email": accountDet.email__c ? accountDet.email__c : "xxxxxx@gmail.com",
                        "flatno": "C-3 582, Gokulnathan Apt, EON IT Park Rd",
                        "city": addressDet && addressDet.city__c ? addressDet.city__c : "Wakad",
                        "state": 27,
                        "pincode": Number(accountDet.pin_code__c), //412207, // addressDet && addressDet.pincode__c?addressDet.pincode__c:'412207',
                        "pan": accountDet.pan_number__c ? accountDet.pan_number__c : "BQGPM7163M",
                        "reason": "test",
                        "middleName": "",
                        "telephoneNo": "8870503155",
                        "telephoneType": 0,
                        "passport": "",
                        "voterId": "",
                        "aadhaar": "",
                        "driverLicense": "",
                        "noValidationByPass": 0,
                        "emailConditionalByPass": 1
                    }

                    const channel_id = process.env.USER_CHANNEL_ID;
                    const client_id = process.env.USER_CLIENT_ID;
                    const client_secret = process.env.USER_CLIENT_SECRET;
                    const transaction_id = Math.floor(100000 + Math.random() * 900000);
                    const headers = new Headers();
                    headers.append('channel_id', channel_id);
                    headers.append('transaction_id', transaction_id);
                    headers.append('client_id', client_id);
                    headers.append('client_secret', client_secret);
                    headers.append('content-type', 'application/json');
                    const init = {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(data)
                    };
                    let loggerObj = {
                        method: "POST",
                        sfid: accountDet.sfid,
                        service: "D2C BUREAU",
                        resData: JSON.stringify(data)
                    }
                    await apiLogger(loggerObj);
                    console.log('PanData', JSON.stringify(data));
                    const getdata = await fetch(D2C_BUREAU, init).then((response) => response.json())
                        .then((response) => {
                            return response;
                        });
                   //  console.log('D2C_BUREAU', JSON.stringify(getdata));

                    if (getdata.inProfileResponse !== undefined) {
                        let resData = getdata.inProfileResponse;
                        let fetch_limit = '';
                        //console.log('Pan', resData);
                        /*  const panDet = await prisma.pan_profile.findFirst({
                             where: {
                                 PAN_Number__c: resData.pan
                             }
                         });*/
                        const creditProfileHeader = resData.creditProfileHeader;
                        let currentApplicationData = resData.currentApplication && resData.currentApplication.currentApplicationDetails && resData.currentApplication.currentApplicationDetails ? resData.currentApplication.currentApplicationDetails : {};
                        let currentApplicantData = resData.currentApplication && resData.currentApplication.currentApplicationDetails && resData.currentApplication.currentApplicationDetails.currentApplicantDetails ? resData.currentApplication.currentApplicationDetails.currentApplicantDetails : {};
                        let currentOtherDetails = resData.currentApplication && resData.currentApplication.currentApplicationDetails && resData.currentApplication.currentApplicationDetails.currentOtherDetails ? resData.currentApplication.currentApplicationDetails.currentOtherDetails : {};
                        let currentApplicantAddressData = resData.currentApplication && resData.currentApplication.currentApplicationDetails && resData.currentApplication.currentApplicationDetails.currentApplicantAddressDetails ? resData.currentApplication.currentApplicationDetails.currentApplicantAddressDetails : {}
                       console.log("DOB", formatDate(currentApplicantData.dateOfBirthApplicant));
                        let bre_city = currentApplicantAddressData.city ? currentApplicantAddressData.city : "";
                    

                        let data = {
                            //"PAN_Number__c": currentApplicationData.incomeTaxPan,
                            "account__c": accountDet && accountDet.sfid ? accountDet.sfid: null,
                            "name": currentApplicantData.firstName ? currentApplicantData.firstName : null,
                            "subscriber_name__c": currentApplicantData.middleName1 ? currentApplicantData.middleName1 : "",
                        }
                        console.log('data------------', data)

                        const getBureRes = await prisma.bureau_response__c.create({
                            data: data
                        });
                        let caisAccountDetailsData = [];
                        let totalCapsSummary = resData.totalCapsSummary ? resData.totalCapsSummary : {};
                        let caps = resData.caps && resData.caps.capsSummary ? resData.caps.capsSummary : {};
                        let scoreValue = resData.score ? resData.score : {};
                        let nonCreditCaps = resData.nonCreditCaps && resData.nonCreditCaps.nonCreditCapsSummary ? resData.nonCreditCaps.nonCreditCapsSummary : {};
                        let caisAccountDetailsArr = resData.caisAccount && resData.caisAccount.caisAccountDetails && resData.caisAccount.caisAccountDetails.length > 0 ? resData.caisAccount.caisAccountDetails : [];
                        let occupation_code = '';
                        let bre_account_type = "";
                        let bre_account_number = "";
                        let bre_amount_past_due = 0;
                        let bre_current_balance = 0;
                        let bre_date_close = "";
                        let bre_open_date = "";
                        let bre_date_of_last_payment = "";
                        let bre_date_reported = "";
                        let bre_hight_credit_or_original_amount = 0;
                        caisAccountDetailsArr.forEach(function (el) {
                            let caisHolderDetails = {};
                            let caisAccountHistory = {};
                            let caisHolderAddressDetails = {};
                            let caisHolderPhoneDetails = {};
                            caisHolderDetails = el.caisHolderDetails ? el.caisHolderDetails : {};
                            caisAccountHistory = el.caisAccountHistory ? el.caisAccountHistory : {};
                            caisHolderAddressDetails = el.caisHolderAddressDetails ? el.caisHolderAddressDetails : {};
                            caisHolderPhoneDetails = el.caisHolderPhoneDetails ? el.caisHolderPhoneDetails : {};
                            //console.log(formatDate(el.openDate))
                            bre_open_date = el.openDate ? formatDate(el.openDate): bre_open_date;
                            caisAccountDetailsData.push({
                                "bureau_response__c": getBureRes && getBureRes.id? String(getBureRes.id):null,
                                "identification_number__c": el.identificationNumber ? el.identificationNumber : "",
                                "subscriber_name__c": el.subscriberName ? el.subscriberName : "",
                                "account_number__c": el.accountNumber ? el.accountNumber : "",
                                "portfolio_type__c": el.portfolioType ? el.portfolioType : "",
                                "account_type__c": el.accountType ? el.accountType : "",
                                "open_date__c": el.openDate ? new Date(el.openDate) : null,
                                "highest_credit_ororiginal_loan_amount__c": el.highestcreditororiginalloanamount ? el.highestcreditororiginalloanamount : "",
                                "terms_frequency__c": el.termsfrequency ? el.termsfrequency : "",
                                "account_status__c": el.accountstatus ? el.accountstatus : "",
                                "payment_rating__c": el.paymentRating ? parseInt(el.paymentRating) : 0,
                                "payment_history_profile__c": el.paymentHistoryProfile ? el.paymentHistoryProfile : "",
                                "current_balance__c": el.currentBalance ? el.currentBalance : "",
                                "amount_past_due__c": el.amountPastDue ? parseInt(el.amountPastDue) : 0,
                                "date_reported__c": el.dateReported ? new Date(el.dateReported) : null,
                                "date_of_last_payment__c": el.dateOfLastPayment ? new Date(el.dateOfLastPayment) : null,
                                "occupation_code__c": el.occupationCode ? el.occupationCode : "",
                                "repayment_tenure__c": el.repaymentTenure ? el.repaymentTenure : "",
                                "currency_code__c": el.currencyCode ? el.currencyCode : "",
                                "account_holder_type_code__c": el.accountholdertypecode ? el.accountholdertypecode : "",
                                "first_name_nonnormalized__c": caisHolderDetails.firstNameNonNormalized ? caisHolderDetails.firstNameNonNormalized : "",
                                "gender_code__c": caisHolderDetails.genderCode ? caisHolderDetails.genderCode : "",
                                "income_tax_pan__c": caisHolderDetails.incomeTaxPan ? caisHolderDetails.incomeTaxPan : "",
                                "date_of_birth__c": caisHolderDetails.dateOfBirth ? new Date(caisHolderDetails.dateOfBirth) : null,
                                //"email_id__c": caisHolderDetails.emailid ? caisHolderDetails.emailid : "",
                                "year__c": caisAccountHistory.year ? caisAccountHistory.year : "",
                                "month__c": caisAccountHistory.month ? caisAccountHistory.month : "",
                                "days_past_due__c": caisHolderDetails.daysPastDue ? parseInt(caisHolderDetails.daysPastDue) : 0,
                                //"asset_classification__c": caisHolderDetails.assetClassification ? caisHolderDetails.assetClassification : "",
                                "first_line_of_address_nonnormalized__c": caisHolderAddressDetails.firstLineOfAddressNonNormalized ? caisHolderAddressDetails.firstLineOfAddressNonNormalized : "",
                                "second_line_of_address_nonnormalized__c": caisHolderAddressDetails.secondLineOfAddressNonNormalized ? caisHolderAddressDetails.secondLineOfAddressNonNormalized : "",
                                "city_nonnormalized__c": caisHolderAddressDetails.cityNonNormalized ? caisHolderAddressDetails.cityNonNormalized : "",
                                "state_nonnormalized__c": caisHolderAddressDetails.stateNonNormalized ? caisHolderAddressDetails.stateNonNormalized : "",
                                "zip_postal_code_nonnormalized__c": caisHolderAddressDetails.zipPostalCodeNonNormalized ? caisHolderAddressDetails.zipPostalCodeNonNormalized : "",
                                "country_code_nonnormalized__c": caisHolderAddressDetails.countryCodeNonNormalized ? caisHolderAddressDetails.countryCodeNonNormalized : "",
                                "address_indicator_nonnormalized__c": caisHolderAddressDetails.addressIndicatorNonNormalized ? caisHolderAddressDetails.addressIndicatorNonNormalized : "",
                                "telephone_number__c": caisHolderPhoneDetails.telephoneNumber ? caisHolderPhoneDetails.telephoneNumber : "",
                                "telephone_type__c": caisHolderPhoneDetails.telephoneType ? caisHolderPhoneDetails.telephoneType : "",
                                "total_caps_last_7_days__c": totalCapsSummary.totalCapsLast7Days ? parseInt(totalCapsSummary.totalCapsLast7Days) : 0,
                                "total_caps_last_30_days__c": totalCapsSummary.totalCapsLast30Days ? parseInt(totalCapsSummary.totalCapsLast30Days) : 0,
                                "total_caps_last_90_days__c": totalCapsSummary.totalCapsLast90Days ? parseInt(totalCapsSummary.totalCapsLast90Days) : 0,
                                "total_caps_last_180_days__c": totalCapsSummary.totalCapsLast180Days ? parseInt(totalCapsSummary.totalCapsLast180Days) : 0,
                                "caps_last_7_days__c": caps.totalCapsLast7Days ? parseInt(caps.totalCapsLast7Days) : 0,
                                "caps_last_30_days__c": caps.totalCapsLast30Days ? parseInt(caps.totalCapsLast30Days) : 0,
                                "caps_last_90_days__c": caps.totalCapsLast90Days ? parseInt(caps.totalCapsLast90Days) : 0,
                                "caps_last_180_days__c": caps.totalCapsLast180Days ? parseInt(caps.totalCapsLast180Days) : 0,
                                "non_credit_caps_last_7_days__c": nonCreditCaps.nonCreditCapsLast7Days ? nonCreditCaps.nonCreditCapsLast7Days : null,
                                "non_credit_caps_last_30_days__c": nonCreditCaps.nonCreditCapsLast30Days ? nonCreditCaps.nonCreditCapsLast30Days : null,
                                "non_credit_caps_last_90_days__c": nonCreditCaps.nonCreditCapsLast90Days ? nonCreditCaps.nonCreditCapsLast90Days : null

                            })
                        });
                        const caisAccountDetails_resp = await prisma.cais_account_detail__c.createMany({
                            data: caisAccountDetailsData
                        })
                        let accountdetail = [];
                        caisAccountDetailsArr.forEach(function (el) {
                            
                            occupation_code = el.occupationCode ? el.occupationCode : occupation_code;
                            bre_account_type = el.accountType ? el.accountType : bre_account_type;
                            bre_account_number = el.accountNumber ? el.accountNumber : bre_account_number;
                            bre_amount_past_due = el.amountPastDue ? parseInt(el.amountPastDue) : bre_amount_past_due;
                            bre_current_balance = el.currentBalance ? parseInt(el.currentBalance) : bre_current_balance,
                            bre_date_close = el.dateClosed ? el.dateClosed: bre_date_close;
                            bre_date_of_last_payment = el.dateOfLastPayment ? el.dateOfLastPayment: bre_date_of_last_payment;
                            bre_date_reported = el.dateReported ? el.dateReported :bre_date_reported;
                            bre_hight_credit_or_original_amount = el.highestCreditOrOriginalLoanAmount ? parseInt(el.highestCreditOrOriginalLoanAmount) : bre_hight_credit_or_original_amount;
                            accountdetail.push(
                                {
                                    "accounttype": el.accountType,
                                    "accountnumber": el.accountNumber,
                                    "amountoverdue": el.amountPastDue ? parseInt(el.amountPastDue) : 0,
                                    "currentbalance": el.currentBalance ? parseInt(el.currentBalance) : 0,
                                    "dateclosed": el.dateClosed ? el.dateClosed : "",
                                    "dateoflastpayment": el.dateOfLastPayment ? el.dateOfLastPayment : "",
                                    "dateopeneddisbursed": el.dateOfFirstDelinquency ? el.dateOfFirstDelinquency : "",
                                    "datereported": el.dateReported ? el.dateReported : "",
                                    "highcreditsanctionedamount": el.highestCreditOrOriginalLoanAmount ? parseInt(el.highestCreditOrOriginalLoanAmount) : 0,
                                    "ownershipindicator": "1",
                                    "paymentfrequency": el.paymentRating ? parseInt(el.paymentRating) : 0,
                                    "paymenthistory1": "",
                                    "paymenthistory2": "",
                                    "paymenthistoryenddate": el.dateOfLastPayment ? el.dateOfLastPayment : "20200901",
                                    "paymenthistorystartdate": "20210801",
                                    "suitfiledstatus": el.suitFiledWillfulDefaultWrittenOffStatus ? el.suitFiledWillfulDefaultWrittenOffStatus : "",
                                    "wofsettledstatus": el.writtenOffSettledStatus ? el.writtenOffSettledStatus : "",
                                    "creditlimit": el.highestCreditOrOriginalLoanAmount ? parseInt(el.highestCreditOrOriginalLoanAmount) : 0,
                                    "emiamount": 0
                                }
                            )
                        })
                        let gender = currentApplicantData.genderCode=='2' ? "MALE" : "FEMALE"
                        let user_limit = bre_hight_credit_or_original_amount ?bre_hight_credit_or_original_amount : 0;

                        let bureau_limit_data = {
                            "applicationin": {
                                "appno": "261214",
                                "protectiontype": "PRINCIPAL + INTEREST PROTECTION",
                                "callsegmentation": 1,
                                "cibilsuccessful": "Y",
                                "alias": "EDVNZ",
                                "typeofsurrogateprogram": "IMDB SURROGATE PROGRAM",
                                "loanappliedstudent": 69000,
                                "noofcourses": 0,        
                                "institutememberorrecognized": 0,
                                "droppedleads": 0,
                                "instituteoperatingyears": 0,
                                "instituteaccredited": 0,
                                "operationalyearsofinstitute": 0,
                                "corporatecourse": 0,
                                "residentialcampus": 0,
                                "enachflowenabled": "N",
                                "coursetenor": 6
                            },
                            "applicant": [
                                {
                                    "applicantin": {
                                        "applicantdetails": {
                                            "cccid": "347973",
                                            "dateofbirth": currentApplicantData && currentApplicantData.dateOfBirthApplicant ? currentApplicantData.dateOfBirthApplicant : "",
                                            "incometaxpan": currentApplicantData && currentApplicantData.incomeTaxPan ? currentApplicantData.incomeTaxPan : "",
                                            "fname": currentApplicantData.firstName ? currentApplicantData.firstName : "",
                                            "lname": currentApplicantData.lastName ? currentApplicantData.lastName : "",
                                            "landmark": currentApplicantAddressData.landmark ? currentApplicantAddressData.landmark : "",
                                            "roadnonamearealocality": currentApplicantAddressData.roadNoNameAreaLocality ? currentApplicantAddressData.roadNoNameAreaLocality : "",
                                            "applicantcategory": "0",
                                            "constitution": "SALARIED",
                                            "applicanttype": "1",
                                            "relationshipwithapplicant": "0",
                                            "maritalstatus": currentOtherDetails.maritalStatus ? currentOtherDetails.maritalStatus : "",
                                            "gender": "MALE",					
                                            "coborrowerrequired": "0",
                                            "residenttype": "ZZ"
                                        },
                                        "addressdetails1": {
                                            "residencetype": "ZZ",
                                            "pincode": 591302,
                                            "addresstype": "CURRENT ADDRESS",
                                            "city": bre_city
                                        },
                                        "addressdetails2": {
                                            "residencetype": "ZZ",
                                            "pincode": 591302,
                                            "addresstype": "PERMANENT ADDRESS",
                                            "city": bre_city
                                        },
                                        "employmentdetails": {
                                            "companycategory": "ZZ",
                                            "employertype": "ZZ"
                                        },
                                        "bureau": {
                                            "enquirydetail": [
                                                {
                                                    "dateofenquiry": creditProfileHeader && creditProfileHeader.reportDate?creditProfileHeader.reportDate:'',//currentApplicationData.reportDate ? currentApplicationData.reportDate : "",
                                                    "enquirypurpose": currentApplicationData.enquiryReason ? currentApplicationData.enquiryReason : "0",
                                                    "enqiuryamount": currentApplicationData.amountFinanced ? parseInt(currentApplicationData.amountFinanced) : 0,
                                                    "membername": creditProfileHeader && creditProfileHeader.enquiryUsername ? creditProfileHeader.enquiryUsername : "",
                                                }
                                            ],
                                            "bureauemploymentdetails": {
                                                "income": currentOtherDetails.income ? parseInt(currentOtherDetails.income) : 0,
                                                "occupationcode": occupation_code
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
                                                "score": scoreValue.bureauScore ? parseInt(scoreValue.bureauScore) : 0,
                                                "cibildate": "20211012",
                                                "riskbandscore": 0
                                            },
                                            "accountdetail": [
                                                {
                                                    "accounttype": bre_account_type,
                                                    "accountnumber": bre_account_number,
                                                    "amountoverdue": 4408,
                                                    "currentbalance": bre_current_balance,
                                                    "dateclosed": bre_date_close?bre_date_close:'19000101',
                                                    "dateoflastpayment": bre_date_of_last_payment?bre_date_of_last_payment:'20210602',
                                                    "dateopeneddisbursed": "20200919",
                                                    "datereported": bre_date_reported?bre_date_reported:'20210831',
                                                    "highcreditsanctionedamount": bre_hight_credit_or_original_amount?bre_hight_credit_or_original_amount:156580,
                                                    "ownershipindicator": "1",
                                                    "paymentfrequency": 0,
                                                    "paymenthistory1": "",
                                                    "paymenthistory2": "",
                                                    "paymenthistoryenddate": "20200901",
                                                    "paymenthistorystartdate": "20210801",
                                                    "suitfiledstatus": "0",
                                                    "wofsettledstatus": "0",
                                                    "creditlimit": bre_hight_credit_or_original_amount,
                                                    "emiamount": 0  
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                        
                       // console.log("bureau_limit_data", JSON.stringify(bureau_limit_data))
                        /* const channel_id = process.env.MOB_CHANNEL_ID;
                        const client_id = process.env.MOB_CLIENT_ID;
                        const client_secret = process.env.MOB_CLIENT_SECRET;
                        const transaction_id = Math.floor(100000 + Math.random() * 900000); */
                        const headers = new Headers();
                        headers.append("transaction_id", "ebf96f29-7174-45ad-9a51-a0f94324fe35");
                        headers.append("client_id", "918e4acddf60379f8ef62a1a07ee4a14d807ab7e");
                        headers.append("client_secret", "e448ec974f91c73a23cf1d672b8ba548b34ec182");
                        headers.append("channel_id", "MOB");
                        headers.append("X-Screenless-Kill-Null", "true");
                        headers.append("x-user-domain", "demo-ica-apac.co.in");
                        headers.append("x-correlation-id", "098914ae-b335-4424-8fc0-670e5e07c424");
                        headers.append("Content-Type", "application/json");
                        headers.append("Accept", "application/json");
                        const init = {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(bureau_limit_data)
                        };
                        const get_limit_data = await fetch(BUREAU_LIMIT, init).then((response) => response.json())
                            .then((response) => {
                                return response;
                            });
                       // console.log("get_limit_data", get_limit_data);
                       
                        let loggerObj2 = {
                            method: "POST",
                            sfid: accountDet.sfid,
                            service: "BRE LIMIT 1",
                            resData: JSON.stringify(bureau_limit_data)
                        }
                        await apiLogger(loggerObj2);
                       const checkdata = await checkBreLimit(get_limit_data, accountDet.sfid);
                       user_limit = checkdata && checkdata?checkdata: user_limit;
                       return { status: "success", message: 'Success', limit: user_limit }
                    } else {
                        let errorObj = {
                            method: "POST",
                            sfid: accountDet.sfid,
                            service: "D2C BUREAU",
                            resData: JSON.stringify(getdata)
                        }
                        await customError(errorObj);
                        return { status: "error", message: getdata}
                    }
            } else {
                return { status: "error", message: "id is invalid" }
            }
        } catch (error) {
            return { status: "error", message: error.message ? error.message : error }
        }
}

export async function ckycDetails(getData) {
    const {  pan, dob } = getData
    try {

        let data = [
            {
                "recordIdentifier": "1702508",
                "applicationFormNo": "FF01",
                "branchCode": "HOBRANCH",
                "inputIdType": "C",
                "inputIdNo": "DRIPP1466D",//pan,
                "firstName": "C",
                "middleName": "DRIPP1466D",//pan,
                "lastName": "",
                "dob": "1990-12-23", //dob,
                "gender": "M",
                "apiTags": "",
                "sourceSystem": "Finacle",
                "sourceSystemSegment": "",
                "remarks": ""
            }
        ]
        const channel_id = process.env.USER_CHANNEL_ID;
        const client_id = process.env.USER_CLIENT_ID;
        const client_secret = process.env.USER_CLIENT_SECRET;
        const transaction_id = Math.floor(100000 + Math.random() * 900000);
        const headers = new Headers();
        headers.append('channel_id', channel_id);
        headers.append('transaction_id', transaction_id);
        headers.append('client_id', client_id);
        headers.append('client_secret', client_secret);
        headers.append('content-type', 'application/json');
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        };
        const getdata = await fetch(CKYC_DETAIL, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
            console.log("ckycDetails",JSON.stringify(getdata));
            let ckyc_id = '';
            let status = "";
        if (getdata.a50SearchInCkycResponse) {
            let respData = getdata.a50SearchInCkycResponse;
            let searchInCkycResponseDetailsArr = respData.searchInCkycResponseDetails ? respData.searchInCkycResponseDetails : [];
            let reqdataObj = [];
            let ckycfileDetail = [];
            let ckycIdDetailsArr =[];
            searchInCkycResponseDetailsArr.forEach(function (el) {
                reqdataObj.push({
                    "request_id__c": respData.requestId ? respData.requestId : "",
                    "parent_company__c": respData.parentCompany ? respData.parentCompany : "",
                    "transaction_id__c": el.transactionId ? el.transactionId : "",
                    "transaction_status__c": el.transactionStatus ? el.transactionStatus : "",
                    "transaction_rejection_code__c": el.transactionId ? el.transactionId : "",
                    "transaction_rejection_description__c": el.transactionId ? el.transactionId : "",
                    "branch_code__c": el.branchCode ? el.branchCode : "",
                    "record_identifier__c": el.recordIdentifier ? el.recordIdentifier : "",
                    "application_form_no__c": el.applicationFormNo ? el.applicationFormNo : "",
                    "source_system__c": el.sourceSystem ? el.sourceSystem : "",
                    "source_system_segment__c": el.transactionId ? el.transactionId : "",
                    //"api_tags__c": el.transactionId ? el.transactionId : "",
                    //"remarks__c": el.transactionId ? el.transactionId : "",
                    "ckyc_available__c": el.ckycAvailable ? el.ckycAvailable : "",
                    "ckyc_account_type__c": el.ckycAccType ? el.ckycAccType : "",
                    "ckyc_id__c": el.ckycId ? el.ckycId : "",
                    "ckyc_age__c": el.ckycAge ? el.ckycAge : "",
                    "ckyc_father_name__c": el.ckycFatherName ? el.ckycFatherName : "",
                    "ckyc_image_type__c": el.ckycPhotoImageType ? el.ckycPhotoImageType : "",
                    "ckyc_gen_date__c": el.ckycGenDate ? el.ckycGenDate : "",
                    "ckyc_name__c": el.ckycName ? el.ckycName : "",
                    //"ckyc_photo__c": el.ckycPhoto ? el.ckycPhoto : "",
                    "ckyc_request_id__c": el.ckycRequestId ? el.ckycRequestId : "",
                    "ckyc_request_date__c": el.ckycRequestDate ? el.ckycRequestDate : "",
                    "ckyc_updated_date__c": el.ckycUpdatedDate ? el.ckycUpdatedDate : "",
                    // "ckyc_photo_bytes__c" : el.ckycPhotoBytes ? el.ckycPhotoBytes : "",
                    "ckyc_remarks__c": el.ckycId ? el.ckycId : ""
                })

                ckyc_id = ckyc_id+","+el && el.ckycId ? el.ckycId:'';
                transStatus = status+","+el && el.transactionStatus ? el.transactionStatus:'';
                ckycIdDetailsArr = el.ckycIdDetails ? el.ckycIdDetails : [];
                ckycIdDetailsArr.forEach(function (cl) {
                    ckycfileDetail.push({
                        "ckyc_id_type__c": cl.ckycAvailableIdType ? cl.ckycAvailableIdType : "",
                        "ckyc_id_type_status__c": cl.ckycAvailableIdTypeStatus ? cl.ckycAvailableIdTypeStatus : "",
                        "ckyc_id_remarks__c":""
                    })
                })

            })
            console.log(ckycfileDetail);
            const ckyc_detail = await prisma.ckyc_details__c.createMany({
                data: reqdataObj
            })
            const ckyc_file_detail = await prisma.ckyc_file_details__c.createMany({
                data: ckycfileDetail
            })
            console.log("ckyc_id", ckyc_id);
            return { status: "success", message: 'Success', data: ckyc_id, "Api":"ckycDetails", "transStatus": transStatus};
        } else {
            return { status: "error", message: getdata, "Api":"ckycDetails" }
        }
    } catch (error) {
        return { status: "error", message: error.message ? error.message : error, "Api":"ckycDetails" }
    }
}

export async function ckycDetailsDownload(getData) {
    const {  ckyc_id, dob } = getData
    try {
           let year = dob.split("-");
        let data =  [
                {
                "recordIdentifier": "1702508",
                "applicationFormNo": "FF01",
                "branchCode": "HOBRANCH",
                "ckycNumber": ckyc_id,
                "dob": dob,
             //   "mobileNumber": "6088908888",
             //   "pincode": "400001",
                "birthYear": year[0],
                "apiTags": "",
                "sourceSystem": "Finacle",
                "sourceSystemSegment": "",
                "remarks": ""
                }
        ]
               
        const channel_id = process.env.USER_CHANNEL_ID;
        const client_id = process.env.USER_CLIENT_ID;
        const client_secret = process.env.USER_CLIENT_SECRET;
        const transaction_id = Math.floor(100000 + Math.random() * 900000);
        const headers = new Headers();
        headers.append('channel_id', channel_id);
        headers.append('transaction_id', transaction_id);
        headers.append('client_id', client_id);
        headers.append('client_secret', client_secret);
        headers.append('content-type', 'application/json');
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        };
        const getdata = await fetch(CKYC_DOWNLOAD, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
            console.log("getdata", JSON.stringify(getdata));
        /* if (getdata.a50SearchInCkycResponse) {
            let respData = getdata.a50SearchInCkycResponse;
            let searchInCkycResponseDetailsArr = respData.searchInCkycResponseDetails ? respData.searchInCkycResponseDetails : [];
            let reqdataObj = [];
            let ckycfileDetail = [];
            let ckycIdDetailsArr =[];
            searchInCkycResponseDetailsArr.forEach(function (el) {
                reqdataObj.push({
                    "request_id__c": respData.requestId ? respData.requestId : "",
                    "parent_company__c": respData.parentCompany ? respData.parentCompany : "",
                    "transaction_id__c": el.transactionId ? el.transactionId : "",
                    "transaction_status__c": el.transactionStatus ? el.transactionStatus : "",
                    "transaction_rejection_code__c": el.transactionId ? el.transactionId : "",
                    "transaction_rejection_description__c": el.transactionId ? el.transactionId : "",
                    "branch_code__c": el.branchCode ? el.branchCode : "",
                    "record_identifier__c": el.recordIdentifier ? el.recordIdentifier : "",
                    "application_form_no__c": el.applicationFormNo ? el.applicationFormNo : "",
                    "source_system__c": el.sourceSystem ? el.sourceSystem : "",
                    "source_system_segment__c": el.transactionId ? el.transactionId : "",
                    //"api_tags__c": el.transactionId ? el.transactionId : "",
                    //"remarks__c": el.transactionId ? el.transactionId : "",
                    "ckyc_available__c": el.ckycAvailable ? el.ckycAvailable : "",
                    "ckyc_account_type__c": el.ckycAccType ? el.ckycAccType : "",
                    "ckyc_id__c": el.ckycId ? el.ckycId : "",
                    "ckyc_age__c": el.ckycAge ? el.ckycAge : "",
                    "ckyc_father_name__c": el.ckycFatherName ? el.ckycFatherName : "",
                    "ckyc_image_type__c": el.ckycPhotoImageType ? el.ckycPhotoImageType : "",
                    "ckyc_gen_date__c": el.ckycGenDate ? el.ckycGenDate : "",
                    "ckyc_name__c": el.ckycName ? el.ckycName : "",
                    //"ckyc_photo__c": el.ckycPhoto ? el.ckycPhoto : "",
                    "ckyc_request_id__c": el.ckycRequestId ? el.ckycRequestId : "",
                    "ckyc_request_date__c": el.ckycRequestDate ? el.ckycRequestDate : "",
                    "ckyc_updated_date__c": el.ckycUpdatedDate ? el.ckycUpdatedDate : "",
                    // "ckyc_photo_bytes__c" : el.ckycPhotoBytes ? el.ckycPhotoBytes : "",
                    "ckyc_remarks__c": el.ckycId ? el.ckycId : ""
                })
               
                ckycIdDetailsArr = el.ckycIdDetails ? el.ckycIdDetails : [];
                ckycIdDetailsArr.forEach(function (cl) {
                    ckycfileDetail.push({
                        "ckyc_id_type__c": cl.ckycAvailableIdType ? cl.ckycAvailableIdType : "",
                        "ckyc_id_type_status__c": cl.ckycAvailableIdTypeStatus ? cl.ckycAvailableIdTypeStatus : "",
                        "ckyc_id_remarks__c":""
                    })
                })

            })
            console.log(ckycfileDetail);
            const ckyc_detail = await prisma.ckyc_details__c.createMany({
                data: reqdataObj
            })
            const ckyc_file_detail = await prisma.ckyc_file_details__c.createMany({
                data: ckycfileDetail
            })
            return { status: "success", message: 'Success' };
        } else {
            return { status: "error", message: getdata }
        } */
    } catch (error) {
        return { status: "error", message: error.message ? error.message : error }
    }
}

export async function bureauHardPull(getData) {
        try {
                const { sfid, external_id } = getData
                const channel_id = process.env.MOB_CHANNEL_ID;
                const client_id = process.env.MOB_CLIENT_ID;
                const client_secret = process.env.MOB_CLIENT_SECRET;
                const transaction_id = Math.floor(100000 + Math.random() * 900000);
                const externalId = external_id.toString();
                var myHeaders = new Headers();
                myHeaders.append("Accept", "application/json");
                myHeaders.append("transaction_id", "ebf96f29-7174-45ad-9a51-a0f94324fe35");
                myHeaders.append("client_id", client_id);
                myHeaders.append("client_secret", client_secret);
                myHeaders.append("channel_id", channel_id);
                myHeaders.append("x-correlation-id", "db29a1eb-e899-4419-9231-a9db491f8651");
                myHeaders.append("x-user-domain", "demo-ica-apac.co.in");
                myHeaders.append("X-Screenless-Kill-Null", "true");
                myHeaders.append("Content-Type", "application/json");
                var raw = JSON.stringify({
                    "applicationin": {
                        "cibilsuccessful": "Y",
                        "alias": "EDVNZBC",
                        "loanappliedstudent": 69000
                    },
                    "applicant": [
                        {
                        "applicantin": {
                            "applicantdetails": {
                                "incometaxpan": "BQGPM6940M",
                                "pan": "BQGPM6940M",
                                "scoreflag": "string",
                                "enquiryreason": 0,
                                "lname": "Mantri",
                                "fname": "Ram",
                                "dualpancard": "string",
                                "flatnoplotnohouseno": "101",
                                "roadnonamearealocality": "string",
                                "city": "THANE",
                                "landmark": "GARLAGUNJI KHANAPUR BELGAUM",
                                "state": "27",
                                "pincode": "444605",
                                "mobilephone": "8080100181",
                                "gender": "MALE",
                                "dateofbirth": "19900111",
                                "cccid": "198724"
                            }
                            }
                        }
                    ]
                });
                console.log("Api Request", raw);
                var requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };
                
              const getdata = await  fetch(HARD_PULL_LIVE, requestOptions)
              .then((response) => response.json())
              .then((response) => {
                  return response;
              });
              console.log("getdata", getdata);
              let loggerObj = {
                method: "POST",
                sfid: sfid?sfid:null,
                service: "HARD PULL",
                resData: String(raw)
             }
            await apiLogger(loggerObj);
           
            if (getdata.applicant) {
                let applicationoutVal = getdata.applicationout;
                let imdbfailObj = applicationoutVal.imdbfail ? applicationoutVal.imdbfail : null;
                let appData = getdata.applicant ? getdata.applicant : [];
                let appSingleData = appData.length > 0 ? appData[0] : null;
                const applicatOutData   = appSingleData && appSingleData.applicantout ? appSingleData.applicantout : null;
                const inprofileresponse = applicatOutData && applicatOutData.rawbur.inprofileresponse?applicatOutData.rawbur.inprofileresponse: null;
                const inproHeader       = inprofileresponse && inprofileresponse.header ? inprofileresponse.header:null;
                const userMsg           = inprofileresponse && inprofileresponse.usermessage?inprofileresponse.usermessage:null;
                const creditProfile     = inprofileresponse && inprofileresponse.creditprofileheader?inprofileresponse.creditprofileheader:null;
                const curntApp          = inprofileresponse && inprofileresponse.currentapplication?inprofileresponse.currentapplication:null;
                const curntAppData      = curntApp && curntApp.currentapplicationdetails?curntApp.currentapplicationdetails:null;
                const curntApplicantData= curntAppData && curntAppData.currentapplicantdetails?curntAppData.currentapplicantdetails:null;
                const currentotherObj   = curntAppData && curntAppData.currentotherdetails?curntAppData.currentotherdetails: null;
                const currentAppAddress = curntAppData && curntAppData.currrentapplicantaddressdetails?curntAppData.currrentapplicantaddressdetails: null;
                const caisAccountObj    = inprofileresponse && inprofileresponse.caisaccount?inprofileresponse.caisaccount:null;
                const caissummaryObj    = caisAccountObj && caisAccountObj.caissummary?caisAccountObj.caissummary:null
                const creditaccountObj  = caissummaryObj && caissummaryObj.creditaccount?caissummaryObj.creditaccount: null;
                const totaloutstandingObj = caissummaryObj && caissummaryObj.totaloutstandingbalance?caissummaryObj.totaloutstandingbalance:null;
                const caisAccountDetails  = caisAccountObj &&  caisAccountObj.caisaccountdetails? caisAccountObj.caisaccountdetails: [];
                const caisaAccountRow     = caisAccountDetails && caisAccountDetails.length > 0? caisAccountDetails[0]: null;
                const caisholderData      = caisaAccountRow && caisaAccountRow.caisholderdetails?caisaAccountRow.caisholderdetails: null;
                const caisholderIdData      = caisaAccountRow && caisaAccountRow.caisholderiddetails?caisaAccountRow.caisholderiddetails: null;
                const caisholderphoneData = caisaAccountRow && caisaAccountRow.caisholderphonedetails? caisaAccountRow.caisholderphonedetails: null;
                const caisaccountHistory  = caisaAccountRow && caisaAccountRow.caisaccounthistory?caisaAccountRow.caisaccounthistory: null;
                const caisholderaddressData = caisaAccountRow && caisaAccountRow.caisholderaddressdetails?caisaAccountRow.caisholderaddressdetails:null;
                const totalcapssummaryObj    = inprofileresponse && inprofileresponse.totalcapssummary?inprofileresponse.totalcapssummary:null;
                const capsData    = inprofileresponse && inprofileresponse.caps?inprofileresponse.caps:null;
                const capssummaryObj = capsData && capsData.capssummary?capsData.capssummary: null;
                const capsAppData = capsData && capsData.capsapplicationdetails.length > 0?capsData.capsapplicationdetails[0]: null;
                const capsApplicantData = capsAppData && capsAppData.capsapplicantdetails ? capsAppData.capsapplicantdetails: null;
                const capsOtherData = capsAppData && capsAppData.capsotherdetails ? capsAppData.capsotherdetails: null;
                const capsAddressData = capsAppData && capsAppData.capsapplicantaddressdetails ? capsAppData.capsapplicantaddressdetails: null;
                const noncreditcapsObj = inprofileresponse && inprofileresponse.noncreditcaps?inprofileresponse.noncreditcaps:null;
                const noncreditcapssummaryObj = noncreditcapsObj && noncreditcapsObj.noncreditcapssummary ? noncreditcapsObj.noncreditcapssummary: null;
                const capsNonAppData = noncreditcapsObj && noncreditcapsObj.capsapplicationdetails.length > 0?noncreditcapsObj.capsapplicationdetails[0]: null;
                const capsNonApplicantData = capsNonAppData && capsNonAppData.capsapplicantdetails ? capsNonAppData.capsapplicantdetails: null;
                const capsNonOtherData = capsNonAppData && capsNonAppData.capsotherdetails ? capsNonAppData.capsotherdetails: null;
                const capsNonAddressData = capsNonAppData && capsNonAppData.capsapplicantaddressdetails ? capsNonAppData.capsapplicantaddressdetails: null;
                const score       = inprofileresponse && inprofileresponse.score ? inprofileresponse.score:null;

               

                let ObjBreuResp = {
                    "account__c": sfid?sfid:'',
                    //"heroku_external_id__c": externalId?externalId:'',
                    //"application_id__c": applicationoutVal && applicationoutVal.applicationid ? applicationoutVal.applicationid : "",
                    //"application_status__c": applicationoutVal && applicationoutVal.applicationstatus ? applicationoutVal.applicationstatus : "",
                    //"application_work_list__c": applicationoutVal && applicationoutVal.applicationworklist ? applicationoutVal.applicationworklist : "",
                    //"error_count__c": applicationoutVal && applicationoutVal.errorcount ? applicationoutVal.errorcount : "",
                    //"application_update_date__c": applicationoutVal && applicationoutVal.applicationupdatedate ? applicationoutVal.applicationupdatedate : "",
                    //"aapplication_update_time__c":  applicationoutVal && applicationoutVal.applicationupdatetime ? applicationoutVal.applicationupdatetime : "",
                    //"bureau_desc__c": applicatOutData.rawbur.bureaudesc ? applicatOutData.rawbur.bureaudesc : "",
                    //"bureau_msg__c": applicatOutData.rawbur.bureaumsg ? applicatOutData.rawbur.bureaumsg : "",
                    "system_code__c": inproHeader && inproHeader.systemcode ? getNumber(inproHeader.systemcode) : 0,
                    //"message_text__c": inproHeader && inproHeader.messagetext ? inproHeader.messagetext : null,
                    "report_date__c": inproHeader && inproHeader.reportdate ? formatDate(inproHeader.reportdate) : new Date(),
                    "report_time__c": inproHeader && inproHeader.reporttime ? inproHeader.reporttime : null,
                    "user_message_text__c": userMsg && userMsg.usermessagetext ? userMsg.usermessagetext : null,
                    "enquiry_username__c": creditProfile && creditProfile.enquiryusername ? creditProfile.enquiryusername : null,
                    "version__c": creditProfile && creditProfile.version ? creditProfile.version : null,
                    "report_number__c": creditProfile && creditProfile.reportnumber ? getNumber(creditProfile.reportnumber) : 0,
                    //"subscriber__c": creditProfile && creditProfile.subscriber ? creditProfile.subscriber : "",
                    "subscriber_name__c": creditProfile && creditProfile.subscribername ? creditProfile.subscribername : "",
                    //"customer_reference_id__c": creditProfile && creditProfile.customerreferenceid ? creditProfile.customerreferenceid : "",
                    "enquiry_reason__c": curntAppData && curntAppData.enquiryreason ? curntAppData.enquiryreason : "",
                    "finance_purpose__c": curntAppData && curntAppData.financepurpose ? curntAppData.financepurpose : "",
                    "amount_financed__c": curntAppData && curntAppData.amountfinanced ? getNumber(curntAppData.amountfinanced) : 0,
                    "duration_of_agreement__c": curntAppData && curntAppData.durationofagreement ? getNumber(curntAppData.durationofagreement) : 0,
                    //"current_applicant_addition_address__c": curntAppData && curntAppData.currentapplicantadditionaladdressdetails ? curntAppData.currentapplicantadditionaladdressdetails : "",
                    "credit_account_total__c": creditaccountObj && creditaccountObj.creditaccounttotal ? creditaccountObj.creditaccounttotal : "",
                    "credit_account_active__c": creditaccountObj && creditaccountObj.creditaccountactive ? creditaccountObj.creditaccountactive : "",
                    "credit_account_default__c": creditaccountObj && creditaccountObj.creditaccountdefault ? getNumber(creditaccountObj.creditaccountdefault) : 0,
                    "credit_account_closed__c": creditaccountObj && creditaccountObj.creditaccountclosed ? creditaccountObj.creditaccountclosed : "",
                    "cad_suit_filed_current_balance__c": creditaccountObj && creditaccountObj.cadsuitfiledcurrentbalance ? getNumber(creditaccountObj.cadsuitfiledcurrentbalance) : 0,
                    "out_standing_balance_secured__c": totaloutstandingObj && totaloutstandingObj.outstandingbalancesecured ? totaloutstandingObj.outstandingbalancesecured : "",
                    "out_standing_balance_secured_percentage__c": totaloutstandingObj && totaloutstandingObj.outstandingbalancesecuredpercentage ? totaloutstandingObj.outstandingbalancesecuredpercentage : "",
                    "outstanding_balance_unsecured__c": totaloutstandingObj && totaloutstandingObj.outstandingbalanceunsecured ? totaloutstandingObj.outstandingbalanceunsecured : "",
                    "outstanding_balance_unsecured_percentage__c": totaloutstandingObj && totaloutstandingObj.totaloutstandingObj ? totaloutstandingObj.outstandingbalanceunsecuredpercentage : "",
                    "outstanding_balance_all__c": totaloutstandingObj && totaloutstandingObj.outstandingbalanceall ? totaloutstandingObj.outstandingbalanceall : "",   

                }

                console.log("bureau_response__c", ObjBreuResp);

                const bureau_resp = await prisma.bureau_response__c.create({
                    data: ObjBreuResp
                }); 

                //console.log("LID",bureau_resp.id);
 
                let ObjApplicantDetail = {
                    //"heroku_external_id__c": externalId?externalId:'',
                    "last_name__c": curntApplicantData && curntApplicantData.lastname ? curntApplicantData.lastname : "",
                    "first_name__c": curntApplicantData && curntApplicantData.firstname ? curntApplicantData.firstname : "",
                    "middle_name_1__c": curntApplicantData && curntApplicantData.middlename1 ? curntApplicantData.middlename1 : "",
                    "middle_name_2__c": curntApplicantData && curntApplicantData.middlename2 ? curntApplicantData.middlename2 : "",
                    "middle_name_3__c": curntApplicantData && curntApplicantData.middlename3 ? curntApplicantData.middlename3 : "",
                    "gender_code__c": curntApplicantData && curntApplicantData.gendercode ? curntApplicantData.gendercode : "",
                    "income_tax_pan__c": curntApplicantData && curntApplicantData.incometaxpan ? curntApplicantData.incometaxpan : "",
                    "pan_issue_date__c": curntApplicantData && curntApplicantData.panissuedate ? formatDate(curntApplicantData.panissuedate) : null,
                    "pan_expiration_date__c": curntApplicantData && curntApplicantData.panexpirationdate ? formatDate(curntApplicantData.panexpirationdate) : null,
                    "passport_number__c": curntApplicantData && curntApplicantData.passportnumber ? curntApplicantData.passportnumber : "",
                    "passport_issue_date__c": curntApplicantData && curntApplicantData.passportissuedate ? formatDate(curntApplicantData.passportissuedate) : null,
                    "passport_expiration_date__c": curntApplicantData && curntApplicantData.passportexpirationdate ? formatDate(curntApplicantData.passportexpirationdate) : null,
                    "voters_identity_card__c": curntApplicantData && curntApplicantData.votersidentitycard ? curntApplicantData.votersidentitycard : "",
                    "voter_id_issue_date__c": curntApplicantData && curntApplicantData.voteridissuedate ? formatDate(curntApplicantData.voteridissuedate) : null,
                    "voter_id_expiration_date__c": curntApplicantData && curntApplicantData.voteridexpirationdate ? formatDate(curntApplicantData.voteridexpirationdate) : null,
                  //  "driver_license_number__c": curntApplicantData && curntApplicantData.driverlicensenumber ? curntApplicantData.driverlicensenumber : "",
                    "driver_license_issue_date__c": curntApplicantData && curntApplicantData.driverlicenseissuedate ? formatDate(curntApplicantData.driverlicenseissuedate) : null,
                    "driver_license_expiration_date__c": curntApplicantData && curntApplicantData.driverlicenseexpirationdate ? formatDate(curntApplicantData.driverlicenseexpirationdate) : null,
                    "ration_card_number__c": curntApplicantData && curntApplicantData.rationcardnumber ? curntApplicantData.rationcardnumber : "",
                    "ration_card_issue_date__c": curntApplicantData && curntApplicantData.rationcardissuedate ? formatDate(curntApplicantData.rationcardissuedate) : null,
                    "ration_card_expiration_date__c": curntApplicantData && curntApplicantData.rationcardexpirationdate ? formatDate(curntApplicantData.rationcardexpirationdate) : null,
                    "universal_id_number__c": curntApplicantData && curntApplicantData.universalidnumber ? curntApplicantData.universalidnumber : "",
                    "universal_id_issue_date__c": curntApplicantData && curntApplicantData.universalidissuedate ? formatDate(curntApplicantData.universalidissuedate) : null,
                    "universal_id_expiration_date__c": curntApplicantData && curntApplicantData.universalidexpirationdate ? formatDate(curntApplicantData.universalidexpirationdate) : null,
                    "date_of_birth_applicant__c": curntApplicantData && curntApplicantData.dateofbirthapplicant ? formatDate(curntApplicantData.dateofbirthapplicant) : null,
                    "telephone_number_applicant_lst__c": curntApplicantData && curntApplicantData.telephonenumberapplicant1st ? curntApplicantData.telephonenumberapplicant1st : "",
                    "telephone_extension__c": curntApplicantData && curntApplicantData.telephoneextension ? curntApplicantData.telephoneextension : "",
                    "telephone_type__c": curntApplicantData && curntApplicantData.telephonetype ? curntApplicantData.telephonetype : "",
                    "mobile_phone_number__c": curntApplicantData && curntApplicantData.mobilephonenumber ? curntApplicantData.mobilephonenumber : "",
                    "email_id__c": curntApplicantData && curntApplicantData.emailid ? curntApplicantData.emailid : "",
                    "income__c": currentotherObj && currentotherObj.income ? getNumber(currentotherObj.income) : 0,
                    "marital_status__c": currentotherObj && currentotherObj.maritalstatus ? currentotherObj.maritalstatus : "",
                    "employment_status__c": currentotherObj && currentotherObj.employmentstatus ? currentotherObj.employmentstatus : "",
                    "time_with_employer__c": currentotherObj && currentotherObj.timewithemployer ? currentotherObj.timewithemployer : "",
                    "number_of_major_credit_card_held__c": currentotherObj && currentotherObj.numberofmajorcreditcardheld ? currentotherObj.numberofmajorcreditcardheld : "",
                    "flat_no_plot_no_house_no__c": currentAppAddress && currentAppAddress.flatnoplotnohouseno ? currentAppAddress.flatnoplotnohouseno : "",
                    "bldg_no_society_name__c": currentAppAddress && currentAppAddress.bldgnosocietyname ? currentAppAddress.bldgnosocietyname : "",
                    "road_no_name_area_locality__c": currentAppAddress && currentAppAddress.roadnonamearealocality ? currentAppAddress.roadnonamearealocality : "",
                    "landmark__c": currentAppAddress && currentAppAddress.landmark ? currentAppAddress.landmark : "",
                    "city__c": currentAppAddress && currentAppAddress.city ? currentAppAddress.city : "",
                    "state__c": currentAppAddress && currentAppAddress.state ? currentAppAddress.state : "",
                    "pin_code__c": currentAppAddress && currentAppAddress.pincode ? currentAppAddress.pincode : "",
                    "country_code__c":currentAppAddress && currentAppAddress.countrycode ? currentAppAddress.countrycode : ""
                }
                console.log("ObjApplicantDetail", ObjApplicantDetail);

                const appData_resp = await prisma.applicant_detail__c.create({
                    data: ObjApplicantDetail
                });

               // console.log("ADID", appData_resp);

                 /*const getData = await prisma.address__c.findFirst({ orderBy: { id: 'desc' } });
                let tempid = (getData.id+1).toString();
                let reqAdd =  currentAppAddress && currentAppAddress.flatnoplotnohouseno ? currentAppAddress.flatnoplotnohouseno : "";
                let addressData = {
                    heroku_external_id__c: tempid,
                    name: "Softpull",
                    account__c: '',
                    address__c: reqAdd,
                    city__c: currentAppAddress && currentAppAddress.city ? currentAppAddress.city : "",
                    pincode__c: currentAppAddress && currentAppAddress.pincode ? currentAppAddress.pincode : "",
                };

               await prisma.address__c.create({
                    data: addressData
                });*/

                let ObjCaisAccountDetail = {
                   //"heroku_external_id__c": externalId?externalId:'',
                    "identification_number__c": caisaAccountRow && caisaAccountRow.identificationnumber ? caisaAccountRow.identificationnumber : null,
                    "subscriber_name__c": caisaAccountRow && caisaAccountRow.subscribername ? caisaAccountRow.subscribername : null,
                    "account_number__c": caisaAccountRow && caisaAccountRow.accountnumber ? caisaAccountRow.accountnumber : null,
                    "portfolio_type__c": caisaAccountRow && caisaAccountRow.portfoliotype ? caisaAccountRow.portfoliotype : null,
                    "account_type__c": caisaAccountRow && caisaAccountRow.accounttype ? caisaAccountRow.accounttype : null,
                    "open_date__c": caisaAccountRow && caisaAccountRow.opendate ? formatDate(caisaAccountRow.opendate) : new Date(),
                    "highest_credit_ororiginal_loan_amount__c": caisaAccountRow && caisaAccountRow.highestcreditororiginalloanamount ? caisaAccountRow.highestcreditororiginalloanamount : null,
                    "terms_frequency__c": caisaAccountRow && caisaAccountRow.termsfrequency ? caisaAccountRow.termsfrequency : null,
                    "scheduled_monthly_payment_amount__c": caisaAccountRow && caisaAccountRow.scheduledmonthlypaymentamount ? caisaAccountRow.scheduledmonthlypaymentamount : null,
                    "account_status__c": caisaAccountRow && caisaAccountRow.accountstatus ? caisaAccountRow.accountstatus : null,
                    "payment_rating__c": caisaAccountRow && caisaAccountRow.paymentrating ? getNumber(caisaAccountRow.paymentrating) : 0,
                    "payment_history_profile__c": caisaAccountRow && caisaAccountRow.paymenthistoryprofile ? caisaAccountRow.paymenthistoryprofile : null,
                    "special_comment__c": caisaAccountRow && caisaAccountRow.specialcomment ? caisaAccountRow.specialcomment : null,
                    "current_balance__c": caisaAccountRow && caisaAccountRow.currentbalance ? caisaAccountRow.currentbalance : null,
                    "amount_past_due__c": caisaAccountRow && caisaAccountRow.amountpastdue ? getNumber(caisaAccountRow.amountpastdue) : 0,
                    "original_charge_off_amount__c": caisaAccountRow && caisaAccountRow.originalchargeoffamount ? getNumber(caisaAccountRow.originalchargeoffamount) : null,
                    "date_closed__c": caisaAccountRow && caisaAccountRow.dateclosed ? formatDate(caisaAccountRow.dateclosed) : null,
                    
                    "date_reported__c": caisaAccountRow && caisaAccountRow.datereported ? formatDate(caisaAccountRow.datereported) : null,
                    "date_of_last_payment__c": caisaAccountRow && caisaAccountRow.dateoflastpayment ? formatDate(caisaAccountRow.dateoflastpayment) : null,
                    "occupation_code__c": caisaAccountRow && caisaAccountRow.occupationcode ? caisaAccountRow.occupationcode : null,
                    "repayment_tenure__c": caisaAccountRow && caisaAccountRow.reppaymenttenure ? caisaAccountRow.reppaymenttenure : null,
                    "date_of_addition__c": caisaAccountRow && caisaAccountRow.dateofaddition ? formatDate(caisaAccountRow.dateofaddition) : null,
                    "currency_code__c": caisaAccountRow && caisaAccountRow.currencycode ? caisaAccountRow.currencycode : null,
                    "account_holder_type_code__c": caisaAccountRow && caisaAccountRow.accountholdertypecode ? caisaAccountRow.accountholdertypecode : null,
                    "first_name_nonnormalized__c": caisholderData && caisholderData.firstnamenonnormalized ? caisholderData.firstnamenonnormalized : null,
                    "gender_code__c": caisholderData && caisholderData.gendercode ? caisholderData.gendercode : null,
                    "income_tax_pan__c": caisholderData && caisholderData.incometaxpan ? caisholderData.incometaxpan : null,
                    "pan_issue_date__c": caisholderIdData && caisholderIdData.panissuedate ? formatDate(caisholderIdData.panissuedate) : null,
                    "pan_expiration_date__c": caisholderIdData && caisholderIdData.panexpirationdate ? formatDate(caisholderIdData.panexpirationdate) : null,
                   // "driver_license_number__c": caisholderIdData && caisholderIdData.driverlicensenumber ? caisholderIdData.driverlicensenumber : "",
                    "driver_license_issue_date__c": caisholderIdData && caisholderIdData.driverlicenseissuedate ? formatDate(caisholderIdData.driverlicenseissuedate) : null,
                    "driver_license_expiration_date__c":caisholderIdData && caisholderIdData.driverlicenseexpirationdate ? formatDate(caisholderIdData.driverlicenseexpirationdate) : null,
                    "date_of_birth__c": caisholderData && caisholderData.dateofbirth ? formatDate(caisholderData.dateofbirth) : null,
                    "email_id__c": caisholderphoneData && caisholderphoneData.emailid ? caisholderphoneData.emailid : null,
                    "year__c": caisaccountHistory && caisaccountHistory.year ? caisaccountHistory.year : null,
                    "month__c": caisaccountHistory && caisaccountHistory.month ? caisaccountHistory.month : null,
                    "days_past_due__c": caisaccountHistory && caisaccountHistory.dayspastdue ? getNumber(caisaccountHistory.dayspastdue) : null,
                    "asset_classification__c": caisaccountHistory && caisaccountHistory.assetclassification ? caisaccountHistory.assetclassification : null,
                    "first_line_of_address_nonnormalized__c": caisholderaddressData && caisholderaddressData.firstlineofaddressnonnormalized ? caisholderaddressData.firstlineofaddressnonnormalized : null,
                    "second_line_of_address_nonnormalized__c": caisholderaddressData && caisholderaddressData.secondlineofaddressnonnormalized ? caisholderaddressData.secondlineofaddressnonnormalized : null,
                    "third_line_of_address_nonnormalized__c": caisholderaddressData && caisholderaddressData.thirdlineofaddressnonnormalized ? caisholderaddressData.thirdlineofaddressnonnormalized : null,
                    "city_nonnormalized__c": caisholderaddressData && caisholderaddressData.citynonnormalized ? caisholderaddressData.citynonnormalized : null,
                    "state_nonnormalized__c": caisholderaddressData && caisholderaddressData.statenonnormalized ? caisholderaddressData.statenonnormalized : null,
                    "fifth_line_of_address_nonnormalized__c": caisholderaddressData && caisholderaddressData.thirdlineofaddressnonnormalized ? caisholderaddressData.fifthlineofaddressnonnormalized : null,
                    "zip_postal_code_nonnormalized__c": caisholderaddressData && caisholderaddressData.zippostalcodenonnormalized ? caisholderaddressData.zippostalcodenonnormalized : null,
                    "country_code_nonnormalized__c": caisholderaddressData && caisholderaddressData.countrycodenonnormalized ? caisholderaddressData.countrycodenonnormalized : null,
                    "address_indicator_nonnormalized__c": caisholderaddressData && caisholderaddressData.addressindicatornonnormalized ? caisholderaddressData.addressindicatornonnormalized : null,
                    "residence_code_nonnormalized__c": caisholderaddressData && caisholderaddressData.residencecodenonnormalized ? caisholderaddressData.residencecodenonnormalized : null,
                    "telephone_number__c": caisholderphoneData && caisholderphoneData.telephonenumber ? caisholderphoneData.telephonenumber : null,
                    "telephone_type__c": caisholderphoneData && caisholderphoneData.telephonetype ? caisholderphoneData.telephonetype : null,
                    "total_caps_last_7_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast7days ? getNumber(totalcapssummaryObj.totalcapslast7days) : 0,
                    "total_caps_last_30_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast30days ? getNumber(totalcapssummaryObj.totalcapslast30days) : 0,
                    "total_caps_last_90_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast90days ? getNumber(totalcapssummaryObj.totalcapslast90days) : 0,
                    "total_caps_last_180_days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast180days ? getNumber(totalcapssummaryObj.totalcapslast180days) : 0,
                    "caps_last_7_days__c": capssummaryObj && capssummaryObj.capslast7days ? getNumber(capssummaryObj.capslast7days) : 0,
                    "caps_last_30_days__c": capssummaryObj && capssummaryObj.capslast30days ? getNumber(capssummaryObj.capslast30days) : 0,
                    "caps_last_90_days__c": capssummaryObj && capssummaryObj.capslast90days ? getNumber(capssummaryObj.capslast90days) : 0,
                    "caps_last_180_days__c": capssummaryObj && capssummaryObj.capslast180days ? getNumber(capssummaryObj.capslast180days) : 0,
                    "non_credit_caps_last_7_days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast7days ? getNumber(noncreditcapssummaryObj.noncreditcapslast7days) : null,
                    "non_credit_caps_last_30_days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast30days ? getNumber(noncreditcapssummaryObj.noncreditcapslast30days) : null,
                    "non_credit_caps_last_90_days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast90days ? getNumber(noncreditcapssummaryObj.noncreditcapslast90days) : null,
                    "non_credit_caps_last_180_days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast180days ? getNumber(noncreditcapssummaryObj.noncreditcapslast180days) : null,
                    "bureau_score__c": score && score.bureauscore ? score.bureauscore : null,
                    "bureau_score_confid_level__c": score && score.bureauscoreconfidlevel ? score.bureauscoreconfidlevel : null,
                }

               /*  let ObjCaisAccountDetail = {
                    "identification_number__c": caisaAccountRow && caisaAccountRow.identificationnumber ? caisaAccountRow.identificationnumber : null,
                    "subscriber_name__c": caisaAccountRow && caisaAccountRow.subscribername ? caisaAccountRow.subscribername : null,
                    "Account_Number__c": caisaAccountRow && caisaAccountRow.accountnumber ? caisaAccountRow.accountnumber : null,
                    "Portfolio_Type__c": caisaAccountRow && caisaAccountRow.portfoliotype ? caisaAccountRow.portfoliotype : null,
                    "Account_Type__c": caisaAccountRow && caisaAccountRow.accounttype ? caisaAccountRow.accounttype : null,
                    "Open_Date__c": caisaAccountRow && caisaAccountRow.opendate ? formatDate(caisaAccountRow.opendate) : null,
                    "Credit_Limit_Amount__c": caisaAccountRow && caisaAccountRow.creditlimitamount ? caisaAccountRow.creditlimitamount : 0,
                    "Highest_Credit_Ororiginal_Loan_Amount__c": caisaAccountRow && caisaAccountRow.highestcreditororiginalloanamount ? caisaAccountRow.highestcreditororiginalloanamount : null,
                    "Terms_Frequency__c": caisaAccountRow && caisaAccountRow.termsfrequency ? caisaAccountRow.termsfrequency : null,
                    "Scheduled_Monthly_Payment_Amount__c": caisaAccountRow && caisaAccountRow.scheduledmonthlypaymentamount ? caisaAccountRow.scheduledmonthlypaymentamount : null,
                    "Account_Status__c": caisaAccountRow && caisaAccountRow.accountstatus ? caisaAccountRow.accountstatus : null,
                    "Payment_Rating__c": caisaAccountRow && caisaAccountRow.paymentrating ? getNumber(caisaAccountRow.paymentrating) : 0,
                    "Payment_History_Profile__c": caisaAccountRow && caisaAccountRow.paymenthistoryprofile ? caisaAccountRow.paymenthistoryprofile : null,
                    "Special_Comment__c": caisaAccountRow && caisaAccountRow.specialcomment ? caisaAccountRow.specialcomment : null,
                    "Current_Balance__c": caisaAccountRow && caisaAccountRow.currentbalance ? caisaAccountRow.currentbalance : null,
                    "Amount_Past_Due__c": caisaAccountRow && caisaAccountRow.amountpastdue ? getNumber(caisaAccountRow.amountpastdue) : 0,
                    "Original_Charge_Off_Amount__c": caisaAccountRow && caisaAccountRow.originalchargeoffamount ? getNumber(caisaAccountRow.originalchargeoffamount) : null,
                    "Date_Closed__c": caisaAccountRow && caisaAccountRow.dateclosed ? formatDate(caisaAccountRow.dateclosed) : null,
                    "Date_Reported__c": caisaAccountRow && caisaAccountRow.datereported ? formatDate(caisaAccountRow.datereported) : null,
                    "Date_Of_Last_Payment__c": caisaAccountRow && caisaAccountRow.dateoflastpayment ? formatDate(caisaAccountRow.dateoflastpayment) : null,
                    
                    "Suit_Filed_Will_Ful_Default_Written_Off__c": caisaAccountRow && caisaAccountRow.suitfiledwillfuldefaultwrittenoffstatus ? caisaAccountRow.suitfiledwillfuldefaultwrittenoffstatus : null,
                    "Suit_Filed_Wilful_Default__c": caisaAccountRow && caisaAccountRow.suitfiledwilfuldefault ? caisaAccountRow.suitfiledwilfuldefault : null,
                    "Written_Off_Settled_Status__c": caisaAccountRow && caisaAccountRow.writtenoffsettledstatus ? caisaAccountRow.writtenoffsettledstatus : null,
                    "Value_Of_Credit_Last_Month__c": caisaAccountRow && caisaAccountRow.valueofcreditslastmonth ? caisaAccountRow.valueofcreditslastmonth : null,
                    "Occupation_Code__c": caisaAccountRow && caisaAccountRow.occupationcode ? caisaAccountRow.occupationcode : null,
                    "Settlement_Amount__c": caisaAccountRow && caisaAccountRow.settlementamount ? caisaAccountRow.settlementamount : null,
                    "Value_Of_Collateral__c": caisaAccountRow && caisaAccountRow.valueofcollateral ? caisaAccountRow.valueofcollateral : null,
                    "Type_Of_Collateral__c": caisaAccountRow && caisaAccountRow.typeofcollateral ? caisaAccountRow.typeofcollateral : null,
                    "Written_Off_Amount_Total__c": caisaAccountRow && caisaAccountRow.writtenoffamttotal ? caisaAccountRow.writtenoffamttotal : null,
                    "Written_Off_Amount_Principal__c": caisaAccountRow && caisaAccountRow.writtenoffamtprincipal ? caisaAccountRow.writtenoffamtprincipal : null,
                    "Rate_Of_Interest__c": caisaAccountRow && caisaAccountRow.rateofinterest ? caisaAccountRow.rateofinterest : null,
                    "Repayment_Tenure__c": caisaAccountRow && caisaAccountRow.reppaymenttenure ? caisaAccountRow.reppaymenttenure : null,
                    "Promotional_Rate_Flag__c": caisaAccountRow && caisaAccountRow.promotionalrateflag ? caisaAccountRow.promotionalrateflag : null,
                    "Income__c": caisaAccountRow && caisaAccountRow.income ? caisaAccountRow.income : null,
                    "Income_Indicator__c": caisaAccountRow && caisaAccountRow.incomeindicator ? caisaAccountRow.incomeindicator : null,
                    "Income_Frequency_Indicator__c": caisaAccountRow && caisaAccountRow.incomefrequencyindicator ? caisaAccountRow.incomefrequencyindicator : null,
                    "Default_Status_Date__c": caisaAccountRow && caisaAccountRow.defaultstatusdate ? formatDate(caisaAccountRow.defaultstatusdate) : null,
                    "Litigation_Status_Date__c": caisaAccountRow && caisaAccountRow.litigationstatusdate ? formatDate(caisaAccountRow.litigationstatusdate) : null,
                    "Write_Off_Status_Date__c": caisaAccountRow && caisaAccountRow.writeoffstatusdate ?formatDate(caisaAccountRow.writeoffstatusdate) : null,
                    "Date_Of_Addition__c": caisaAccountRow && caisaAccountRow.dateofaddition ? formatDate(caisaAccountRow.dateofaddition) : null,
                    "Currency_Code__c": caisaAccountRow && caisaAccountRow.currencycode ? caisaAccountRow.currencycode : null,
                    "Subscriber_Comments__c": caisaAccountRow && caisaAccountRow.subscribercomments ? caisaAccountRow.subscribercomments : null,
                    "Consumer_Comments__c": caisaAccountRow && caisaAccountRow.consumercomments ? caisaAccountRow.consumercomments : null,
                    "Account_Holder_Type_Code__c": caisaAccountRow && caisaAccountRow.accountholdertypecode ? caisaAccountRow.accountholdertypecode : null,
                    "Surname_Nonnormalized__c": caisholderData && caisholderData.surnamenonnormalized ? caisholderData.surnamenonnormalized : null,
                    "First_Name_Nonnormalized__c": caisholderData && caisholderData.firstnamenonnormalized ? caisholderData.firstnamenonnormalized : null,
                    "Middle_Name1_Nonnormalized__c": caisholderData && caisholderData.middlename1nonnormalized ? caisholderData.middlename1nonnormalized : null,
                    "Middle_Name2_Nonnormalized__c": caisholderData && caisholderData.middlename2nonnormalized ? caisholderData.middlename2nonnormalized : null,
                    "Middle_Name3_Nonnormalized__c": caisholderData && caisholderData.middlename3nonnormalized ? caisholderData.middlename3nonnormalized : null,
                    "Alias__c": caisholderData && caisholderData.alias ? caisholderData.alias : null,
                    "Gender_Code__c": caisholderData && caisholderData.gendercode ? caisholderData.gendercode : null,
                    "Income_Tax_Pan__c": caisholderIdData && caisholderIdData.incometaxpan ? caisholderIdData.incometaxpan : null,
                    "Date_Of_Birth__c": caisholderIdData && caisholderIdData.dateofbirth ? formatDate(caisholderIdData.dateofbirth) : null,
                    "Pan_Issue_Date__c": caisholderIdData && caisholderIdData.panissuedate ? formatDate(caisholderIdData.panissuedate) : null,
                    "Pan_Expiration_Date__c": caisholderIdData && caisholderIdData.panexpirationdate ? formatDate(caisholderIdData.panexpirationdate) : null,
                    "Driver_License_Number__c": caisholderIdData && caisholderIdData.driverlicensenumber ? caisholderIdData.driverlicensenumber : "",
                    "Driver_license_Issue_Date__c": caisholderIdData && caisholderIdData.driverlicenseissuedate ? formatDate(caisholderIdData.driverlicenseissuedate) : null,
                    "Driver_License_Expiration_Date__c": caisholderIdData && caisholderIdData.driverlicenseexpirationdate ? formatDate(caisholderIdData.driverlicenseexpirationdate) : null,
                    "Email_Id__c": caisholderIdData && caisholderIdData.emailid ? caisholderIdData.emailid : null,
                    "Year__c": caisaccountHistory && caisaccountHistory.year ? caisaccountHistory.year : null,
                    "Month__c": caisaccountHistory && caisaccountHistory.month ? caisaccountHistory.month : null,
                    "Days_Past_Due__c": caisaccountHistory && caisaccountHistory.dayspastdue ? getNumber(caisaccountHistory.dayspastdue) : null,
                    "Asset_Classification__c": caisaccountHistory && caisaccountHistory.assetclassification ? caisaccountHistory.assetclassification : null,
                    
                    "First_Line_Of_Address_Nonnormalized__c": caisholderaddressData && caisholderaddressData.firstlineofaddressnonnormalized ? caisholderaddressData.firstlineofaddressnonnormalized : null,
                    "Second_Line_Of_Address_Nonnormalized__c": caisholderaddressData && caisholderaddressData.secondlineofaddressnonnormalized ? caisholderaddressData.secondlineofaddressnonnormalized : null,
                    "Third_Line_Of_Address_Nonnormalized__c": caisholderaddressData && caisholderaddressData.thirdlineofaddressnonnormalized ? caisholderaddressData.thirdlineofaddressnonnormalized : null,
                    "City_Nonnormalized__c": caisholderaddressData && caisholderaddressData.citynonnormalized ? caisholderaddressData.citynonnormalized : null,
                    "Fifth_Line_Of_Address_Nonnormalized__c": caisholderaddressData && caisholderaddressData.thirdlineofaddressnonnormalized ? caisholderaddressData.fifthlineofaddressnonnormalized : null,
                    "State_Nonnormalized__c": caisholderaddressData && caisholderaddressData.statenonnormalized ? caisholderaddressData.statenonnormalized : null,
                    "Zip_Postal_Code_Nonnormalized__c": caisholderaddressData && caisholderaddressData.zippostalcodenonnormalized ? caisholderaddressData.zippostalcodenonnormalized : null,
                    "Country_Code_Nonnormalized__c": caisholderaddressData && caisholderaddressData.countrycodenonnormalized ? caisholderaddressData.countrycodenonnormalized : null,
                    "Address_Indicator_Nonnormalized__c": caisholderaddressData && caisholderaddressData.addressindicatornonnormalized ? caisholderaddressData.addressindicatornonnormalized : null,
                    "Residence_Code_Nonnormalized__c": caisholderaddressData && caisholderaddressData.residencecodenonnormalized ? caisholderaddressData.residencecodenonnormalized : null,
                    "Telephone_number__c": caisholderphoneData && caisholderphoneData.telephonenumber ? caisholderphoneData.telephonenumber : null,
                    "Telephone_Type__c": caisholderphoneData && caisholderphoneData.telephonetype ? caisholderphoneData.telephonetype : null,
                    "Total_Caps_Last_7_Days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast7days ? getNumber(totalcapssummaryObj.totalcapslast7days) : 0,
                    "Total_Caps_Last_30_Days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast30days ? getNumber(totalcapssummaryObj.totalcapslast30days) : 0,
                    "Total_Caps_Last_90_Days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast90days ? getNumber(totalcapssummaryObj.totalcapslast90days) : 0,
                    "Total_Caps_Last_180_Days__c": totalcapssummaryObj && totalcapssummaryObj.totalcapslast180days ? getNumber(totalcapssummaryObj.totalcapslast180days) : 0,
                    "Caps_Last_7_Days__c": capssummaryObj && capssummaryObj.capslast7days ? getNumber(capssummaryObj.capslast7days) : 0,
                    "Caps_Last_30_Days__c": capssummaryObj && capssummaryObj.capslast30days ? getNumber(capssummaryObj.capslast30days) : 0,
                    "Caps_Last_90_Days__c": capssummaryObj && capssummaryObj.capslast90days ? getNumber(capssummaryObj.capslast90days) : 0,
                    "Caps_Last_180_Days__c": capssummaryObj && capssummaryObj.capslast180days ? getNumber(capssummaryObj.capslast180days) : 0,
                    
                    //"Caps_Subscriber_Code__c": capsAppData && capsAppData.subscribercode ? capsAppData.subscribercode : null,
                    //"Caps_Subscriber_Name__c": capsAppData && capsAppData.subscribername ? capsAppData.subscribername : null,
                    //"Caps_Date_Of_Request__c": capsAppData && capsAppData.dateofrequest ?  formatDate(capsAppData.dateofrequest) : null,
                    //"Caps_Report_Time__c": capsAppData && capsAppData.reporttime ? capsAppData.reporttime : null,
                    //"Caps_Report_Number__c": capsAppData && capsAppData.reportnumber ? capsAppData.reportnumber : null,
                    //"Caps_Finance_Purpose__c": capsAppData && capsAppData.financepurpose ? capsAppData.financepurpose : null,
                    //"Caps_Amount_Financed__c": capsAppData && capsAppData.amountfinanced ? capsAppData.amountfinanced : null,
                    //"Caps_Duration_Of_Agreement__c": capsAppData && capsAppData.durationofagreement ? capsAppData.durationofagreement : null,
                    
                    //"Caps_Last_Name__c": capsApplicantData && capsApplicantData.lastname ? capsApplicantData.lastname : null,
                    //"Caps_First_Name__c": capsApplicantData && capsApplicantData.firstname ? capsApplicantData.firstname : null,
                    //"Caps_Middle_Name1__c": capsApplicantData && capsApplicantData.middlename1 ? capsApplicantData.middlename1 : null,
                    //"Caps_Middle_Name2__c": capsApplicantData && capsApplicantData.middlename2 ? capsApplicantData.middlename2 : null,
                    //"Caps_Middle_Name3__c": capsApplicantData && capsApplicantData.middlename3 ? capsApplicantData.middlename3 : null,
                    //"Caps_Gender_Code__c": capsApplicantData && capsApplicantData.gendercode ? capsApplicantData.gendercode : null,
                    //"Caps_Income_Tax_Pan__c": capsApplicantData && capsApplicantData.incometaxpan ? capsApplicantData.incometaxpan : null,
                    //"Caps_Pan_Issue_date__c": capsApplicantData && capsApplicantData.panissuedate ? formatDate(capsApplicantData.panissuedate) : null,
                    //"Caps_Pan_Expiration_Date__c": capsApplicantData && capsApplicantData.panexpirationdate ? formatDate(capsApplicantData.panexpirationdate) : null,
                    //"Caps_Passport_Number__c": capsApplicantData && capsApplicantData.passportnumber ? capsApplicantData.passportnumber : null,
                    //"Caps_Passport_Issue_Date__c": capsApplicantData && capsApplicantData.passportissuedate ? formatDate(capsApplicantData.passportissuedate) : null,
                    //"Caps_Passport_Expiration_Date__c": capsApplicantData && capsApplicantData.passportexpirationdate ? formatDate(capsApplicantData.passportexpirationdate) : null,
                    //"Caps_Voters_Identity_Card__c": capsApplicantData && capsApplicantData.votersidentitycard ? capsApplicantData.votersidentitycard : null,
                    //"Caps_Voter_Id_Issue_Date__c": capsApplicantData && capsApplicantData.voteridissuedate ? formatDate(capsApplicantData.voteridissuedate) : null,
                    //"Caps_Voter_Id_Expiration_Date__c": capsApplicantData && capsApplicantData.voteridexpirationdate ? formatDate(capsApplicantData.voteridexpirationdate) : null,
                    //"Caps_Driver_License_Number__c": capsApplicantData && capsApplicantData.driverlicensenumber ? capsApplicantData.driverlicensenumber : null,
                    //"Caps_Driver_License_Issue_Date__c": capsApplicantData && capsApplicantData.driverlicenseissuedate ? formatDate(capsApplicantData.driverlicenseissuedate) : null,
                    //"Caps_Driver_License_Expiration_Date__c": capsApplicantData && capsApplicantData.driverlicenseexpirationdate ? formatDate(capsApplicantData.driverlicenseexpirationdate) : null,
                    //"Caps_Ration_Card_Number__c": capsApplicantData && capsApplicantData.rationcardnumber ? capsApplicantData.rationcardnumber : null,
                    //"Caps_Ration_Card_Issue_Date__c": capsApplicantData && capsApplicantData.rationcardissuedate ? formatDate(capsApplicantData.rationcardissuedate) : null,
                    //"Caps_Ration_Card_Expiration_Date__c": capsApplicantData && capsApplicantData.rationcardexpirationdate ? formatDate(capsApplicantData.rationcardexpirationdate) : null,
                    //"Caps_Universal_Id_Number__c": capsApplicantData && capsApplicantData.universalidnumber ? capsApplicantData.universalidnumber : null,
                    //"Caps_Universal_Id_Issue_Date__c": capsApplicantData && capsApplicantData.universalidissuedate ? formatDate(capsApplicantData.universalidissuedate) : null,
                    //"Caps_Universal_Id_Expiration_Date__c": capsApplicantData && capsApplicantData.universalidexpirationdate ? formatDate(capsApplicantData.universalidexpirationdate) : null,
                    //"Caps_Telephone_Number_Applicant_1st__c": capsApplicantData && capsApplicantData.telephonenumberapplicant1st ? capsApplicantData.telephonenumberapplicant1st : null,
                    //"Caps_Telephone_Extension__c": capsApplicantData && capsApplicantData.telephoneextension ? capsApplicantData.telephoneextension : null,
                    //"Caps_Telephone_Type__c": capsApplicantData && capsApplicantData.telephonetype ? capsApplicantData.telephonetype : null,
                    //"Caps_Email_Id__c": capsApplicantData && capsApplicantData.emailid ? capsApplicantData.emailid : null,

                    //"Caps_Income__c": capsOtherData && capsOtherData.income ? capsOtherData.income : null,
                    //"Caps_Marital_Status__c": capsOtherData && capsOtherData.maritalstatus ? capsOtherData.maritalstatus : null,
                    //"Caps_Employment_Status__c": capsOtherData && capsOtherData.employmentstatus ? capsOtherData.employmentstatus : null,
                    //"Caps_Time_With_Employer__c": capsOtherData && capsOtherData.timewithemployer ? capsOtherData.timewithemployer : null,
                    //"Caps_Number_Of_Major_Credit_Card_Held__c": capsOtherData && capsOtherData.numberofmajorcreditcardheld ? capsOtherData.numberofmajorcreditcardheld : null,
                    
                    //"Caps_Flat_No_Plot_No_House_No__c": capsAddressData && capsAddressData.flatnoplotnohouseno ? capsAddressData.flatnoplotnohouseno : null,
                    //"Caps_Bldg_No_Society_Name__c": capsAddressData && capsAddressData.bldgnosocietyname ? capsAddressData.bldgnosocietyname : null,
                    //"Caps_Road_No_Name_Area_Locality__c": capsAddressData && capsAddressData.roadnonamearealocality ? capsAddressData.roadnonamearealocality : null,
                    //"Caps_City__c": capsAddressData && capsAddressData.city ? capsAddressData.city : null,
                    //"Caps_Landmark__c": capsAddressData && capsAddressData.landmark ? capsAddressData.landmark : null,
                    //"Caps_State__c": capsAddressData && capsAddressData.state ? capsAddressData.state : null,
                    //"Caps_PinCode__c": capsAddressData && capsAddressData.pincode ? capsAddressData.pincode : null,
                    //"Caps_Country_Code__c": capsAddressData && capsAddressData.countrycode ? capsAddressData.countrycode : null,
                    
                    "Non_Credit_Caps_Last_7_Days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast7days ? getNumber(noncreditcapssummaryObj.noncreditcapslast7days) : null,
                    "Non_Credit_Caps_Last_30_Days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast30days ? getNumber(noncreditcapssummaryObj.noncreditcapslast30days) : null,
                    "Non_Credit_Caps_Last_90_Days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast90days ? getNumber(noncreditcapssummaryObj.noncreditcapslast90days) : null,
                    "Non_Credit_Caps_Last_180_Days__c": noncreditcapssummaryObj && noncreditcapssummaryObj.noncreditcapslast180days ? getNumber(noncreditcapssummaryObj.noncreditcapslast180days) : null,
                    
                     //"Noncc_Subscriber_Code__c": capsNonAppData && capsNonAppData.subscribercode ? capsNonAppData.subscribercode : null,
                    //"Noncc_Subscriber_Name__c": capsNonAppData && capsNonAppData.subscribername ? capsNonAppData.subscribername : null,
                    //"Noncc_Date_Of_Request__c": capsNonAppData && capsNonAppData.dateofrequest ?  formatDate(capsNonAppData.dateofrequest) : null,
                    //"Noncc_Report_Time__c": capsNonAppData && capsNonAppData.reporttime ? capsNonAppData.reporttime : null,
                    //"Noncc_Report_Number__c": capsNonAppData && capsNonAppData.reportnumber ? capsNonAppData.reportnumber : null,
                    //"Noncc_Finance_Purpose__c": capsNonAppData && capsNonAppData.financepurpose ? capsNonAppData.financepurpose : null,
                    //"Noncc_Amount_Financed__c": capsNonAppData && capsNonAppData.amountfinanced ? capsNonAppData.amountfinanced : null,
                    //"Noncc_Duration_Of_Agreement__c": capsNonAppData && capsNonAppData.durationofagreement ? capsNonAppData.durationofagreement : null,
                    
                    //"Noncc_Last_Name__c": capsNonApplicantData && capsNonApplicantData.lastname ? capsNonApplicantData.lastname : null,
                    //"Noncc_First_Name__c": capsNonApplicantData && capsNonApplicantData.firstname ? capsNonApplicantData.firstname : null,
                    //"Noncc_Middle_Name1__c": capsNonApplicantData && capsNonApplicantData.middlename1 ? capsNonApplicantData.middlename1 : null,
                    //"Noncc_Middle_Name2__c": capsNonApplicantData && capsNonApplicantData.middlename2 ? capsNonApplicantData.middlename2 : null,
                    //"Noncc_Middle_Name3__c": capsNonApplicantData && capsNonApplicantData.middlename3 ? capsNonApplicantData.middlename3 : null,
                    //"Noncc_Gender_Code__c": capsNonApplicantData && capsNonApplicantData.gendercode ? capsNonApplicantData.gendercode : null,
                    //"Noncc_Income_Tax_Pan__c": capsNonApplicantData && capsNonApplicantData.incometaxpan ? capsNonApplicantData.incometaxpan : null,
                    //"Noncc_Pan_Issue_Date__c": capsNonApplicantData && capsNonApplicantData.panissuedate ? formatDate(capsNonApplicantData.panissuedate) : null,
                    //"Noncc_Pan_Expiration_Date__c": capsNonApplicantData && capsNonApplicantData.panexpirationdate ? formatDate(capsNonApplicantData.panexpirationdate) : null,
                    //"Noncc_Passport_Number__c": capsNonApplicantData && capsNonApplicantData.passportnumber ? capsNonApplicantData.passportnumber : null,
                    //"Noncc_Passport_Issue_Date__c": capsNonApplicantData && capsNonApplicantData.passportissuedate ? formatDate(capsNonApplicantData.passportissuedate) : null,
                    //"Noncc_Passport_Expiration_Date__c": capsNonApplicantData && capsNonApplicantData.passportexpirationdate ? formatDate(capsNonApplicantData.passportexpirationdate) : null,
                    //"Noncc_Voters_Identity_Card__c": capsNonApplicantData && capsNonApplicantData.votersidentitycard ? capsNonApplicantData.votersidentitycard : null,
                    //"Noncc_Voter_Id_Issue_Date__c": capsNonApplicantData && capsNonApplicantData.voteridissuedate ? formatDate(capsNonApplicantData.voteridissuedate) : null,
                    //"Noncc_Voter_Id_Expiration_Date__c": capsNonApplicantData && capsNonApplicantData.voteridexpirationdate ? formatDate(capsNonApplicantData.voteridexpirationdate) : null,
                    //"Noncc_Driver_License_Number__c": capsNonApplicantData && capsNonApplicantData.driverlicensenumber ? capsNonApplicantData.driverlicensenumber : null,
                    //"Noncc_Driver_License_Issue_Date__c": capsNonApplicantData && capsNonApplicantData.driverlicenseissuedate ? formatDate(capsNonApplicantData.driverlicenseissuedate) : null,
                    //"Noncc_Driver_License_Expiration_Date__c": capsNonApplicantData && capsNonApplicantData.driverlicenseexpirationdate ? formatDate(capsNonApplicantData.driverlicenseexpirationdate) : null,
                    //"Noncc_Ration_Card_Number__c": capsNonApplicantData && capsNonApplicantData.rationcardnumber ? capsNonApplicantData.rationcardnumber : null,
                    //"Noncc_Ration_Card_Issue_Date__c": capsNonApplicantData && capsNonApplicantData.rationcardissuedate ? formatDate(capsNonApplicantData.rationcardissuedate) : null,
                    //"Noncc_Ration_Card_Expiration_Date__c": capsNonApplicantData && capsNonApplicantData.rationcardexpirationdate ? formatDate(capsNonApplicantData.rationcardexpirationdate) : null,
                    //"Noncc_Universal_Id_Number__c": capsNonApplicantData && capsNonApplicantData.universalidnumber ? capsNonApplicantData.universalidnumber : null,
                    //"Noncc_Universal_Id_Issue_Date__c": capsNonApplicantData && capsNonApplicantData.universalidissuedate ? formatDate(capsNonApplicantData.universalidissuedate) : null,
                    //"Noncc_Universal_Id_Expiration_Date__c": capsNonApplicantData && capsNonApplicantData.universalidexpirationdate ? formatDate(capsNonApplicantData.universalidexpirationdate) : null,
                    //"Noncc_Telephone_Number_Applicant_1st__c": capsNonApplicantData && capsNonApplicantData.telephonenumberapplicant1st ? capsNonApplicantData.telephonenumberapplicant1st : null,
                    //"Noncc_Telephone_Extension__c": capsNonApplicantData && capsNonApplicantData.telephoneextension ? capsNonApplicantData.telephoneextension : null,
                    //"Noncc_Telephone_Type__c": capsNonApplicantData && capsNonApplicantData.telephonetype ? capsNonApplicantData.telephonetype : null,
                    //"Noncc_Email_Id__c": capsNonApplicantData && capsNonApplicantData.emailid ? capsNonApplicantData.emailid : null,

                    //"Noncc_Income__c": capsNonOtherData && capsNonOtherData.income ? capsNonOtherData.income : null,
                    //"Noncc_Marital_Status__c": capsNonOtherData && capsNonOtherData.maritalstatus ? capsNonOtherData.maritalstatus : null,
                    //"Noncc_Employment_Status__c": capsNonOtherData && capsNonOtherData.employmentstatus ? capsNonOtherData.employmentstatus : null,
                    //"Noncc_Time_With_Employer__c": capsNonOtherData && capsNonOtherData.timewithemployer ? capsNonOtherData.timewithemployer : null,
                    //"Noncc_Number_Of_Major_Credit_card_Held__c": capsNonOtherData && capsNonOtherData.numberofmajorcreditcardheld ? capsNonOtherData.numberofmajorcreditcardheld : null,
                    
                    //"Noncc_Flat_No_Plot_No_House_No__c": capsNonAddressData && capsNonAddressData.flatnoplotnohouseno ? capsNonAddressData.flatnoplotnohouseno : null,
                    //"Noncc_Bldg_No_Society_Name__c": capsNonAddressData && capsNonAddressData.bldgnosocietyname ? capsNonAddressData.bldgnosocietyname : null,
                    //"Noncc_Road_No_Name_Area_Locality__c": capsNonAddressData && capsNonAddressData.roadnonamearealocality ? capsNonAddressData.roadnonamearealocality : null,
                    //"Noncc_City__c": capsNonAddressData && capsNonAddressData.city ? capsNonAddressData.city : null,
                    //"Noncc_Landmark__c": capsNonAddressData && capsNonAddressData.landmark ? capsNonAddressData.landmark : null,
                    //"Noncc_State__c": capsNonAddressData && capsNonAddressData.state ? capsNonAddressData.state : null,
                    //"Noncc_PinCode__c": capsNonAddressData && capsNonAddressData.pincode ? capsNonAddressData.pincode : null,
                    //"Noncc_Country_Code__c": capsNonAddressData && capsNonAddressData.countrycode ? capsNonAddressData.countrycode : null,

                    "Bureau_Score__c": score && score.bureauscore ? score.bureauscore : null,
                    "Bureau_Score_Confid_Level__c": score && score.bureauscoreconfidlevel ? score.bureauscoreconfidlevel : null,

                
                }
 */
                console.log("ObjCaisAccountDetail", ObjCaisAccountDetail);
                    const caiseData_resp = await prisma.cais_account_detail__c.create({
                        data: ObjCaisAccountDetail
                    }); 
                console.log("CAID", caiseData_resp.id);
                return { status: "success", message: 'Success' };
            } else {
                let errorObj = {
                    method: "POST",
                    sfid: sfid,
                    service: "HARD PULL",
                    resData: JSON.stringify(getdata)
                }
                await customError(errorObj);
                return { status: "error", message: getdata.message ? getdata.message : getdata };
            }

        } catch (error) {
            return { status: "error", message: error.message ? error.message : error }
        }
    }

async function checkBreLimit(get_limit_data, sfid) {
        let bre_limit = 0;
        let applicantArrData = [];
        if (get_limit_data && get_limit_data.applicationout)
        {
            let resData = get_limit_data.applicationout;
            let applicantArr = get_limit_data.applicant && get_limit_data.applicant.length > 0 ? get_limit_data.applicant : [];
            applicantArr.forEach(function (el) {
                let applicantoutVal = el.applicantout ? el.applicantout : {};
                let bureaValue = applicantoutVal && applicantoutVal.bureausurrogate ? applicantoutVal.bureausurrogate : {};
                bre_limit = applicantoutVal && applicantoutVal.ipabasisbureau ? applicantoutVal.ipabasisbureau: bre_limit;
            // console.log("bre_limit", bre_limit);
            applicantArrData.push({
                    "imdb_fail__c": resData && resData.imdbfail ? resData.imdbfail : null,
                    "derog_found__c": resData && resData.derogfound ? resData.derogfound : null,
                    "account_type__c": bureaValue && bureaValue.accounttype ? bureaValue.accounttype : null,
                    "additional_parameters__c": resData && resData.additionalparameters ? resData.additionalparameters : null,
                    "ipa_basis_bureau__c": applicantoutVal.ipabasisbureau ? applicantoutVal.ipabasisbureau : 0,
                    "ipa_non_ipa__c": applicantoutVal.ipanonipa ? applicantoutVal.ipanonipa : null,
                    "mobile_score__c": applicantoutVal.mobilescore ? applicantoutVal.mobilescore : 0,
                    "age_in_bureau_gt_24_months__c": bureaValue &&  bureaValue.ageinbureaugt24months ? Number(bureaValue.ageinbureaugt24months) : '',
                    "cibil_score__c": bureaValue && bureaValue.cibilscore ? bureaValue.cibilscore : 0,
                    "credit_card_utilization__c": bureaValue && bureaValue.creditcardutilization ? bureaValue.creditcardutilization : 0,
                    "derog_status__c": bureaValue && bureaValue.derogstatus ? bureaValue.derogstatus : null,
                    "high_sanction_amount__c": bureaValue && bureaValue.highsanctionamount ? Number(bureaValue.highsanctionamount) : 0,
                    "mob__c": bureaValue && bureaValue.mob ? Number(bureaValue.mob) : null,
                    "multiplier__c": bureaValue && bureaValue.multiplier ? Number(bureaValue.multiplier) : null,
                    "ninty_plus_in_last_12_months__c": bureaValue && bureaValue.nintyplusinlast12months ? bureaValue.nintyplusinlast12months : 0,
                    "no_credit_card_in_180_pldpd__c": bureaValue && bureaValue.nocreditcardin180pldpd ? bureaValue.nocreditcardin180pldpd : 0,
                    "over_due_amount_gt0__c": bureaValue && bureaValue.overdueamountgt0 ? bureaValue.overdueamountgt0 : 0,
                    "over_due_gt5000_in_tradeline__c": bureaValue && bureaValue.overduegt5000intradeline ? bureaValue.overduegt5000intradeline : 0,
                    "sf_will_fulde_fault_dbt_lss_smasub__c": bureaValue && bureaValue.sfwillfuldefaultdbtlsssmasub ? bureaValue.sfwillfuldefaultdbtlsssmasub : 0,
                    "thick_or_thin__c": bureaValue && bureaValue.thickorthin ? bureaValue && bureaValue.thickorthin : null,
                    "thirty_plus_in_last_12_months__c": bureaValue && bureaValue.thirtyplusinlast12months ? bureaValue.thirtyplusinlast12months : 0,
                    "thirty_plus_in_last_3_months__c": bureaValue && bureaValue.thirtyplusinlast3months ? bureaValue.thirtyplusinlast3months : 0,
                    "total_no_of_tradeline__c": bureaValue && bureaValue.totalnooftradeline ? Number(bureaValue.totalnooftradeline) : null,
                    "unsecured_uitlization_exclude_cred_card__c": bureaValue && bureaValue.unsercuredutilizationexcludingcreditcards ? bureaValue.unsercuredutilizationexcludingcreditcards : 0,
                    "zero_plus_in_last_12_months__c": bureaValue && bureaValue.zeroplusinlast12months ? Number(bureaValue.zeroplusinlast12months) : null,
                    "zero_plus_in_last_3_months__c": bureaValue && bureaValue.zeroplusinlast3months ? bureaValue.zeroplusinlast3months : 0,
                    "nonaddon_tradlines_min_24_monts_vntage__c": bureaValue && bureaValue.noofnonaddontradelinesinlast24montswithmin24monthsvintage ? bureaValue.noofnonaddontradelinesinlast24montswithmin24monthsvintage : 0,
                    "secured_trdlines_in_24_monts_with_18rtr__c": bureaValue && bureaValue.noofsecuredtradelineswithin24monthswith18rtr ? bureaValue.noofsecuredtradelineswithin24monthswith18rtr : 0,
                    "unsecured_trdlines_in_24_monts_18rtr__c": bureaValue && bureaValue.noofunsecuredtradelineswithin24monthswith18rtr ? bureaValue.noofunsecuredtradelineswithin24monthswith18rtr : 0
                });
            });
           // console.log("applicantArrData createMany=========>>>>>>>", applicantArrData);
            const caisAccountDetails_resp = await prisma.bre_limit__c.createMany({
                data: applicantArrData
            });
        }else{
            let errorObj = {
                method: "POST",
                sfid: sfid,
                service: "BRE LIMIT 1",
                resData: JSON.stringify(get_limit_data)
            }
            await customError(errorObj);
        } 
     return bre_limit;
}

export async function getPanProfile(givenData) {
    try {
        const { pan, name, cust_id, sfid, tempId } = givenData;
        let data = {
            "pan": pan,
            "name": name,
            "getContactDetails": "Y",
            "consent": "Y"
        }
       // console.log("givenData", givenData);
        const channel_id = process.env.USER_CHANNEL_ID;
        const client_id = process.env.USER_CLIENT_ID;
        const client_secret = process.env.USER_CLIENT_SECRET;
        const transaction_id = Math.floor(100000 + Math.random() * 900000);
      //  const external_id = String(tempId);
        const headers = new Headers();
        headers.append('channel_id', channel_id);
        headers.append('transaction_id', transaction_id);
        headers.append('client_id', client_id);
        headers.append('client_secret', client_secret);
        headers.append('content-type', 'application/json');
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        };
        const getdata = await fetch(PAN_PROFILE, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        console.log("Pan Profile", getdata);
        if (getdata.result !== undefined) {
            await prisma.account.update({
                where: { id: cust_id },
                data: { pan_number__c: pan, is_pan_confirm__c: true }
            });

            let resData = getdata.result;
            let loggerObj = {
                method: "POST",
                sfid: sfid,
                tempid: '',
                service: "PAN PROFILE",
                resData: JSON.stringify(getdata)
            }
            await apiLogger(loggerObj);
          //  console.log("heroku_external_id__c", external_id);
           /*  const panDet = await prisma.pan_profile__c.findFirst({
                where: {
                    heroku_external_id__c:  String(external_id)
                },
                orderBy:{
                    id: "desc"
                }
            }); */
            let data = {
                //"heroku_external_id__c": external_id,
                "accountid__c": sfid,
                "pan__c": pan,
                "name": resData.name ? resData.name : null,
                "first_name__c": resData.firstName ? resData.firstName : null,
                "middle_name__c": resData.middleName ? resData.middleName : null,
                "last_name__c": resData.lastName ? resData.lastName : null,
                "gender__c": resData.gender ? resData.gender : null,
                "aadhaar_linked__c": resData.aadhaarLinked ? resData.aadhaarLinked : null,
                "aadhaar_match__c": resData.aadhaarMatch ? resData.aadhaarMatch : null,
                "date_of_birth__c": resData.dob ? resData.dob : null,
                "building_name__c": resData.address.buildingName ? resData.address.buildingName : null,
                "locality__c": resData.address.locality ? resData.address.locality : null,
                "street_name__c": resData.address.streetName ? resData.address.streetName : null,
                "pin_code__c": resData.address.pinCode ? resData.address.pinCode : null,
                "city__c": resData.address.city ? resData.address.city : null,
                "state__c": resData.address.state ? resData.address.state : null,
                "country__c": resData.address.country ? resData.address.country : null,
                "mobile_no__c": resData.mobileNo ? resData.mobileNo : null,
                "email_id__c": resData.emailId ? resData.emailId : null,
            }
            let address = `${resData.address.streetName ? resData.address.streetName + ', ' : ''}${resData.address.locality ? resData.address.locality + '' : ''}`;
            let addressData = {
                //"heroku_external_id__c": external_id,
                account__c: sfid,
                name: "Pan Profile",
                pincode__c: resData.address.pinCode ? resData.address.pinCode : null,
                country__c: resData.address.country ? resData.address.country : null,
                state__c: resData.address.state ? resData.address.state : null,
                city__c: resData.address.city ? resData.address.city : null,
                landmark__c: resData.address.buildingName ? resData.address.buildingName : null,
                address__c: address
            }
            

            const addresDet = await prisma.address__c.create({
                data: addressData
            });
            
            await prisma.account.update({
                where: { id: cust_id },
                data: {
                    date_of_birth_applicant__c: resData.dob?new Date(resData.dob):null,
                    approved_pin_code__c: resData.address.pinCode?Number(resData.address.pinCode):null,
                    gender__c: resData.gender?resData.gender:null,
                    is_pan_confirm__c: true,
                    current_address_id__c: String(addresDet.id),
                    is_qde_1_form_done__c: resData.dob?true:false
                },
            });
            const updateObj = {
                Date_Of_Birth_Applicant__c:  obj.pan?obj.pan:null,
                Approved_Pin_Code__c: limit_data,
                Gender__c: resData.gender?resData.gender:null,
                Is_pan_confirm__c: true,
                Current_Address_Id__c: String(addresDet.id),
                Is_QDE_1_form_done__c: resData.dob?true:false
            }
            const getUpdate = await updateAccount(updateObj);

            await prisma.pan_profile__c.create({
                data: data
            });
            
            return { status: "success", message: 'Success', data: resData };
        } else {
            let errorObj = {
                method: "POST",
                sfid: sfid,
             //   tempid: '',
                service: "PAN PROFILE",
                resData: JSON.stringify(getdata)
            }
            await customError(errorObj);
            return { status: "error", message: getdata.message };
        }


    } catch (error) {
        return { status: "error", message: error.message ? error.message : error };
    }
}

export async function checkPanStatus(givenData) {
    try {
        const { cust_id, pan, name, sfid, tempId } = givenData;
        let data = {
            "pan": pan,
            "name": name
        }
        const channel_id = process.env.USER_CHANNEL_ID;
        const client_id = process.env.USER_CLIENT_ID;
        const client_secret = process.env.USER_CLIENT_SECRET;
        const transaction_id = Math.floor(100000 + Math.random() * 900000);
        const headers = new Headers();
        headers.append('channel_id', channel_id);
        headers.append('transaction_id', transaction_id);
        headers.append('client_id', client_id);
        headers.append('client_secret', client_secret);
        headers.append('content-type', 'application/json');
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        };
        const getdata = await fetch(PAN_CHECK, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        console.log("Pan Status", getdata);
        if (getdata.code !== undefined && getdata.code === "SUCCESS") {
            let loggerObj = {
                method: "POST",
                sfid: sfid,
                tempid: '',
                service: "PAN STATUS",
                resData: JSON.stringify(getdata)
            }
            await apiLogger(loggerObj);
            const details = getdata.data;
            if (details.status !== undefined && details.status === "ACTIVE") {
                let data = {
                    //heroku_external_id__c: tempId,
                    accountid__c: sfid,
                    status__c: details.status ? details.status : null,
                    pricing_strategy__c: getdata.pricingStrategy,
                    message__c: getdata.message,
                    is_match__c: details.isMatch,
                    full_name__c: details.fullName,
                    extra__c: getdata.extra,
                    code__c: getdata.code,
                    aadhaar_binding_status__c: details.aadhaarBindingStatus ? true : false,
                }
                console.log("data", data)
                const panDet = await prisma.pan_status_check__c.findFirst({
                    where: {
                        accountid__c: String(cust_id)
                    }
                });
                let testObj = {
                    cust_id:  Number(cust_id), pan_number__c: pan.toString()
                }
                console.log("testObj",testObj);
                const updateObj = {
                    PAN_Number__c:  String(pan),
                    PAN_Verified__c: true
                }
                await updateAccount(updateObj);
                await prisma.account.update({
                    where: {
                        id: Number(cust_id)
                    },
                    data: {
                        pan_number__c:  pan.toString(),
                        pan_verified__c: true
                    }
                });
                if (!panDet) {
                    await prisma.pan_status_check__c.create({
                        data: data
                    });
                } else {
                    await prisma.pan_status_check__c.update({
                        where: {
                            accountid__c: String(cust_id)
                        },
                        data: data,
                    });
                }
                return { status: "success", message: 'Success' };
            } else {
                return { status: "error", message: "Pan number does not match your name of '" + name + "'" };
            }
        } else {
            let errorObj = {
                method: "POST",
                sfid: sfid,
                tempid: '',
                service: "PAN STATUS",
                resData: JSON.stringify(getdata)
            }
            await customError(errorObj);
            return { status: "error", message: getdata };
        }
    } catch (error) {
        return { status: "error", message: error.message ? error.message : error };
    }
}

export async function tuHardPull(getData) {
    try {
            const { amount, city, fname, lname, pan, phone, pincode, address, dob, sfid } = getData
            var myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("transaction_id", "esate");
            myHeaders.append("client_id", "918e4acddf60379f8ef62a1a07ee4a14d807ab7e");
            myHeaders.append("client_secret", "e448ec974f91c73a23cf1d672b8ba548b34ec182");
            myHeaders.append("channel_id", "MOB");
            myHeaders.append("x-correlation-id", "db29a1eb-e899-4419-9231-a9db491f8651");
            myHeaders.append("x-user-domain", "demo-ica-apac.co.in");
            myHeaders.append("X-Screenless-Kill-Null", "true");
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "firstName":"Raghavendra",
                "middleName":"",
                "lastName":"Singh",
                "dateOfBirth":"30041972",
                "gender":"2",
                "panNo":"BVMPS3258L",
                "passportNumber":"",
                "dlno":"",
                "voterId":"",
                "uid":"",
                "idType":"01",
                "telephoneExtension":"",
                "telephoneNumber":"9554777894",
                "addressLine1":"VILLAGE -KAMALPUR SPOST - KAMALPUR DIST-",
                "addressLine2":"KASGANG U.P.",
                "addressType":"01",
                "city":"Etah",
                "pinCode":"207246",
                "residenceType":"02",
                "stateCode":"09",
                "purpose":"08",
                "amount":"150000"
            });
            /* var raw = JSON.stringify({
                "firstName": fname,
                "middleName":"",
                "lastName": lname,
                "dateOfBirth": formatDateSeparator(dob), // "30041972",
                "gender":"2",
                "panNo": pan,
                "passportNumber":"",
                "dlno":"",
                "voterId":"",
                "uid":"",
                "idType":"01",
                "telephoneExtension":"",
                "telephoneNumber": phone,
                "addressLine1": '-',
                "addressLine2":"",
                "addressType":"01",
                "city": city,
                "pinCode": pincode,
                "residenceType":"02",
                "stateCode":"09",
                "purpose":"08",
                "amount": String(amount)
            }); */
            console.log("Tu Hardfull Request", raw);
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
          const getdata = await  fetch(TU_HARD_PULL , requestOptions)
          .then((response) => response.json())
          .then((response) => {
              return response;
          });
       
        if (getdata) {
            let loggerObj1 = {
                method: "POST",
                sfid: sfid,
                service: "TU HARD PULL",
                resData:raw
            }
            await apiLogger(loggerObj1); 
            const head = getdata.header;
            const nameSegment = getdata.nameSegment;
            const empSegment = getdata.employmentSegment;
            const conDisputeRemarks= getdata.consumerDisputeRemarksSegmentDr;
            const idData = getdata.idSegment ? getdata.idSegment : [];
            const idSegment = idData.length > 0 ? idData[0] : null;
            const telData = getdata.telephoneSegment ? getdata.telephoneSegment : [];
            const telSegment = telData.length > 0 ? telData[0] : null;
            const emailData = getdata.emailContactSegment ? getdata.emailContactSegment : [];
            const emailSegment = emailData.length > 0 ? emailData[0] : null;
            const enquiryData = getdata.enquiryAccountNumberSegment ? getdata.enquiryAccountNumberSegment : [];
            const enquirySegment = enquiryData.length > 0 ? enquiryData[0] : null;
            const scoreData = getdata.scoreSegment ? getdata.scoreSegment : [];
            const scoreSegment = scoreData.length > 0 ? scoreData[0] : null;
            const addressData = getdata.address ? getdata.address : [];
            const addressSegment = addressData.length > 0 ? addressData[0] : null;
            const accountData = getdata.accountSegment ? getdata.accountSegment : [];
            const accountSegment = accountData.length > 0 ? accountData[0] : null;
            const accountSummaryT1Data = getdata.accountSegmentSummaryTlSummaryForOtherLiveClosedAccounts ? getdata.accountSegmentSummaryTlSummaryForOtherLiveClosedAccounts : [];
            const accountSummaryT1Segment = accountSummaryT1Data.length > 0 ? accountSummaryT1Data[0] : null;
          //  const enquiryData = getdata.enquiry ? getdata.enquiry : [];
          //  const enquirySegment = enquiryData.length > 0 ? enquiryData[0] : null;

            let ObjBreuResp = {
               
                "segment_tag__c": head && head.segmentTag ? head.segmentTag : null,
                "version__c": head && head.version ? Number(head.version) : null,
               /* "Reference_Number__c": head && head.referenceNumber ? head.referenceNumber : null,
                "Member_Code__c": head && head.memberCode ? head.memberCode : null,
                "Subject_Return_Code__c": head && head.subjectReturnCode ? head.subjectReturnCode : null,
                "Enquiry_Control_Number__c": head && head.enquiryControlNumber ? head.enquiryControlNumber : null,
                "Date_Processed__c": head && head.dateProcessed ? head.dateProcessed : null,
                "Time_Processed__c": head && head.timeProcessed ? head.timeProcessed : null,

                "Segment_Tag__c": nameSegment && nameSegment.segmentTag ? nameSegment.segmentTag : null,
                "Consumer_Name_Field1__c": nameSegment && nameSegment.consumerNameField1 ? nameSegment.consumerNameField1 : null,
                "Consumer_Name_Field2__c": nameSegment && nameSegment.consumerNameField2 ? nameSegment.consumerNameField2 : null,
                "Consumer_Name_Field3__c": nameSegment && nameSegment.consumerNameField3 ? nameSegment.consumerNameField3 : null,
                "Consumer_Name_Field4__c": nameSegment && nameSegment.consumerNameField4 ? nameSegment.consumerNameField4 : null,
                "Date_Of_Birth__c": nameSegment && nameSegment.dateOfBirth ? nameSegment.dateOfBirth : null,
                "Gender__c": nameSegment && nameSegment.gender ? nameSegment.gender : null,
                "Date_Of_Entry_For_Error_Code__c": nameSegment && nameSegment.dateOfEntryForErrorCode ? nameSegment.dateOfEntryForErrorCode : null,
                "Error_Segment_Tag__c": nameSegment && nameSegment.errorSegmentTag ? nameSegment.errorSegmentTag : null,
                "Error_Code__c": nameSegment && nameSegment.errorCode ? nameSegment.errorCode : null,
                "Date_Of_Entry_For_Cibil_Remarks_Code__c": nameSegment && nameSegment.dateOfEntryForCibilRemarksCode ? nameSegment.dateOfEntryForCibilRemarksCode : null,
                "Cibil_Remarks_Code__c": nameSegment && nameSegment.cibilRemarksCode ? nameSegment.cibilRemarksCode : null,
                "Date_For_Error_Dispute_Remarks_Code__c": nameSegment && nameSegment.dateOfEntryForErrorDisputeRemarksCode ? nameSegment.dateOfEntryForErrorDisputeRemarksCode : null,
                "Error_Dispute_Remarks_Code1__c": nameSegment && nameSegment.errorDisputeRemarksCode1 ? nameSegment.errorDisputeRemarksCode1 : null,
                "Error_Dispute_Remarks_Code2__c": nameSegment && nameSegment.errorDisputeRemarksCode2 ? nameSegment.errorDisputeRemarksCode2 : null,
               
                "Segment_Tag__c": empSegment && empSegment.segmentTag ? empSegment.segmentTag : null,
                "Account_Type__c": empSegment && empSegment.accountType ? empSegment.accountType : null,
                "Date_Reported_And_Certified__c": empSegment && empSegment.dateReportedAndCertified ? empSegment.dateReportedAndCertified : null,
                "Occupation_Code__c": empSegment && empSegment.occupationCode ? empSegment.occupationCode : null,
                "Income__c": empSegment && empSegment.income ? empSegment.income : null,
                "Net_Gross_Income_Indicator__c": empSegment && empSegment.netGrossIncomeIndicator ? empSegment.netGrossIncomeIndicator : null,
                "Monthly_Annual_Income_Indicator__c": empSegment && empSegment.monthlyAnnualIncomeIndicator ? empSegment.monthlyAnnualIncomeIndicator : null,
                "Date_Of_Entry_For_Error_Code__c": empSegment && empSegment.dateOfEntryForErrorCode ? empSegment.dateOfEntryForErrorCode : null,
                "Error_Code__c": empSegment && empSegment.errorCode ? empSegment.errorCode : null,
                "Date_Of_Entry_For_Cibil_Remarks_Code__c": empSegment && empSegment.dateOfEntryForCibilRemarksCode ? empSegment.dateOfEntryForCibilRemarksCode : null,
                "Cibil_Remarks_Code__c": empSegment && empSegment.cibilRemarksCode ? empSegment.cibilRemarksCode : null,
                "Date_For_Error_Dispute_Remarks_Code__c": empSegment && empSegment.dateOfEntryForErrorDisputeRemarksCode ? empSegment.dateOfEntryForErrorDisputeRemarksCode : null,
                "Error_Dispute_Remarks_Code1__c": empSegment && empSegment.errorDisputeRemarksCode1 ? empSegment.errorDisputeRemarksCode1 : null,
                "Error_Dispute_Remarks_Code2__c": empSegment && empSegment.errorDisputeRemarksCode2 ? empSegment.errorDisputeRemarksCode2 : null,

                "Dispute_Remarks_Line3__c": conDisputeRemarks && conDisputeRemarks.disputeRemarksLine3 ? conDisputeRemarks.disputeRemarksLine3 : null,
                "Dispute_Remarks_Line4__c": conDisputeRemarks && conDisputeRemarks.disputeRemarksLine4 ? conDisputeRemarks.disputeRemarksLine4 : null,
                "Dispute_Remarks_Line5__c": conDisputeRemarks && conDisputeRemarks.disputeRemarksLine5 ? conDisputeRemarks.disputeRemarksLine5 : null,
                "Dispute_Remarks_Line6__c": conDisputeRemarks && conDisputeRemarks.disputeRemarksLine6 ? conDisputeRemarks.disputeRemarksLine6 : null,*/


            }
            console.log("LID",ObjBreuResp);
            const bureau_resp = await prisma.bureau_hardpull_response__c.create({
                data: ObjBreuResp
            }); 
            console.log("LID",bureau_resp.id);

       

            let tuHardpull = {

                "RecordTypeId": '012710000003y1FAAQ',
                //"Bureau_Hardpull_Response_Id__c": bureau_resp.id,

                "Segment_Tag__c": idSegment && idSegment.segmentTag ? idSegment.segmentTag : null,
                "Id_Type__c": idSegment && idSegment.idType ? idSegment.idType : null,
                "Id_Number__c": idSegment && idSegment.idNumber ? idSegment.idNumber : null,
                "Issue_Date__c": idSegment && idSegment.issueDate ? idSegment.issueDate : null,
                "Expiration_Date__c": idSegment && idSegment.expirationDate ? idSegment.expirationDate : null,
                "Enriched_Through_Enquiry__c": idSegment && idSegment.enrichedThroughEnquiry ? idSegment.enrichedThroughEnquiry : null,
                //"Bureau_Hardpull_Response_Id__c": bureau_resp.id,

                "Segment_Tag__c": telSegment && telSegment.segmentTag ? telSegment.segmentTag : null,
                "Telephone_Number__c": telSegment && telSegment.telephoneNumber ? telSegment.telephoneNumber : null,
                "Telephone_Type__c": telSegment && telSegment.telephoneType ? telSegment.telephoneType : null,
                "Telephone_Extension__c": telSegment && telSegment.telephoneExtension ? telSegment.telephoneExtension : null,
                "Enriched_Through_Enquiry__c": telSegment && telSegment.enrichedThroughEnquiry ? telSegment.enrichedThroughEnquiry : null,
                //"Bureau_Hardpull_Response_Id__c": bureau_resp.id,

                "Segment_Tag__c": emailSegment && emailSegment.segmentTag ? emailSegment.segmentTag : null,
                "Email_Id__c": emailSegment && emailSegment.emailId ? emailSegment.emailId : null,
                //"Bureau_Hardpull_Response_Id__c": bureau_resp.id,

                "Segment_Tag__c": enquirySegment && enquirySegment.segmentTag ? enquirySegment.segmentTag : null,
                "Account_Number__c": enquirySegment && enquirySegment.accountNumber ? enquirySegment.accountNumber : null,
                //"Bureau_Hardpull_Response_Id__c": bureau_resp.id,

                "Score_Name__c": scoreSegment && scoreSegment.scoreName ? scoreSegment.scoreName : null,
                "Score_Card_Name__c": scoreSegment && scoreSegment.scoreCardName ? scoreSegment.scoreCardName : null,
                "Score_Card_Version__c": scoreSegment && scoreSegment.scoreCardVersion ? scoreSegment.scoreCardVersion : null,
                "Score_Date__c": scoreSegment && scoreSegment.scoreDate ? scoreSegment.scoreDate : null,
                "Score__c": scoreSegment && scoreSegment.score ? scoreSegment.score : null,
                "Exclusion_Code1__c": scoreSegment && scoreSegment.exclusionCode1 ? scoreSegment.exclusionCode1 : null,
                "Exclusion_Code2__c": scoreSegment && scoreSegment.exclusionCode2 ? scoreSegment.exclusionCode2 : null,
                "Exclusion_Code3__c": scoreSegment && scoreSegment.exclusionCode3 ? scoreSegment.exclusionCode3 : null,
                "Exclusion_Code4__c": scoreSegment && scoreSegment.exclusionCode4 ? scoreSegment.exclusionCode4 : null,
                "Exclusion_Code5__c": scoreSegment && scoreSegment.exclusionCode5 ? scoreSegment.exclusionCode5 : null,
                "Exclusion_Code6__c": scoreSegment && scoreSegment.exclusionCode6 ? scoreSegment.exclusionCode6 : null,
                "Exclusion_Code7__c": scoreSegment && scoreSegment.exclusionCode7 ? scoreSegment.exclusionCode7 : null,
                "Exclusion_Code8__c": scoreSegment && scoreSegment.exclusionCode8 ? scoreSegment.exclusionCode8 : null,
                "Exclusion_Code9__c": scoreSegment && scoreSegment.exclusionCode9 ? scoreSegment.exclusionCode9 : null,
                "Exclusion_Code10__c": scoreSegment && scoreSegment.exclusionCode10 ? scoreSegment.exclusionCode10 : null,
                "Reason_Code1__c": scoreSegment && scoreSegment.reasonCode1 ? scoreSegment.reasonCode1 : null,
                "Reason_Code2__c": scoreSegment && scoreSegment.reasonCode2 ? scoreSegment.reasonCode2 : null,
                "Reason_Code3__c": scoreSegment && scoreSegment.reasonCode3 ? scoreSegment.reasonCode3 : null,
                "Reason_Code4__c": scoreSegment && scoreSegment.reasonCode4 ? scoreSegment.reasonCode4 : null,
                "Reason_Code5__c": scoreSegment && scoreSegment.reasonCode5 ? scoreSegment.reasonCode5 : null,
                "Credit_Vision_Demonetisation_Algorithm1__c": scoreSegment && scoreSegment.creditVisionDemonetisationAlgorithm1 ? scoreSegment.creditVisionDemonetisationAlgorithm1 : null,
                "Credit_Vision_Demonetisation_Algorithm2__c": scoreSegment && scoreSegment.creditVisionDemonetisationAlgorithm2 ? scoreSegment.creditVisionDemonetisationAlgorithm2 : null,
                "Credit_Vision_Demonetisation_Algorithm3__c": scoreSegment && scoreSegment.creditVisionDemonetisationAlgorithm3 ? scoreSegment.creditVisionDemonetisationAlgorithm3 : null,
                "Credit_Vision_Demonetisation_Algorithm4__c": scoreSegment && scoreSegment.creditVisionDemonetisationAlgorithm4 ? scoreSegment.creditVisionDemonetisationAlgorithm4 : null,
                "Bureau_Characteristics17__c": scoreSegment && scoreSegment.bureauCharacteristics17 ? scoreSegment.bureauCharacteristics17 : null,
                "Bureau_Characteristics27__c": scoreSegment && scoreSegment.bureauCharacteristics27 ? scoreSegment.bureauCharacteristics27 : null,
                "Bureau_Characteristics37__c": scoreSegment && scoreSegment.bureauCharacteristics37 ? scoreSegment.bureauCharacteristics37 : null,
                "Bureau_Characteristics47__c": scoreSegment && scoreSegment.bureauCharacteristics47 ? scoreSegment.bureauCharacteristics47 : null,
                "Bureau_Characteristics57__c": scoreSegment && scoreSegment.bureauCharacteristics57 ? scoreSegment.bureauCharacteristics57 : null,
                "Bureau_Characteristics67__c": scoreSegment && scoreSegment.bureauCharacteristics67 ? scoreSegment.bureauCharacteristics67 : null,
                "Bureau_Characteristics77__c": scoreSegment && scoreSegment.bureauCharacteristics77 ? scoreSegment.bureauCharacteristics77 : null,
                //"Bureau_Hardpull_Response_Id__c": bureau_resp.id,

                "Segment_Tag__c": addressSegment && addressSegment.segmentTag ? addressSegment.segmentTag : null,
                "Address_Line1__c": addressSegment && addressSegment.addressLine1 ? addressSegment.addressLine1 : null,
                "Address_Line2__c": addressSegment && addressSegment.addressLine2 ? addressSegment.addressLine2 : null,
                "Address_Line3__c": addressSegment && addressSegment.addressLine3 ? addressSegment.addressLine3 : null,
                "Address_Line4__c": addressSegment && addressSegment.addressLine4 ? addressSegment.addressLine4 : null,
                "Address_Line5__c": addressSegment && addressSegment.addressLine5 ? addressSegment.addressLine5 : null,
                "State_Code__c": addressSegment && addressSegment.stateCode ? addressSegment.stateCode : null,
                "Pincode__c": addressSegment && addressSegment.pinCode ? addressSegment.pinCode : null,
                "Address_Category__c": addressSegment && addressSegment.addressCategory ? addressSegment.addressCategory : null,
                "Residence_Code__c": addressSegment && addressSegment.residenceCode ? addressSegment.residenceCode : null,
                "Date_Reported__c": addressSegment && addressSegment.dateReported ? addressSegment.dateReported : null,
                "Member_Short_Name__c": addressSegment && addressSegment.memberShortName ? addressSegment.memberShortName : null,
                "Enriched_Through_Enquiry__c": addressSegment && addressSegment.enrichedThroughEnquiry ? addressSegment.enrichedThroughEnquiry : null,
                 //"Bureau_Hardpull_Response_Id__c": bureau_resp.id,

                 "Segment_Tag__c": accountSegment && accountSegment.segmentTag ? accountSegment.segmentTag : null,
                 "Reporting_Member_Short_Name__c": accountSegment && accountSegment.reportingMemberShortName ? accountSegment.reportingMemberShortName : null,
                 "Account_Number__c": accountSegment && accountSegment.accountNumber ? accountSegment.accountNumber : null,
                 "Account_Type__c": accountSegment && accountSegment.accountType ? accountSegment.accountType : null,
                 "Ownership_Indicator__c": accountSegment && accountSegment.ownershipIndicator ? accountSegment.ownershipIndicator : null,
                 "Date_Opened_Disbursed__c": accountSegment && accountSegment.dateOpenedDisbursed ? accountSegment.dateOpenedDisbursed : null,
                 "Date_Of_Last_Payment__c": accountSegment && accountSegment.dateOfLastPayment ? accountSegment.dateOfLastPayment : null,
                 "Date_Closed__c": accountSegment && accountSegment.dateClosed ? accountSegment.dateClosed : null,
                 "Date_Reported_And_Certified__c": accountSegment && accountSegment.dateReportedAndCertified ? accountSegment.dateReportedAndCertified : null,
                 "High_Credit_Sanctioned_Amount__c": accountSegment && accountSegment.highCreditSanctionedAmount ? accountSegment.highCreditSanctionedAmount : null,
                 "Current_Balance__c": accountSegment && accountSegment.currentBalance ? accountSegment.currentBalance : null,
                 "Amount_Overdue__c": accountSegment && accountSegment.amountOverdue ? accountSegment.amountOverdue : null,
                 "Enriched_Through_Enquiry__c": accountSegment && accountSegment.enrichedThroughEnquiry ? accountSegment.enrichedThroughEnquiry : null,
                 "Payment_History1__c": accountSegment && accountSegment.paymentHistory1 ? accountSegment.paymentHistory1 : null,
                 "Payment_History2__c": accountSegment && accountSegment.paymentHistory2 ? accountSegment.paymentHistory2 : null,
                 "Payment_History_Start_Date__c": accountSegment && accountSegment.paymentHistoryStartDate ? accountSegment.paymentHistoryStartDate : null,
                 "Payment_History_End_Date__c": accountSegment && accountSegment.paymentHistoryEndDate ? accountSegment.paymentHistoryEndDate : null,
                 "Suit_Filed_Wilful_Default__c": accountSegment && accountSegment.suitFiledWilfulDefault ? accountSegment.suitFiledWilfulDefault : null,
                 "Credit_Facility_Status__c": accountSegment && accountSegment.creditFacilityStatus ? accountSegment.creditFacilityStatus : null,
                 "Value_Of_Collateral__c": accountSegment && accountSegment.valueOfCollateral ? accountSegment.valueOfCollateral : null,
                 "Type_Of_Collateral__c": accountSegment && accountSegment.typeOfCollateral ? accountSegment.typeOfCollateral : null,
                 "Credit_Limit__c": accountSegment && accountSegment.creditLimit ? accountSegment.creditLimit : null,
                 "Repayment_Tenure__c": accountSegment && accountSegment.repaymentTenure ? accountSegment.repaymentTenure : null,
                 //"Bureau_Hardpull_Response_Id__c": bureau_resp.id,
               
                 "Segment_Tag__c": accountSummaryT1Segment && accountSummaryT1Segment.segmentTag ? accountSummaryT1Segment.segmentTag : null,
                 "Reporting_Member_Short_Name__c": accountSummaryT1Segment && accountSummaryT1Segment.reportingMemberShortName ? accountSummaryT1Segment.reportingMemberShortName : null,
                 //"Bureau_Hardpull_Response_Id__c": bureau_resp.id,

                 "Segment_Tag__c": enquirySegment && enquirySegment.segmentTag ? enquirySegment.segmentTag : null,
                 "Date_Of_Enquiry__c": enquirySegment && enquirySegment.dateOfEnquiry ? enquirySegment.dateOfEnquiry : null,
                 "Enquiring_Member_Short_Name__c": enquirySegment && enquirySegment.enquiringMemberShortName ? enquirySegment.enquiringMemberShortName : null,
                 "Enquiry_Purpose__c": enquirySegment && enquirySegment.enquiryPurpose ? enquirySegment.enquiryPurpose : null,
                 "Enquiry_Amount__c": enquirySegment && enquirySegment.enquiryAmount ? enquirySegment.enquiryAmount : null,
                 //"Bureau_Hardpull_Response_Id__c": bureau_resp.id,
            }

           /*  console.log("TUPULL",tuHardpull);
            const bureau_resp1 = await prisma.bureau_hardpull_segment__c.create({
                data: tuHardpull
            }); 
            console.log("LID",bureau_resp1.id);
            */ 
            let user_limit = accountSegment && accountSegment.highCreditSanctionedAmount?accountSegment.highCreditSanctionedAmount: 0;
            let bureau_limit_data = {
                "applicationin": {
                    "appno": "261214",
                    "protectiontype": "PRINCIPAL + INTEREST PROTECTION",
                    "callsegmentation": 1,
                    "cibilsuccessful": "Y",
                    "alias": "EDVNZ",
                    "typeofsurrogateprogram": "IMDB SURROGATE PROGRAM",
                    "loanappliedstudent": 69000,
                    "noofcourses": 0,        
                    "institutememberorrecognized": 0,
                    "droppedleads": 0,
                    "instituteoperatingyears": 0,
                    "instituteaccredited": 0,
                    "operationalyearsofinstitute": 0,
                    "corporatecourse": 0,
                    "residentialcampus": 0,
                    "enachflowenabled": "N",
                    "coursetenor": 6
                },
                "applicant": [
                    {
                        "applicantin": {
                            "applicantdetails": {
                                "cccid": "347973",
                                "dateofbirth": nameSegment && nameSegment.dateOfBirth ? nameSegment.dateOfBirth : "",
                                "incometaxpan": pan,
                                "fname": nameSegment && nameSegment.consumerNameField1 ? nameSegment.consumerNameField1 : "",
                                "lname": nameSegment && nameSegment.lastName ? nameSegment.lastName : "",
                                "landmark": address ? address : "",
                                "roadnonamearealocality": "",
                                "applicantcategory": "0",
                                "constitution": "SALARIED",
                                "applicanttype": "1",
                                "relationshipwithapplicant": "0",
                                "maritalstatus": "",
                                "gender": "MALE",				
                                "coborrowerrequired": "0",
                                "residenttype": "ZZ"
                            },
                            "addressdetails1": {
                                "residencetype": "ZZ",
                                "pincode": 591302,
                                "addresstype": "CURRENT ADDRESS",
                                "city": city
                            },
                            "addressdetails2": {
                                "residencetype": "ZZ",
                                "pincode": 591302,
                                "addresstype": "PERMANENT ADDRESS",
                                "city": city
                            },
                            "employmentdetails": {
                                "companycategory": "ZZ",
                                "employertype": "ZZ"
                            },
                            "bureau": {
                                "enquirydetail": [
                                    {
                                        "dateofenquiry": addressSegment && addressSegment.dateReported?addressSegment.dateReported:'',//currentApplicationData.reportDate ? currentApplicationData.reportDate : "",
                                        "enquirypurpose": "0",
                                        "enqiuryamount": 0,
                                        "membername": "EDUVFIN",
                                    }
                                ],
                                "bureauemploymentdetails": {
                                    "income": empSegment && empSegment.income ? parseInt(empSegment.income) : 0,
                                    "occupationcode": empSegment && empSegment.occupationCode ? parseInt(empSegment.occupationCode) : "",
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
                                    "score": scoreSegment && scoreSegment.score ? parseInt(scoreSegment.score) : 0,
                                    "cibildate": "20211012",
                                    "riskbandscore": 0
                                },
                                "accountdetail": [
                                    {
                                        "accounttype": accountSegment && accountSegment.accountType?accountSegment.accountType:'',
                                        "accountnumber": accountSegment && accountSegment.accountNumber?accountSegment.accountNumber:'',
                                        "amountoverdue": 4408,
                                        "currentbalance": accountSegment && accountSegment.currentBalance?accountSegment.currentBalance: 0,
                                        "dateclosed": accountSegment && accountSegment.dateClosed?accountSegment.dateClosed:'',
                                        "dateoflastpayment": accountSegment && accountSegment.dateOfLastPayment?accountSegment.dateOfLastPayment:'20210602',
                                        "dateopeneddisbursed": "20200919",
                                        "datereported": accountSegment && accountSegment.dateReportedAndCertified?accountSegment.dateReportedAndCertified:'20210831',
                                        "highcreditsanctionedamount": accountSegment && accountSegment.highCreditSanctionedAmount?accountSegment.highCreditSanctionedAmount: 156580,
                                        "ownershipindicator": "1",
                                        "paymentfrequency": 0,
                                        "paymenthistory1": "",
                                        "paymenthistory2": "",
                                        "paymenthistoryenddate": "20200901",
                                        "paymenthistorystartdate": "20210801",
                                        "suitfiledstatus": "0",
                                        "wofsettledstatus": "0",
                                        "creditlimit": accountSegment && accountSegment.highCreditSanctionedAmount?accountSegment.highCreditSanctionedAmount:0,
                                        "emiamount": 0  
                                    }
                                ]
                            }
                        }
                    }
                ]
            }

           /*  let bureau_limit_data = {
                "applicationin": {
                    "appno": "261214",
                    "protectiontype": "PRINCIPAL + INTEREST PROTECTION",
                    "callsegmentation": 1,
                    "cibilsuccessful": "Y",
                    "alias": "EDVNZ",
                    "typeofsurrogateprogram": "IMDB SURROGATE PROGRAM",
                    "loanappliedstudent": 69000,
                    "noofcourses": 0,        
                    "institutememberorrecognized": 0,
                    "droppedleads": 0,
                    "instituteoperatingyears": 0,
                    "instituteaccredited": 0,
                    "operationalyearsofinstitute": 0,
                    "corporatecourse": 0,
                    "residentialcampus": 0,
                    "enachflowenabled": "N",
                    "coursetenor": 6
                },
                "applicant": [
                    {
                        "applicantin": {
                            "applicantdetails": {
                                "cccid": "347973",
                                "dateofbirth": "19910629",	
                                "incometaxpan": "ZZ",
                                "fname": "KRISHNA",
                                "lname": "HARIBENAKE",
                                "landmark": "GARLAGUNJI KHANAPUR BELGAUM",
                                "roadnonamearealocality": "273 KULKARNI GALLI",
                                "applicantcategory": "0",
                                "constitution": "SALARIED",
                                "applicanttype": "1",
                                "relationshipwithapplicant": "0",
                                "maritalstatus": "MARRIED",
                                "gender": "MALE",					
                                "coborrowerrequired": "0",
                                "residenttype": "ZZ"
                            },
                            "addressdetails1": {
                                "residencetype": "ZZ",
                                "pincode": 591302,
                                "addresstype": "CURRENT ADDRESS",
                                "city": "BELGAUM"
                            },
                            "addressdetails2": {
                                "residencetype": "ZZ",
                                "pincode": 591302,
                                "addresstype": "PERMANENT ADDRESS",
                                "city": "BELGAUM"
                            },
                            "employmentdetails": {
                                "companycategory": "ZZ",
                                "employertype": "ZZ"
                            },
                            "bureau": {
                                "enquirydetail": [
                                    {
                                        "dateofenquiry": "20211012",
                                        "enquirypurpose": "08",
                                        "enqiuryamount": 200000,					
                                        "membername": "MR. KRISHNA HARI BENAKE"
                                    }
                                ],
                                "bureauemploymentdetails": {
                                    "income": 0,
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
                                    "cibildate": "20211012",
                                    "riskbandscore": 0
                                },
                                "accountdetail": [
                                    {
                                        "accounttype": "06",
                                        "accountnumber": "0",
                                        "amountoverdue": 4408,
                                        "currentbalance": 4408,
                                        "dateclosed": "19000101",
                                        "dateoflastpayment": "20210602",
                                        "dateopeneddisbursed": "20200919",
                                        "datereported": "20210831",
                                        "highcreditsanctionedamount": 5658,
                                        "ownershipindicator": "1",
                                        "paymentfrequency": 0,
                                        "paymenthistory1": "",
                                        "paymenthistory2": "",
                                        "paymenthistoryenddate": "20200901",
                                        "paymenthistorystartdate": "20210801",
                                        "suitfiledstatus": "0",
                                        "wofsettledstatus": "0",
                                        "creditlimit": 0,
                                        "emiamount": 0  
                                    }
                                ]
                            }
                        }
                    }
                ]
            } */
            console.log("bureau_limit_data", bureau_limit_data);
            const headers = new Headers();
            headers.append("transaction_id", "ebf96f29-7174-45ad-9a51-a0f94324fe35");
            headers.append("client_id", "918e4acddf60379f8ef62a1a07ee4a14d807ab7e");
            headers.append("client_secret", "e448ec974f91c73a23cf1d672b8ba548b34ec182");
            headers.append("channel_id", "MOB");
            headers.append("X-Screenless-Kill-Null", "true");
            headers.append("x-user-domain", "demo-ica-apac.co.in");
            headers.append("x-correlation-id", "098914ae-b335-4424-8fc0-670e5e07c424");
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json");
            const init = {
                method: 'POST',
                headers,
                body: JSON.stringify(bureau_limit_data)
            };
            const get_limit_data = await fetch(BUREAU_LIMIT, init).then((response) => response.json())
                .then((response) => {
                    return response;
                });
            console.log("get_limit_data", get_limit_data);
           
            let loggerObj2 = {
                method: "POST",
                sfid: sfid,
                service: "BRE LIMIT 1",
                resData: JSON.stringify(bureau_limit_data)
            }
            await apiLogger(loggerObj2);
           const checkdata = await checkBreLimit(get_limit_data, sfid);
           user_limit = checkdata && checkdata?checkdata: user_limit;
           return { status: "success", message: 'Success', limit: user_limit, tu_data:getdata, limit_data: get_limit_data }
        } else {
            let errorObj = {
                method: "POST",
                sfid: sfid,
                service: "TU HARD PULL",
                resData: JSON.stringify(getdata)
            }
            await customError(errorObj);
            return { status: "error", message: getdata.message ? getdata.message : getdata };
        }

    } catch (error) {
        return { status: "error", message: error.message ? error.message : error }
    }
}

async function apiLogger(getData)
{
    const { method, sfid, service, resData} = getData
    console.log("getData", getData);
    await prisma.api_logger__c.create({
        data: {
            currencyisocode: "INR",
            isdeleted: false,
            request__c: String(resData),
            response__c: "Result",
            service__c: service,
            account__c: sfid
        },
    });
}

async function customError(getData)
{
    const { method, sfid, service, resData} = getData
    await prisma.custom_error__c.create({
        data: {
            method_name__c: method,
            exception_message__c: String(resData),
            account__c: sfid,
            service__c: service,
        },
    });
}

async function apiExternalLogger(getData)
{
    const { method, sfid, service, resData, tempid} = getData
    console.log("getData", getData);
    await prisma.api_logger__c.create({
        data: {
            currencyisocode: "INR",
            isdeleted: false,
            request__c: String(resData),
            response__c: "Result",
            service__c: service,
            sfid: tempid,
            heroku_external_id__c: tempid
        },
    });
}

async function customExternalError(getData)
{
    const { method, sfid, service, resData, tempid} = getData
    await prisma.custom_error__c.create({
        data: {
            method_name__c: method,
            exception_message__c: String(resData),
            service__c: service,
            heroku_external_id__c: tempid.toString()
        },
    });
}

function formatDateSeparator(DateFormat) {
    if (!DateFormat) {
        return '';
    }
    const date1 = moment(DateFormat).format("YYYY/MM/DD");
    const arrData = date1.split("/");
    console.log("DateFormat", DateFormat);
    console.log("date1", date1);
    console.log("arrData", arrData);
    let year = arrData[0];
    let month = arrData[1];
    let date = arrData[2];
    return date+month+year;
}

function formatDate(DateFormat) {
    if (!DateFormat) {
        return [];
    }
    const date1 = moment(DateFormat).format("DD-MMM-YYYY");
    return date1
}

function getNumber(value) {
    return (+value) ? +value : 0;
}