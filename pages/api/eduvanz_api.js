import { prisma } from "./_base";
import { BANK_STATEMENT_UPLOAD, ACCOUNT_SEARCH, GET_VCARD_DETAILS, GENERATE_VCARD, EMAIL_URL, FILE_REMOVE_URL, PAN_CHECK, PAN_PROFILE, UPLOAD_URL, SMS_URL, ENTITY_SEARCH, IFSC_SEARCH, FRAUD_CHECK, FACE_MATCH, LIVENESS_API } from "./api";
import fs from "fs";
import request from "request";

var FormData = require('form-data');

export async function getPanProfile(givenData) {
    try {
        const { pan, name, cust_id, sfid, salesForceObj } = givenData;
        let data = {
            "pan": pan,
            "name": name,
            "getContactDetails": "Y",
            "consent": "Y"
        }
        let accData = salesForceObj && salesForceObj !== undefined?salesForceObj:{};
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
        const getdata = await fetch(PAN_PROFILE, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        console.log("Pan Profile", getdata);
        if (getdata.result !== undefined) {
            console.log("Pan result", getdata.result);
            /* await prisma.account.update({
                where: { sfid: sfid },
                data: { pan_number__c: pan, is_pan_confirm__c: true }
            }); */
            accData.PAN_Number__c = pan;
            accData.Is_pan_confirm__c = true;

            let resData = getdata.result;
            let loggerObj = {
                method: "POST",
                sfid: sfid,
                service: "PAN PROFILE",
                resData: JSON.stringify(getdata)
            }
            apiLogger(loggerObj);
            let accountId = Number(cust_id);
            const panDet = await prisma.pan_profile__c.findFirst({
                where: { accountid__c:  sfid },
                orderBy:{ id: "desc" }
            });

            let data = {
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
            let getData = {
                date_of_birth_applicant__c: resData.dob?new Date(resData.dob):null,
                approved_pin_code__c: resData.address.pinCode?Number(resData.address.pinCode):null,
                gender__c: resData.gender?resData.gender:null,
                is_pan_confirm__c: true,
                current_address_id__c: String(addresDet.id),
                is_qde_1_form_done__c: resData.dob?true:false
            }

            accData.Date_Of_Birth_Applicant__c = resData.dob?String(resData.dob):null;
            accData.Approved_Pin_Code__c = resData.address.pinCode?Number(resData.address.pinCode):null;
            accData.Gender__c = resData.gender?String(resData.gender):null;
            accData.Is_pan_confirm__c = true;
            accData.Current_Address_Id__c = String(addresDet.id);
            if(accData.IPA_Basic_Bureau__c > 0){
                accData.Is_QDE_1_form_done__c = resData.dob?true:false;
            }
            console.log("getData", getData);
            /* await prisma.account.update({
                where: { sfid: sfid },
                data: getData,
            }); */

            if (!panDet) {
                await prisma.pan_profile__c.create({
                    data: data
                });

            } else {
                console.log("Update Pan pro", panDet.id);
                await prisma.pan_profile__c.update({
                    where: {
                        id: panDet.id
                    },
                    data: data,
                });
            }
            return { status: "success", message: 'Success', data: resData, sfObj: accData };
        } else {
            let errorObj = {
                method: "POST",
                sfid: sfid,
                service: "PAN PROFILE",
                resData: JSON.stringify(getdata)
            }
            await customError(errorObj);
            return { status: "error", message: getdata.message, sfObj: salesForceObj };
        }


    } catch (error) {
        return { status: "error", message: error.message ? error.message : error, sfObj:salesForceObj };
    }
}

export async function checkPanStatus(givenData) {
    try {
        const { cust_id, pan, name, sfid, salesForceObj } = givenData;
        let data = {
            "pan": pan,
            "name": name
        }
        let accData = salesForceObj && salesForceObj !== undefined?salesForceObj:{};
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
                service: "PAN STATUS",
                resData: JSON.stringify(getdata)
            }
            await apiLogger(loggerObj);
            const details = getdata.data;
            
            if (details.status !== undefined && details.status === "ACTIVE") 
            {
                let data = {
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
                const panDet = await prisma.pan_status_check__c.findFirst({
                    where: {
                        accountid__c: String(cust_id)
                    }
                });
                /* await prisma.account.update({
                    where: {
                        sfid: sfid,
                    },
                    data: {
                        pan_number__c: pan,
                        pan_verified__c: true
                    }
                }); */
                accData.PAN_Number__c = pan;
                accData.PAN_Verified__c = true;
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
                return { status: "success", message: 'Success', data: accData };
            } else {
                return { status: "error", message: "Pan number does not match your name of '" + name + "'" };
            }
        } else {
            let errorObj = {
                method: "POST",
                sfid: sfid,
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

export async function uploadFile(givenData) {
    try {
        const { documentType, parent_id, fname, base64, doctype, catType, token } = givenData;
        let data = {
            "parentId": parent_id,
            "fname": fname,
            "base64": base64,
            "doctype": doctype,
            "docCategory": catType
        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer  " + token);
        myHeaders.append("content-type", "application/json ");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: 'follow'
        };
        const getdata = await fetch(UPLOAD_URL, requestOptions).then((response) => response.json())
            .then((response) => {
                return response;
            });
        if (getdata.Status === "Success") {
            return { status: "success", message: "success", data: getdata };
        } else {
            return { status: "error", message: getdata };
        }
    } catch (error) {
        return { status: "error", message: error.message ? error.message : error };
    }
}

export async function sendOtp(givenData) {
    try {
        const { mobile, otp } = givenData;
        var requestOptions = {
            method: 'GET'
        };
        let sms_url = SMS_URL + `&to=${mobile}&from=EDUVNZ&text=Your+One+Time+Password+is+${otp}`;
        const getdata = await fetch(sms_url, requestOptions).then((response) => response.text())
            .then((response) => {
                return response;
            });
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function sendMessage(givenData) {
    try {
        const { mobile, message } = givenData;
        var requestOptions = {
            method: 'GET'
        };
        let sms_url = SMS_URL + `&to=${mobile}&from=EDUVNZ&text=${message}`;
        const getdata = await fetch(sms_url, requestOptions).then((response) => response.text())
            .then((response) => {
                return response;
            });
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function entitySearch(givenData) {
    try {
        const { company_name } = givenData;
        let data = { "id": "", "filter": { "name": company_name }, "entitySearch": true, "nameMatch": true }
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
        const getdata = await fetch(ENTITY_SEARCH, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function checkIfscCode(givenData) {
    try {
        const { ifsc } = givenData;
        const channel_id = process.env.USER_CHANNEL_ID;
        const client_id = process.env.USER_CLIENT_ID;
        const client_secret = process.env.USER_CLIENT_SECRET;
        const transaction_id = Math.floor(100000 + Math.random() * 900000);
        const headers = new Headers();
        headers.append('channel_id', "MOB");
        headers.append('transaction_id', "asdasd");
        headers.append('client_id', "918e4acddf60379f8ef62a1a07ee4a14d807ab7e");
        headers.append('client_secret', "e448ec974f91c73a23cf1d672b8ba548b34ec182");
        headers.append('content-type', 'application/json');
        const init = {
            method: 'GET',
            headers,
        };
        const getdata = await fetch(`${IFSC_SEARCH}${ifsc}`, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        //console.log("IFsce Get", getdata);
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function checkBankAccount(givenData) {
    try {
        const { account_number, ifsc } = givenData;
        const headers = new Headers();
        headers.append('channel_id', "MOB");
        headers.append('transaction_id', "asdasd");
        headers.append('client_id', "918e4acddf60379f8ef62a1a07ee4a14d807ab7e");
        headers.append('client_secret', "e448ec974f91c73a23cf1d672b8ba548b34ec182");
        headers.append('content-type', 'application/json');
        let bodyData = {
            "consent": "Y",
            "ifsc": ifsc,
            "accountNumber": account_number
        }
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyData),
        };
        const getdata = await fetch(`${ACCOUNT_SEARCH}`, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        //console.log("IFsce Get", getdata);
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function removeEduDocument(givenData) {
    try {
        const { id, token } = givenData;
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);
        const init = {
            method: 'DELETE',
            headers,
        };
        const getdata = await fetch(`${FILE_REMOVE_URL}${id}`, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function fraudCheck(givenData) {
    try {
        const { fileBase, fileUrl } = givenData;
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
        var formdata = new FormData();
        formdata.append("rejectBlur", "");
        formdata.append("qualityCheck", "");
        formdata.append("rejectPhotoOnPhoto", "");
        formdata.append("allowOnlyCompleteCard", "");
        formdata.append("allowOnlyLiveDocument", "");
        formdata.append("allowOnlyHorizontal", "");
        formdata.append("maskAadhaar", "");
        formdata.append("maskAadhaarComplete", "");
        formdata.append("maskAadhaarText", "");
        formdata.append("returnOnlyImage", "");
        formdata.append("expandQR", "");
        formdata.append("maskQR", "");
        formdata.append("detectMinor", "");
        formdata.append("detectPANSignature", "");
        formdata.append("readBarCode", "");
        formdata.append("enableDB", "");
        formdata.append("faceCheck", "");
        formdata.append("rejectBlackWhite", "");
        formdata.append("outputImageBase64", fileBase);
        formdata.append("outputImageUrl", fileUrl);
        const init = {
            method: 'POST',
            headers,
            body: formdata,
            redirect: 'follow'
        };
        const getdata = await fetch(FRAUD_CHECK, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function faceMatch(firstImage, secondImage) {
    return  new Promise((resolve, reject) => {
    try {
        var options = {
            'method': 'POST',
            'url': 'http://s-edvnz-kyc-retail-api.sg-s1.cloudhub.io/api/kyc/retail/facematch',
            'headers': {
              'channel_id': 'MOB',
              'client_id': '918e4acddf60379f8ef62a1a07ee4a14d807ab7e',
              'client_secret': 'e448ec974f91c73a23cf1d672b8ba548b34ec182',
              'transaction_id': '1234555'
            },
            formData: {
              'firstImage': {
                'value': fs.createReadStream(firstImage.path),
                'options': {
                  'filename': firstImage.originalFilename,
                  'contentType': null
                }
              },
              'secondImage': {
                'value': fs.createReadStream(secondImage.path),
                'options': {
                  'filename': secondImage.originalFilename,
                  'contentType': null
                }
              }
            }
          };
          request(options, function (error, response) {
            if(error)
            reject(error);
            resolve(JSON.parse(response.body));
         });
        } catch (error) {
            reject(error.message ? error.message : error);
        }
    })
}

export async function livelinessCheck(reqData) {
   return  new Promise((resolve, reject) => {
        const channel_id = process.env.USER_CHANNEL_ID;
        const client_id = process.env.USER_CLIENT_ID;
        const client_secret = process.env.USER_CLIENT_SECRET;
        const transaction_id = Math.floor(100000 + Math.random() * 900000);
        var options = {
            'method': 'POST',
            'url': LIVENESS_API,
            'headers': {
                'transaction_id': transaction_id,
                'client_id': client_id,
                'client_secret': client_secret,
                'channel_id': channel_id
            },
            formData: {
                'files': {
                    'value': fs.createReadStream(reqData.path),
                    'options': {
                        'filename': reqData.originalFilename,
                        'contentType': null
                    }
                }
            }
        };
        request(options, function (error, response) {
           if(error)
           reject(error);
           resolve(JSON.parse(response.body))
        });
    })
}

export async function documentFraudCheck(reqData) {
    return  new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': 'http://s-edvnz-ocr-api.sg-s1.cloudhub.io/api/ocr/documentfraudcheck',
            'headers': {
              'channel_id': 'MOB',
              'client_id': '918e4acddf60379f8ef62a1a07ee4a14d807ab7e',
              'client_secret': 'e448ec974f91c73a23cf1d672b8ba548b34ec182',
              'transaction_id': '1234555'
            },
            formData: {
              'outputImageUrl': {
                'value': fs.createReadStream(reqData.path),
                'options': {
                  'filename':  reqData.originalFilename,
                  'contentType': null
                }
              }
            }
          };
         request(options, function (error, response) {
            if(error)
            reject(error);
            resolve(JSON.parse(response.body))
         });
     })
 }

 export async function ocrVerification(first_name, imageDetails1, imageDetails2, imageDetails3) {
    return  new Promise((resolve, reject) => {
        console.log("imageDetails1", imageDetails1);
        console.log("imageDetails2", imageDetails2);
       console.log("imageDetails3", imageDetails3);
      console.log("imageDetails3", imageDetails1.path);
      console.log("imageDetails3", imageDetails1.originalFilename);
      console.log("imageDetails3", imageDetails2.path);
      console.log("imageDetails3", imageDetails2.originalFilename);
        var options = {
            'method': 'POST',
            'url': 'http://s-edvnz-ocr-api.sg-s1.cloudhub.io/api/ocr/verification',
            'headers': {
                'channel_id': 'WEB',
                'client_id': '3b1e5fc9540a91dee8774b0896189faf3fef3d80',
                'client_secret': '29d42e3761f17d9e166bba5162630fc02af4ae84',
                'transaction_id': '1234555'
            },
            formData: {
              'firstName': first_name,
              'imageDetails1': {
                'value': fs.createReadStream(imageDetails1.path),
                'options': {
                  'filename': imageDetails1.originalFilename,
                  'contentType': null
                }
              },
              'imageDetails2': {
                'value': fs.createReadStream(imageDetails2.path),
                'options': {
                  'filename': imageDetails2.originalFilename,
                  'contentType': null
                }
              },
              'imageDetails3': {
                'value': imageDetails3 && imageDetails3.path?fs.createReadStream(imageDetails3.path):'',
                'options': {
                  'filename': imageDetails3 && imageDetails3.originalFilename?imageDetails3.originalFilename:'',
                  'contentType': null
                }
              }
            }
          };
          request(options, function (error, response) {
            if(error)
            reject(error);
            resolve(JSON.parse(response.body))
          });
     })
}

export async function ocrBase64Verification(first_name, imageDetails1, imageDetails2, imageDetails3) {
    return  new Promise((resolve, reject) => {
        /* console.log("imageDetails1", imageDetails1);
        console.log("imageDetails2", imageDetails2);
        console.log("imageDetails3", imageDetails3); */
        var options = {
            'method': 'POST',
            'url': 'http://s-edvnz-ocr-api.sg-s1.cloudhub.io/api/ocr/verification',
            'headers': {
                'channel_id': 'WEB',
                'client_id': '3b1e5fc9540a91dee8774b0896189faf3fef3d80',
                'client_secret': '29d42e3761f17d9e166bba5162630fc02af4ae84',
                'transaction_id': '1234555'
            },
            formData: {
            'firstName': first_name,
            'imageDetails1': String(imageDetails1[0]),
            'imageDetails2': String(imageDetails2[0]),
            'imageDetails3': String(imageDetails3)
            }
        };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
      });
        
          request(options, function (error, response) {
            if(error)
            reject(error);
            resolve(JSON.parse(response.body))
          });
     })
}

export async function bankStatementUpload(reqData) {
    return  new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'url': 'http://s-edvnz-bank-api.sg-s1.cloudhub.io/api/bank/statement/uploadpdf',
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
            'metadata': '{ "password": "",\n"bank":"", "name":"" }\n}'
            }
        };
        request(options, function (error, response) {
            if (error) 
            reject(error);
            resolve(JSON.parse(response.body))
        });
     })
 }

export async function sendEmail(getData) {
    try {
        const { email, message, subject } = getData
        const headers = new Headers();
        headers.append('Authorization', '08a6047c6df063d50c13136fbae33679784eed49');
        headers.append('content-type', 'application/json');
        let bodyData = {
            "recipients": [
                { "address": { "email": email } }],
            "content": {
                "from": { "name": "Eduvanz", "email": "support@eduvanz.com" },
                "return_path": "no-reply@eduvanz.com",
                "subject": subject?subject:'',
                "html": message, "text": "mail"
            }
        };


        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyData),
            redirect: 'follow'
        };
        console.log("bodyData", init);
        const getdata = await fetch(EMAIL_URL, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        console.log("Email Response", getdata);
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function generateVcard(getData) {
    try {
        const channel_id = process.env.USER_CHANNEL_ID;
        const client_id = process.env.USER_CLIENT_ID;
        const client_secret = process.env.USER_CLIENT_SECRET;
        const transaction_id = Math.floor(100000 + Math.random() * 900000);
        const headers = new Headers();
        headers.append('channel_id', "WEB");
        headers.append('transaction_id', "336fe0fe-effc-49ee-8284-2f1e915e84e2");
        headers.append('client_id', "3b1e5fc9540a91dee8774b0896189faf3fef3d80");
        headers.append('client_secret', "29d42e3761f17d9e166bba5162630fc02af4ae84");
        headers.append('content-type', 'application/json');
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(getData),
            redirect: 'follow'
        };
        console.log("bodyData", init);
        const getdata = await fetch(GENERATE_VCARD, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        console.log("Card Response", getdata);
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function getVcard(getData) {
    try {
        const headers = new Headers();
        headers.append('channel_id', "WEB");
        headers.append('transaction_id', "336fe0fe-effc-49ee-8284-2f1e915e84e4");
        headers.append('client_id', "3b1e5fc9540a91dee8774b0896189faf3fef3d80");
        headers.append('client_secret', "29d42e3761f17d9e166bba5162630fc02af4ae84");
        headers.append('content-type', 'application/json');
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(getData),
            redirect: 'follow'
        };
        console.log("bodyData", init);
        const getdata = await fetch(GET_VCARD_DETAILS, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        console.log("Card Response", getdata);
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function saveFile(file) {
    const data = fs.readFileSync(file.path);
    fs.writeFileSync(`${file.name}`, data);
    await fs.unlinkSync(file.path);
    return;
}

async function apiLogger(getData)
{
    const { method, sfid, service, resData} = getData
    await prisma.api_logger__c.create({
        data: {
            request__c: method,
            response__c: String(resData),
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