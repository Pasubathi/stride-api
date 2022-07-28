
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";

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
                
                var requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };
                
              const getdata = await  fetch("http://s-edvnz-bureau-api.sg-s1.cloudhub.io/api/bureau/hardpull", requestOptions)
              .then((response) => response.json())
              .then((response) => {
                  return response;
              });
           
            if (getdata) {         
                
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
                //console.log("TUPULL",tuHardpull);

                /*console.log("TUPULL",tuHardpull);
                const bureau_resp1 = await prisma.bureau_hardpull_segment__c.create({
                    data: tuHardpull
                }); 
                console.log("LID",bureau_resp1.id);*/

                return res.status(200).send({ status: "success", message: 'Success', data:getdata });
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
    let year = DateFormat.substring(0, 4);
    let month = DateFormat.substring(4, 6);
    let date = DateFormat.substring(6, 8);
    return new Date(year + "-" + month + "-" + date);
}

function getNumber(value) {
    return (+value) ? +value : 0;
}