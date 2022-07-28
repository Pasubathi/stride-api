import { prisma } from "./_base";
import fs from "fs";
import request from "request";

export async function createAccount(getData) {
    const { email, token, mobile, recordId, lname, fname, source, accountStatus} = getData
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "BrowserId=daibk-YyEeyOwanL9j5fyA; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1");
        let obj = {
            "Phone": mobile,
            "Last_Name__c": lname,
            "First_Name__c": fname,
            "RecordTypeId": recordId,
            "LastName": lname,
            "FirstName": fname,
            "AccountSource": source,
            "Account_Status__c": accountStatus
        }
        if(email && email !==undefined)
        {
            obj.Email__c = email
        }
        var raw = JSON.stringify(obj);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        const getdata = await fetch("https://eduvanz123--dev.my.salesforce.com/services/data/v53.0/sobjects/Account", requestOptions)
        .then((response) => response.json())
        .then((response) => {
            return response;
        })
        .catch(error => console.log('error', error));
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function updateAccount(getData, token, user_sfid) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "BrowserId=daibk-YyEeyOwanL9j5fyA; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1");
        var raw = JSON.stringify(getData);
        console.log("raw------------>", raw);
        var requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const getdata = await fetch("https://eduvanz123--dev.my.salesforce.com/services/data/v53.0/sobjects/Account/"+user_sfid, requestOptions)
        .then((response) => response.text())
        .then((response) => {
            console.log("salesforce response=------------->", response);
            return response;
        })
        .catch(error => console.log('error', error));
        console.log("getdata=------------->", getdata);
        return getdata;
    } catch (error) {
        console.log("salesforce error=------------->", error);
        return error.message ? error.message : error;
    }
}

export async function getAccount(token, sfid) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "BrowserId=daibk-YyEeyOwanL9j5fyA; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1");
        var raw = "";
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        const getdata = await fetch(`https://eduvanz123--dev.my.salesforce.com/services/data/v53.0/sobjects/Account/${sfid}`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            return response;
        })
        .catch(error => console.log('error', error));
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}


export async function getContentVersion(token, getData) {
    const { user_sfid, doc_type } = getData
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Cookie", "BrowserId=daibk-YyEeyOwanL9j5fyA; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        const getObj = await fetch(`https://eduvanz123--dev.my.salesforce.com/services/data/v53.0/query/?q=select+ContentDocumentId+from+contentversion+where+FirstPublishLocationId+=+'${user_sfid}'+and+Document_Type__c+=+'${doc_type}'`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            return response;
        })
        .catch(error => console.log('error', error));
        return getObj;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function getAllTypeContentVersion(token, getData) {
    const { user_sfid } = getData
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Cookie", "BrowserId=daibk-YyEeyOwanL9j5fyA; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        const getObj = await fetch(`https://eduvanz123--dev.my.salesforce.com/services/data/v53.0/query/?q=select+ContentDocumentId+,+Document_Type__c+from+contentversion+where+FirstPublishLocationId+=+'${user_sfid}'`, requestOptions)
        .then((response) => response.json())
        .then((response) => {
            return response;
        })
        .catch(error => console.log('error', error));
        return getObj;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function createTransApp(token, getData) {
    const { accountid, stagename, merchant_product__c, merchant_name__c, name, recordtypeid, closeDate } = getData
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "BrowserId=daibk-YyEeyOwanL9j5fyA; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1");
        let obj = {
            "AccountId": accountid,
            "StageName": stagename,
            "Merchant_Product__c": merchant_product__c,
            "Merchant_Name__c": merchant_name__c,
            "Name": name,
            "RecordTypeId": recordtypeid,
            "CloseDate": closeDate,
        }
        var raw = JSON.stringify(obj);
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        const getdata = await fetch("https://eduvanz123--dev.my.salesforce.com/services/data/v53.0/sobjects/Opportunity", requestOptions)
        .then((response) => response.json())
        .then((response) => {
            return response;
        })
        .catch(error => console.log('error', error));
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function createCoApplicant(getData) {
    const { account_from, token, name, sfid} = getData
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "BrowserId=daibk-YyEeyOwanL9j5fyA; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1");
        let obj = {
            "Account_From__c": account_from,
            "Name": name,
            "Role__c": 'Co-Borrower',
            "Account_To__c": sfid,
        }
        var raw = JSON.stringify(obj);
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
        const getdata = await fetch("https://eduvanz123--dev.my.salesforce.com/services/data/v53.0/sobjects/Account_Partner__c", requestOptions)
        .then((response) => response.json())
        .then((response) => {
            return response;
        })
        .catch(error => console.log('error', error));
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}