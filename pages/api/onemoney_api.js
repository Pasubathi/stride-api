import { prisma } from "./_base";
import { UPLOAD_URL, SALES_FORCE, BANK_STATEMENT_UPLOAD, ONEMONEY_REQUEST_CONSENT, ONEMONEY_GET_ALL_FIDATA, ONEMONEY_GET_CONSENT_LIST } from "./api";
var FormData = require('form-data');
import request from "request";

export async function requestConsent(getData) {
    try {
        const headers = new Headers();
        headers.append('content-type', 'application/json');
        headers.append("client_id", "a3ce22bb5f411431b1660a3c781742b7a92a4a1f");
        headers.append("client_secret", "80558b516dcd9447641856972b2ba66508a99bbd");
        headers.append("organisationId", "eduvanz-fiu-uat");
        headers.append("appIdentifier", "com.moneyone.app");
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(getData),
            redirect: 'follow'
        };
        console.log("bodyData", init);
        const getdata = await fetch(ONEMONEY_REQUEST_CONSENT, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        console.log("Onemoney Consent Response", getdata);
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function getAlllTestFidata(getData) {
    try {
        const headers = new Headers();
        headers.append('content-type', 'application/json');
        headers.append("client_id", "a3ce22bb5f411431b1660a3c781742b7a92a4a1f");
        headers.append("client_secret", "80558b516dcd9447641856972b2ba66508a99bbd");
        headers.append("organisationId", "eduvanz-fiu-uat");
        headers.append("appIdentifier", "com.moneyone.app");
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(getData),
            redirect: 'follow'
        };
        console.log("bodyData", init);
        const getdata = await fetch(ONEMONEY_GET_ALL_FIDATA, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        console.log("getAlllTestFidata Response", getdata);
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function getConsentsList(getData) {
    try {
        const headers = new Headers();
        headers.append('content-type', 'application/json');
        headers.append("client_id", "a3ce22bb5f411431b1660a3c781742b7a92a4a1f");
        headers.append("client_secret", "80558b516dcd9447641856972b2ba66508a99bbd");
        headers.append("organisationId", "eduvanz-fiu-uat");
        headers.append("appIdentifier", "com.moneyone.app");
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(getData),
            redirect: 'follow'
        };
        console.log("bodyData", init);
        const getdata = await fetch(ONEMONEY_GET_CONSENT_LIST, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        console.log("getConsentsList Response", getdata);
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function statementUpload(statement, path)
{
    try {
        var myHeaders = new Headers();
        myHeaders.append("channel_id", "MOB");
        myHeaders.append("transaction_id", "asdasd");
        myHeaders.append("client_id", "918e4acddf60379f8ef62a1a07ee4a14d807ab7e");
        myHeaders.append("client_secret", "e448ec974f91c73a23cf1d672b8ba548b34ec182");

        var formdata = new FormData();
        formdata.append("file", statement, path);
        formdata.append("metadata", "{ \"password\": \"\",\n\"bank\":\"FIDATA\", \"name\":\"\" }\n}");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        const getData = await fetch(BANK_STATEMENT_UPLOAD, requestOptions)
        .then(response => response.json())
        .then(result =>{ return result; })
        .catch(error => { return error; });
        return { status:"success", "message":"success", data: getData};
    } catch (error) {
        return { status: "error", message: error.message ? error.message : error };
    }
}

export async function herokrUpload(givenData) {
    try {
        const { documentType, parent_id, fname, base64, doctype } = givenData;
        const init = {
            method: 'POST'
        };
        const getData = await fetch(SALES_FORCE, init).then((response) => response.json())
        .then((response) => {
                return response;
        });
        let token = '';
        if(getData && getData.access_token)
        {
            token = getData.access_token
        }
        console.log("Token", token);
        let data = {
            "parentId": "00171000005MEj0AAG",
            "fname": fname,
            "base64": base64,
            "doctype": doctype
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

      //  console.log("body Data", JSON.stringify(data));
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