const sms_username = process.env.USER_SMS_USERNAME;
const sms_password = process.env.USER_SMS_PASSWORD;

// const PAN_PROFILE = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/e42db8de-d6a7-4bff-871a-d86f2df5a62b/s-edvnz-kyc-retail-api/0.0.6/m/kyc/retail/panprofile";
export const PAN_PROFILE = "http://s-edvnz-kyc-retail-api.sg-s1.cloudhub.io/api/kyc/retail/panprofile";
// const PAN_CHECK = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/e42db8de-d6a7-4bff-871a-d86f2df5a62b/s-edvnz-kyc-retail-api/0.0.6/m/kyc/retail/panstatuscheck";
export const PAN_CHECK = "http://s-edvnz-kyc-retail-api.sg-s1.cloudhub.io/api/kyc/retail/panstatuscheck";

export const GET_DOCUMENT_BY_ID = "https://dev-eduvanz.ind2s.sfdc-y37hzm.force.com/services/apexrest/HerokuFileUpload?Id=";

export const UPLOAD_URL = "https://dev-eduvanz.ind2s.sfdc-y37hzm.force.com/services/apexrest/HerokuFileUpload";

export const SALES_FORCE = "https://test.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9BftfVxDiAlh2X7sRwsT7XjQpOBQ.1hF8d_jN5aKyx.4_SJcz7zY.fNscwqwGl9I2v9RrLpHkI9xUULJ7&client_secret=CD236A8EEF6390AC7A30E0A5C30DC025BABE7A1D8DCB4C3BF3FA4596A9E2A987&username=Integration.User@techmatrixconsulting.com&password=tmc@1234";

export const SMS_URL = `https://http.myvfirst.com/smpp/sendsms?username=${sms_username}&password=${sms_password}`;

export const DIGILOCKER_LINK = "https://testapi.karza.in/v3/digilocker/link";

//export const DIGILOCKER_DOCUMENT = "https://testapi.karza.in/v3/digilocker/documents";

//export const DIGILOCKER_DOWNLOAD = "https://testapi.karza.in/v3/digilocker/download";

export const DIGILOCKER_DOCUMENT = "http://s-edvnz-kyc-retail-api.sg-s1.cloudhub.io/api/digilocker/document";

export const DIGILOCKER_DOWNLOAD = "http://s-edvnz-kyc-retail-api.sg-s1.cloudhub.io/api/digilocker/download";

// export const ENTITY_SEARCH = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/e42db8de-d6a7-4bff-871a-d86f2df5a62b/s-edvzn-kyc-commercial-api/1.0.2/m/entitysearch";

 export const ENTITY_SEARCH = "http://s-edvzn-kyc-commercial-api.sg-s1.cloudhub.io/api/entitysearch";

 export const IFSC_SEARCH = "http://s-edvnz-bank-api.sg-s1.cloudhub.io/api/bank/account/detail/ifsc?ifsc=";

 export const ACCOUNT_SEARCH = "http://s-edvnz-bank-api.sg-s1.cloudhub.io/api/bank/account/verification";

 export const FILE_REMOVE_URL = "https://dev-eduvanz.ind2s.sfdc-y37hzm.force.com/services/apexrest/HerokuFileUpload?Id=";

 export const FRAUD_CHECK = "http://s-edvnz-ocr-api.sg-s1.cloudhub.io/api/ocr/documentfraudcheck";

 export const FACE_MATCH = "http://s-edvnz-kyc-retail-api.sg-s1.cloudhub.io/api/kyc/retail/facematch";

 export const LIVENESS_API = "http://s-edvnz-ckyc-liveliness-api.sg-s1.cloudhub.io/api/liveliness";

 export const SOFT_PULL = "http://s-edvnz-bre-api.sg-s1.cloudhub.io/api/bre/edvnzsm";

 // export const SOFT_PULL = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/e42db8de-d6a7-4bff-871a-d86f2df5a62b/s-edvnz-bre-creditdecisioning/0.0.1/m/bre/edvnzsm";

export const HARD_PULL = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/e42db8de-d6a7-4bff-871a-d86f2df5a62b/s-edvnz-softpull-hardpull-d2c-api/1.0.6/m/bureau/hardpull";

export const DIGI_LOCKER = "https://testapi.karza.in/v3/digilocker";

//export const D2C_BUREAU = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/e42db8de-d6a7-4bff-871a-d86f2df5a62b/s-edvnz-softpull-hardpull-d2c-api/1.0.9/m/bureau/d2c/singleaction";

export const D2C_BUREAU = "http://s-edvnz-bureau-api.sg-s1.cloudhub.io/api/bureau/d2c/singleaction";

//export const BUREAU_LIMIT = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/e42db8de-d6a7-4bff-871a-d86f2df5a62b/s-edvnz-bre-creditdecisioning/0.0.44/m/bre/edvnz/limit";

export const BUREAU_LIMIT = "http://s-edvnz-bre-api.sg-s1.cloudhub.io/api/bre/edvnz/limit";

export const CKYC_DETAIL = "http://s-edvnz-ckyc-liveliness-api.sg-s1.cloudhub.io/api/ckyc/search";

export const CKYC_DOWNLOAD = "http://s-edvnz-ckyc-liveliness-api.sg-s1.cloudhub.io/api/ckyc/download";

export const HARD_PULL_LIVE = "http://s-edvnz-bre-api.sg-s1.cloudhub.io/api/bre/edvnzbc";

export const TU_HARD_PULL = "http://s-edvnz-bureau-api.sg-s1.cloudhub.io/api/bureau/hardpull";

export const EMAIL_URL = "https://api.sparkpost.com/api/v1/transmissions/";

export const CASHFREE_URL = "https://sandbox.cashfree.com/pg/";

export const CASHFREE_API_URL = "http://s-edvnz-payment-api.sg-s1.cloudhub.io/api/";

export const PLANS_API_URL = "https://dev-eduvanz.ind2s.sfdc-y37hzm.force.com/services/apexrest/LoanProductSchemes?Id=00671000001Ln8PAAS";

export const CASHFREE_LIVE = "https://api.cashfree.com/pg";

export const STATEMENT_UPLOAD = "http://s-edvnz-bank-api.sg-s1.cloudhub.io/api/bank/statement/uploadpdf"

export const STATEMENT_DOWNLOAD = "http://s-edvnz-bank-api.sg-s1.cloudhub.io/api/bank/statement/report?reportFile=RD&id="

export const GENERATE_VCARD = "http://s-edvnz-email-virtualcard-api.sg-s1.cloudhub.io/api/virtualcard/registercustomer";

export const GET_VCARD_DETAILS = "http://s-edvnz-email-virtualcard-api.sg-s1.cloudhub.io/api/virtualcard/carddetails";

export const RAZOR_CREATE_CUST = "https://api.razorpay.com/v1/customers";

export const RAZOR_CREATE_ORDER = "https://api.razorpay.com/v1/orders";

export const ONEMONEY_REQUEST_CONSENT = "https://eduvanz-uat.moneyone.in/v2/requestconsent";

export const ONEMONEY_GET_ALL_FIDATA  = "https://eduvanz-uat.moneyone.in/getalllatestfidata";

export const ONEMONEY_GET_CONSENT_LIST  = "https://eduvanz-uat.moneyone.in/getconsentslist";

export const LIMIT_PRODUCT = "http://s-edvnz-bre-api.sg-s1.cloudhub.io/api/bre/edvnz2/limitandproduct";

export const BANK_STATEMENT_UPLOAD = "http://s-edvnz-bank-api.sg-s1.cloudhub.io/api/bank/statement/uploadpdf";

