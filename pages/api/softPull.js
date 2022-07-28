
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { SOFT_PULL } from "./api";
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)
export default async function bureauResponse(req, res) {
    await cors(req, res);
    switch (req.method) {
        case 'POST':
            return bureauResponse();
        default:
            return res.status(405).send({ responseCode: 405, message: `Method ${req.method} Not Allowed` })
    }
    async function bureauResponse() {
        try {
            const { id } = req.body;
            if (id == "" || id == undefined)
                return res.status(200).send({ status: "error", message: "Account id is mandatory" })
            /*  const accountDet = await prisma.account.findFirst({
                 where: {
                     id: id
                 }
             }); */

              /* let data = {
                "applicationin": {
                    "alias": "EDVNZSM",
                    "appno": "edu1640175311743"
                },
                "applicant": [
                    {
                     "applicantin": {
                        "applicantdetails": {
                           "cccid": "11025",
                           "lname": "b",
                           "fname": "avigyan",
                           "mobilephone": "8447930170"
                        }
                     }
                    }
                ] 
            } */
            /* let data = {
                "applicationin": {
                    "alias": "edvnzsm",
                    "appno": ""
                },
                "applicant": {
                    "applicantin": {
                        "applicantdetails": {
                            "cccid": "",
                            "lname": "pandurangan",
                            "fname": "murugan",
                            "mobilephone": "9894204012"
                        }
                    }
                }

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
            const getdata = await fetch(SOFT_PULL, init).then((response) => response.json())
                .then((response) => {
                    return response;
                });
 */
                var myHeaders = new Headers();
                myHeaders.append("Accept", "application/json");
                myHeaders.append("transaction_id", "ebf96f29-7174-45ad-9a51-a0f94324fe35");
                myHeaders.append("client_id", "918e4acddf60379f8ef62a1a07ee4a14d807ab7e");
                myHeaders.append("client_secret", "e448ec974f91c73a23cf1d672b8ba548b34ec182");
                myHeaders.append("channel_id", "MOB");
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
                          "lname": "Challa",
                          "fname": "Sai",
                          "mobilephone": "9347876793"
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
                
              const getdata = await  fetch("http://s-edvnz-bre-api.sg-s1.cloudhub.io/api/bre/edvnzsm", requestOptions)
              .then((response) => response.json())
              .then((response) => {
                  return response;
              });
                  //console.log("SoftPull", getdata);
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
                let obj = {
                    limit: limit,
                    pan: pan
                }

                let ObjBreuResp = {
                    "app_no__c": applicationoutVal.appno ? applicationoutVal.appno : "",
                    "derog_found__c": applicationoutVal.derogfound ? applicationoutVal.derogfound : "",
                    "imdb_fail__c": imdbfailObj.referenceNumber ? imdbfailObj.referenceNumber : "",
                    "bureau_desc__c": applicatOutData.bureaudesc ? applicatOutData.bureaudesc : "",
                    "bureau_msg__c": applicatOutData.bureaumsg ? applicatOutData.bureaumsg : "",
                    "bureau_score__c": applicatOutData.bureauscore ? applicatOutData.bureauscore: "",
                    //"ipa_basis_bureau__c": imdbfailObj.enquiryControlNumber ? imdbfailObj.enquiryControlNumber : "",
                    //"ipan_on_ipa__c": imdbfailObj.enquiryControlNumber ? imdbfailObj.enquiryControlNumber : "",
                    //"non_cc_tradelines__c": "",
                    "account_type__c": bureausurrogate.accounttype ? bureausurrogate.accounttype : "",
                    "age_in_bureau_gt_24_months__c": bureausurrogate.ageinbureaugt24months ? bureausurrogate.ageinbureaugt24months : "",
                    "credit_card_utilization__c": bureausurrogate.creditcardutilization ? getNumber(bureausurrogate.creditcardutilization) : 0,
                    "derog_status__c": bureausurrogate.derogstatus ? bureausurrogate.derogstatus : "",
                    "experian_score__c": bureausurrogate.experianscore ? bureausurrogate.experianscore : "",
                    "high_sanction_amount__c": bureausurrogate.highsanctionamount ? bureausurrogate.highsanctionamount : "",
                    "mob__c": bureausurrogate.mob ? bureausurrogate.mob : "",
                    "multiplier__c": bureausurrogate.multiplier ? bureausurrogate.multiplier : "",
                    //"ninty_plus_in_last_12_months__c": bureauscoreObj.nintyplusinlast12months ?  getNumber(bureauscoreObj.nintyplusinlast12months) : 0,
                    "no_credit_card_in_180_pl_dpd__c": bureausurrogate.nocreditcardin180pldpd ? getNumber(bureausurrogate.nocreditcardin180pldpd) : 0,
                    "non_addon_trade_last_24mon_min_24vin__c": bureausurrogate.noofnonaddontradelinesinlast24monthswithmin24monthsvintage ? bureausurrogate.noofnonaddontradelinesinlast24monthswithmin24monthsvintage : "",
                    "secured_tradewithin_24mon_with_18rtr__c": bureausurrogate.noofsecuredtradelineswithin24monthswith18rtr ? getNumber(bureausurrogate.noofsecuredtradelineswithin24monthswith18rtr) : 0,
                    "over_due_amoun_tgt_0__c": bureausurrogate.overdueamountgt0 ? getNumber(bureausurrogate.overdueamountgt0) : 0,
                    "over_due_gt_5000_in_tradeline__c": bureausurrogate.overduegt5000intradeline ? getNumber(bureausurrogate.overduegt5000intradeline) : 0,
                    "secured_tradelines__c": bureausurrogate.securedtradeline ? bureausurrogate.securedtradeline : "",
                    "sf_will_fulde_fault_dbt_lsssma_sub__c": bureausurrogate.sfwillfuldefaultdbtlsssmasub ? getNumber(bureausurrogate.sfwillfuldefaultdbtlsssmasub) : 0,
                    "thick_or_thin__c": bureausurrogate.thickorthin ? bureausurrogate.thickorthin : "",
                    "thin__c": bureausurrogate.thin ? bureausurrogate.thin : "",
                    "thirty_plus_in_last_3_months__c": bureausurrogate.thirtyplusinlast3months ? getNumber(bureausurrogate.thirtyplusinlast3months) : 0,
                    "total_no_of_tradeline__c": bureausurrogate.totalnooftradeline ? bureausurrogate.totalnooftradeline : "",
                    "unsecured_tradelines__c": bureausurrogate.unsecuredtradeline ? bureausurrogate.unsecuredtradeline : "",
                    "unsecure_utilization_exclude_creditc__c": bureausurrogate.unsecuredutilizationexcludingcreditcards ? bureausurrogate.unsecuredutilizationexcludingcreditcards : "",
                    "zero_plus_in_last_12_months__c": bureausurrogate.zeroplusinlast12months ? getNumber(bureausurrogate.zeroplusinlast12months) : 0,
                    "system_code__c": inproHeader.systemcode ? getNumber(inproHeader.systemcode) : 0,
                    "report_date__c": inproHeader.reportdate ? formatDate(inproHeader.reportdate) : new Date(),
                    "report_time__c": inproHeader.reporttime ? inproHeader.reporttime : null,
                    "user_message_text__c": userMsg.usermessagetext ? userMsg.usermessagetext : null,
                    "enquiry_username__c": creditProfile.enquiryusername ? creditProfile.enquiryusername : null,
                    "version__c": creditProfile.version ? creditProfile.version : null,
                    "report_number__c": creditProfile.reportnumber ? getNumber(creditProfile.reportnumber) : 0,
                    "subscriber__c": creditProfile.subscriber ? creditProfile.subscriber : "",
                    "subscriber_name__c": creditProfile.subscribername ? creditProfile.subscribername : "",
                    "customer_reference_id__c": creditProfile.customerreferenceid ? creditProfile.customerreferenceid : "",
                    "enquiry_reason__c": curntAppData.enquiryreason ? curntAppData.enquiryreason : "",
                    "finance_purpose__c": curntAppData.financepurpose ? curntAppData.financepurpose : "",
                    "amount_financed__c": curntAppData.amountfinanced ? getNumber(curntAppData.amountfinanced) : 0,
                    "duration_of_agreement__c": curntAppData.durationofagreement ? getNumber(curntAppData.durationofagreement) : 0,
                    "credit_account_total__c": creditaccountObj.creditaccounttotal ? creditaccountObj.creditaccounttotal : "",
                    "credit_account_active__c": creditaccountObj.creditaccountactive ? creditaccountObj.creditaccountactive : "",
                    "credit_account_default__c": creditaccountObj.creditaccountdefault ? getNumber(creditaccountObj.creditaccountdefault) : 0,
                    "credit_account_closed__c": creditaccountObj.creditaccountclosed ? creditaccountObj.creditaccountclosed : "",
                    "cad_suit_filed_current_balance__c": creditaccountObj.cadsuitfiledcurrentbalance ? getNumber(creditaccountObj.cadsuitfiledcurrentbalance) : 0,
                    "out_standing_balance_secured__c": totaloutstandingObj.outstandingbalancesecured ? totaloutstandingObj.outstandingbalancesecured : "",
                    "out_standing_balance_secured_percentage__c": totaloutstandingObj.outstandingbalancesecuredpercentage ? totaloutstandingObj.outstandingbalancesecuredpercentage : "",
                    "outstanding_balance_unsecured__c": totaloutstandingObj.outstandingbalanceunsecured ? totaloutstandingObj.outstandingbalanceunsecured : "",
                    "outstanding_balance_unsecured_percentage__c": totaloutstandingObj.totaloutstandingObj ? totaloutstandingObj.outstandingbalanceunsecuredpercentage : "",
                    "outstanding_balance_all__c": totaloutstandingObj.outstandingbalanceall ? totaloutstandingObj.outstandingbalanceall : ""

                }

                console.log("obj", obj);
                console.log("ObjBreuResp", ObjBreuResp);

 
                let ObjApplicantDetail = {
                    "last_name__c": curntApplicantData && curntApplicantData.lastname ? curntApplicantData.lastname : "",
                    "first_name__c": curntApplicantData && curntApplicantData.firstname ? curntApplicantData.firstname : "",
                    "gender_code__c": curntApplicantData && curntApplicantData.gendercode ? curntApplicantData.gendercode : "",
                    "income_tax_pan__c": curntApplicantData && curntApplicantData.incometaxpan ? curntApplicantData.incometaxpan : "",
                    "date_of_birth_applicant__c": curntApplicantData && curntApplicantData.dateofbirthapplicant ? formatDate(curntApplicantData.dateofbirthapplicant) : new Date(),
                    "mobile_phone_number__c": curntApplicantData && curntApplicantData.mobilephonenumber ? curntApplicantData.mobilephonenumber : "",
                    "income__c": currentotherObj && currentotherObj.income ? getNumber(currentotherObj.income) : 0,
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
                    heroku_external_id__c: tempid,
                    name: "Softpull",
                    account__c: '',
                    address__c: reqAdd,
                    city__c: currentAppAddress && currentAppAddress.city ? currentAppAddress.city : "",
                    pincode__c: currentAppAddress && currentAppAddress.pincode ? currentAppAddress.pincode : "",
                };

                await prisma.address__c.create({
                    data: addressData
                });

                let ObjCaisAccountDetail = {
                    "identification_number__c": caisaAccountRow && caisaAccountRow.identificationnumber ? caisaAccountRow.identificationnumber : null,
                    "subscriber_name__c": caisaAccountRow && caisaAccountRow.subscribername ? caisaAccountRow.subscribername : null,
                    "account_number__c": caisaAccountRow && caisaAccountRow.accountnumber ? caisaAccountRow.accountnumber : null,
                    "portfolio_type__c": caisaAccountRow && caisaAccountRow.portfoliotype ? caisaAccountRow.portfoliotype : null,
                    "account_type__c": caisaAccountRow && caisaAccountRow.accounttype ? caisaAccountRow.accounttype : null,
                    "open_date__c": caisaAccountRow && caisaAccountRow.opendate ? formatDate(caisaAccountRow.opendate) : new Date(),
                    "highest_credit_ororiginal_loan_amount__c": caisaAccountRow && caisaAccountRow.highestcreditororiginalloanamount ? caisaAccountRow.highestcreditororiginalloanamount : null,
                    "terms_frequency__c": caisaAccountRow && caisaAccountRow.termsfrequency ? caisaAccountRow.termsfrequency : null,
                    "account_status__c": caisaAccountRow && caisaAccountRow.accountstatus ? caisaAccountRow.accountstatus : null,
                    "payment_rating__c": caisaAccountRow && caisaAccountRow.paymentrating ? getNumber(caisaAccountRow.paymentrating) : 0,
                    "payment_history_profile__c": caisaAccountRow && caisaAccountRow.paymenthistoryprofile ? caisaAccountRow.paymenthistoryprofile : null,
                    "current_balance__c": caisaAccountRow && caisaAccountRow.currentbalance ? caisaAccountRow.currentbalance : null,
                    "amount_past_due__c": caisaAccountRow && caisaAccountRow.amountpastdue ? getNumber(caisaAccountRow.amountpastdue) : 0,
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
                    "date_of_birth__c": caisholderData && caisholderData.dateofbirth ? formatDate(caisholderData.dateofbirth) : null,
                    "email_id__c": caisholderphoneData && caisholderphoneData.emailid ? caisholderphoneData.emailid : null,
                    "year__c": caisaccountHistory && caisaccountHistory.year ? caisaccountHistory.year : null,
                    "month__c": caisaccountHistory && caisaccountHistory.month ? caisaccountHistory.month : null,
                    "days_past_due__c": caisaccountHistory && caisaccountHistory.dayspastdue ? getNumber(caisaccountHistory.dayspastdue) : null,
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
                return res.status(200).send({ status: "success", message: 'Success' });
            } else {
                return res.status(200).send({ status: "error", message: getdata.message ? getdata.message : getdata });
            }

        } catch (error) {
            return res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

function formatDate(DateFormat) {
    if (!DateFormat) {
        return [];
    }
    return;
    let year = DateFormat.substring(0, 4);
    let month = DateFormat.substring(4, 6);
    let date = DateFormat.substring(6, 8);
    return new Date(year + "-" + month + "-" + date);
}

function getNumber(value) {
    return (+value) ? +value : 0;
}