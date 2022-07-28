
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';
import { prisma } from "./_base";
import { HARD_PULL } from "./api";
import e from 'cors';
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
             const accountDet = await prisma.account.findFirst({
                 where: {
                     id: id
                 }
             });
            if(accountDet)
            {
                const addressDet = await prisma.address__c.findFirst({
                    where: {
                        account__c: accountDet.sfid
                    }
                });
            let data = {
                "firstName": accountDet.first_name__c,
                "middleName": "",
                "lastName": accountDet.last_name__c,
                "dateOfBirth": "30041972",
                "gender": "2",
                "panNo": accountDet.pan_number__c,
                "passportNumber": "",
                "dlno": "",
                "voterId": "",
                "uid": "",
                "idType": "01",
                "telephoneExtension": "",
                "telephoneNumber": accountDet.phone,
                "addressLine1": ``,
                "addressLine2": "KASGANG U.P.",
                "addressType": "01",
                "city": addressDet.city__c,
                "pinCode": addressDet.pincode__c,
                "residenceType": "02",
                "stateCode": "09",
                "purpose": "08",
                "amount": "150000"
            }
            const channel_id = process.env.MOB_CHANNEL_ID;
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
            const getdata = await fetch(HARD_PULL, init).then((response) => response.json())
                .then((response) => {
                    return response;
                });
            let bhrarrData = [];
            if (getdata.header !== undefined) {
                let headerVal = getdata.header;
                bhrarrData.push({
                    "segment_tag__c": headerVal.segmentTag ? headerVal.segmentTag : "",
                    "version__c": headerVal.version ? parseInt(headerVal.version) : 0,
                    "reference_number__c": headerVal.referenceNumber ? parseInt(headerVal.referenceNumber) : 0,
                    "member_code__c": headerVal.memberCode ? headerVal.memberCode : "",
                    "subject_return_code__c": headerVal.subjectReturnCode ? parseInt(headerVal.subjectReturnCode) : 0,
                    "enquiry_control_number__c": headerVal.enquiryControlNumber ? headerVal.enquiryControlNumber : "",
                    "date_processed__c": headerVal.dateProcessed ? parseInt(headerVal.dateProcessed) : 0,
                    "time_processed__c": headerVal.timeProcessed ? parseInt(headerVal.timeProcessed) : 0
                })
                let nameSegmentVal = getdata.nameSegment ? getdata.nameSegment : "";
                bhrarrData.push({
                    "segment_tag__c": nameSegmentVal.segmentTag ? nameSegmentVal.segmentTag : "",
                    "consumer_name_field1__c": nameSegmentVal.consumerNameField1 ? nameSegmentVal.consumerNameField1 : "",
                    "consumer_name_field2__c": nameSegmentVal.consumerNameField2 ? nameSegmentVal.consumerNameField2 : "",
                    "consumer_name_field3__c": nameSegmentVal.consumerNameField3 ? nameSegmentVal.consumerNameField3 : "",
                    "consumer_name_field4__c": nameSegmentVal.consumerNameField4 ? nameSegmentVal.consumerNameField4 : "",
                    "consumer_name_field5__c": nameSegmentVal.consumerNameField5 ? nameSegmentVal.consumerNameField5 : "",
                    "date_of_birth__c": nameSegmentVal.dateOfBirth ? nameSegmentVal.dateOfBirth : "",
                    "gender__c": nameSegmentVal.gender ? nameSegmentVal.gender : "",
                    "date_of_entry_for_error_code__c": nameSegmentVal.dateOfEntryForErrorCode ? nameSegmentVal.dateOfEntryForErrorCode : "",
                    "error_segment_tag__c": nameSegmentVal.errorSegmentTag ? nameSegmentVal.errorSegmentTag : "",
                    "error_code__c": nameSegmentVal.errorCode ? nameSegmentVal.errorCode : "",
                    "date_of_entry_for_cibil_remarks_code__c": nameSegmentVal.dateOfEntryForCibilRemarksCode ? nameSegmentVal.dateOfEntryForCibilRemarksCode : "",
                    "cibil_remarks_code__c": nameSegmentVal.cibilRemarksCode ? nameSegmentVal.cibilRemarksCode : "",
                    "date_for_error_dispute_remarks_code__c": nameSegmentVal.dateOfEntryForErrorDisputeRemarksCode ? nameSegmentVal.dateOfEntryForErrorDisputeRemarksCode : "",
                    "error_dispute_remarks_code1__c": nameSegmentVal.errorDisputeRemarksCode1 ? nameSegmentVal.errorDisputeRemarksCode1 : "",
                    "error_dispute_remarks_code2__c": nameSegmentVal.errorDisputeRemarksCode2 ? nameSegmentVal.errorDisputeRemarksCode2 : ""
                })
                let employmentSegmentVal = getdata.employmentSegment ? getdata.employmentSegment : "";
                bhrarrData.push({
                    "segment_tag__c": employmentSegmentVal.segmentTag ? employmentSegmentVal.segmentTag : "",
                    "account_type__c": employmentSegmentVal.accountType ? employmentSegmentVal.accountType : "",
                    "date_reported_and_certified__c": employmentSegmentVal.dateReportedAndCertified ? employmentSegmentVal.dateReportedAndCertified : "",
                    "occupation_code__c": employmentSegmentVal.occupationCode ? employmentSegmentVal.occupationCode : "",
                    "income__c": employmentSegmentVal.income ? parseInt(employmentSegmentVal.income) : 0,
                    "net_gross_income_indicator__c": employmentSegmentVal.netGrossIncomeIndicator ? employmentSegmentVal.netGrossIncomeIndicator : "",
                    "date_of_entry_for_error_code__c": employmentSegmentVal.dateOfEntryForErrorCode ? employmentSegmentVal.dateOfEntryForErrorCode : "",
                    "error_code__c": employmentSegmentVal.errorCode ? employmentSegmentVal.errorCode : "",
                    "date_of_entry_for_cibil_remarks_code__c": employmentSegmentVal.dateOfEntryForCibilRemarksCode ? employmentSegmentVal.dateOfEntryForCibilRemarksCode : "",
                    "cibil_remarks_code__c": employmentSegmentVal.cibilRemarksCode ? employmentSegmentVal.cibilRemarksCode : "",
                    "date_for_error_dispute_remarks_code__c": employmentSegmentVal.dateOfEntryForErrorDisputeRemarksCode ? employmentSegmentVal.dateOfEntryForErrorDisputeRemarksCode : "",
                    "error_dispute_remarks_code1__c": employmentSegmentVal.errorDisputeRemarksCode1 ? employmentSegmentVal.errorDisputeRemarksCode1 : "",
                    "error_dispute_remarks_code2__c": employmentSegmentVal.errorDisputeRemarksCode2 ? employmentSegmentVal.errorDisputeRemarksCode2 : ""
                })
                const bureau_hardpull = await prisma.bureau_hardpull_response__c.createMany({
                    data: bhrarrData
                })
                let bhSegmentArrData = [];
                let idSegmentArr = getdata.idSegment && getdata.idSegment.length > 0 ? getdata.idSegment : [];
                idSegmentArr.forEach(function (el) {
                    bhSegmentArrData.push({
                        "segment_tag__c": el.segmentTag ? el.segmentTag : "",
                        "id_type__c": el.idType ? el.idType : "",
                        "id_number__c": el.idNumber ? el.idNumber : "",
                        "issue_date__c": el.issueDate ? el.issueDate : "",
                        "enriched_through_enquiry__c": el.enrichedThroughEnquiry ? el.enrichedThroughEnquiry : "",
                        //"id_number__c":el.idNumber?el.idType:"",
                        "bureau_hardpull_response_id__c": ""

                    })
                });
                let telephoneSegmentArr = getdata.telephoneSegment && getdata.telephoneSegment.length > 0 ? getdata.telephoneSegment : [];
                telephoneSegmentArr.forEach(function (el) {
                    bhSegmentArrData.push({
                        "segment_tag__c": el.segmentTag ? el.segmentTag : "",
                        "telephone_number__c": el.telephoneNumber ? el.telephoneNumber : "",
                        "telephone_type__c": el.telephoneType ? parseInt(el.telephoneType) : 0,
                        "telephone_extension__c": el.telephoneExtension ? parseInt(el.telephoneExtension) : 0,
                        "enriched_through_enquiry__c": el.enrichedThroughEnquiry ? el.enrichedThroughEnquiry : "",
                        "bureau_hardpull_response_id__c": ""
                    })
                });
                let emailContactSegmentArr = getdata.emailContactSegment && getdata.emailContactSegment.length > 0 ? getdata.emailContactSegment : [];
                emailContactSegmentArr.forEach(function (el) {
                    bhSegmentArrData.push({
                        "segment_tag__c": el.segmentTag ? el.segmentTag : "",
                        "email_id__c": el.emailId ? el.emailId : "",
                        "bureau_hardpull_response_id__c": ""

                    })
                });

                let scoreSegmentArr = getdata.scoreSegment && getdata.scoreSegment.length > 0 ? getdata.scoreSegment : [];
                scoreSegmentArr.forEach(function (el) {
                    bhSegmentArrData.push({
                        "score_name__c": el.scoreName ? el.scoreName : "",
                        "score_card_name__c": el.scoreCardName ? el.scoreCardName : "",
                        "score_card_version__c": el.scoreCardVersion ? el.scoreCardVersion : "",
                        "score_date__c": el.scoreDate ? el.scoreDate : "",
                        "score__c": el.score ? el.score : "",
                        "issue_date__c": el.issueDate ? el.issueDate : "",
                        "exclusion_code1__c": el.exclusionCode1 ? el.exclusionCode1 : "",
                        "exclusion_code2__c": el.exclusionCode2 ? el.exclusionCode2 : "",
                        "exclusion_code3__c": el.exclusionCode3 ? el.exclusionCode3 : "",
                        "exclusion_code4__c": el.exclusionCode4 ? el.exclusionCode4 : "",
                        "exclusion_code5__c": el.exclusionCode5 ? el.exclusionCode5 : "",
                        "exclusion_code6__c": el.exclusionCode6 ? el.exclusionCode6 : "",
                        //"exclusion_code7__c": el.exclusionCode7 ? el.exclusionCode7 : "",
                        // "exclusion_code8__c": el.exclusionCode8 ? el.exclusionCode8 : "",
                        // "exclusion_code9__c": el.exclusionCode9 ? el.exclusionCode9 : "",
                        // "exclusion_code10__c": el.exclusionCode10 ? el.exclusionCode10 : "",
                        "reason_code1__c": el.reasonCode1 ? el.reasonCode1 : "",
                        "reason_code2__c": el.reasonCode2 ? el.reasonCode2 : "",
                        "reason_code3__c": el.reasonCode3 ? el.reasonCode3 : "",
                        "reason_code4__c": el.reasonCode4 ? el.reasonCode4 : "",
                        "reason_code5__c": el.reasonCode5 ? el.reasonCode5 : "",
                    })
                });
                let addressArr = getdata.address && getdata.address.length > 0 ? getdata.address : [];
                addressArr.forEach(function (el) {
                    let address1 = el.addressLine1 ? el.addressLine1 : "";
                    let address2 = el.addressLine2 ? el.addressLine2 : "";
                    let address3 = el.addressLine3 ? el.addressLine3 : "";
                    let address4 = el.addressLine4 ? el.addressLine4 : "";
                    let address5 = el.addressLine5 ? el.addressLine5 : "";
                    let addressVal = address1.concat(" ", address2, " ", address3, " ", address4, " ", address5);
                    bhSegmentArrData.push({
                        "segment_tag__c": el.segmentTag ? el.segmentTag : "",
                        "address_line1__c": addressVal,
                        "state_code__c": el.stateCode ? el.stateCode : "",
                        "pincode__c": el.pinCode ? el.pinCode : "",
                        "address_category__c": el.addressCategory ? el.addressCategory : "",
                        "residence_code__c": el.residenceCode ? parseInt(el.residenceCode) : 0,
                        "date_reported__c": el.dateReported ? el.dateReported : "",
                        "member_short_name__c": el.memberShortName ? el.memberShortName : "",
                        "enriched_through_enquiry__c": el.enrichedThroughEnquiry ? el.enrichedThroughEnquiry : "",
                        "bureau_hardpull_response_id__c": ""
                    })
                });
                let accountSegmentArr = getdata.accountSegment && getdata.accountSegment.length > 0 ? getdata.accountSegment : [];
                accountSegmentArr.forEach(function (el) {
                    bhSegmentArrData.push({
                        "segment_tag__c": el.segmentTag ? el.segmentTag : "",
                        "reporting_member_short_name__c": el.reportingMemberShortName ? el.reportingMemberShortName : "",
                        "account_number__c": el.accountNumber ? parseInt(el.accountNumber) : 0,
                        "account_type__c": el.accountType ? el.accountType : "",
                        "date_opened_disbursed__c": el.dateOpenedDisbursed ? el.dateOpenedDisbursed : "",
                        "date_of_last_payment__c": el.dateOfLastPayment ? el.dateOfLastPayment : "",
                        "date_closed__c": el.dateClosed ? el.dateClosed : "",
                        "date_reported_and_certified__c": el.dateReportedAndCertified ? el.dateReportedAndCertified : "",
                        "high_credit_sanctioned_amount__c": el.highCreditSanctionedAmount ? el.highCreditSanctionedAmount : "",
                        "current_balance__c": el.currentBalance ? parseInt(el.currentBalance) : 0,
                        "amount_overdue__c": el.amountOverdue ? parseInt(el.amountOverdue) : 0,
                        "enriched_through_enquiry__c": el.enrichedThroughEnquiry ? el.enrichedThroughEnquiry : "",
                        "payment_history1__c": el.paymentHistory1 ? el.paymentHistory1 : "",
                        "payment_history2__c": el.paymentHistory2 ? el.paymentHistory2 : "",
                        "payment_history_start_date__c": el.paymentHistoryStartDate ? new Date(el.paymentHistoryStartDate) : "",
                        "payment_history_end_date__c": el.paymentHistoryEndDate ? new Date(el.paymentHistoryEndDate) : "",
                        "suit_filed_wilful_default__c": el.suitFiledWilfulDefault ? el.suitFiledWilfulDefault : "",
                        "credit_facility_status__c": el.creditFacilityStatus ? el.creditFacilityStatus : "",
                        "value_of_collateral__c": el.valueOfCollateral ? el.valueOfCollateral : "",
                        "type_of_collateral__c": el.typeOfCollateral ? el.typeOfCollateral : "",
                        "credit_limit__c": el.creditLimit ? el.creditLimit : "",
                        "repayment_tenure__c": el.repaymentTenure ? el.repaymentTenure : "",
                        "bureau_hardpull_response_id__c": ""
                    })
                });
                const bureau_hardpull_segment = await prisma.bureau_hardpull_segment__c.createMany({
                    data: bhSegmentArrData
                })
                return res.status(200).send({ status: "success", message: 'Success' });
            } else {
                console.log(getdata)
                return res.status(200).send({ status: "error", message: getdata.message ? getdata.message : getdata });
            }
            } else {
                console.log(getdata)
                return res.status(200).send({ status: "error", message:"Account not found" });
            }

        } catch (error) {
            console.log(error)
            return res.status(200).send({ status: "error", message: error.message ? error.message : error })
        }
    }
}

