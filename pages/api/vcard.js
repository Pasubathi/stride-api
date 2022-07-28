import { prisma } from "./_base";
import { getVcard } from "./eduvanz_api"
const fs = require('fs');
const DomParser = require('dom-parser');
const parser = new DomParser();

export async function updateVCard(givenData) {
    try {
        const { card_number, entity_id, id } = givenData;
        let data = {
            "kitNo": card_number,
            "entityId": entity_id,
            "appGuid": "123dase",
            "business": "Business name",
            "callbackUrl": "https://eduvanz-web.herokuapp.com",
            "dob": ""
        }
        const getData = await getVcard(data);
        const url = getData && getData.result?getData.result:'';
        if(url)
        {
           // console.log("url", url);
           await fetch(url).then( (response) => response.text()).then(async (html) => {
              //  console.log("Html ============>", html);
              
                var dom = parser.parseFromString(html);
                const cardNumber = dom.getElementById('cardNumber').innerHTML;
                const expiryDate = dom.getElementById('expiryDate').innerHTML;
                const cvvUnlock = dom.getElementById('cvvUnlock').innerHTML;
                await prisma.m2b_cards.update({
                    where: {
                        id: id
                    },
                    data: {
                        vcard_nummber__c : String(cardNumber),
                        vcard_expiry__c : String(expiryDate),
                        vcard_cvv__c : String(cvvUnlock)
                    }
                });
              //  console.log("html", html);
               // console.log("cardNumber ============> ", cardNumber);
               // console.log("expiryDate ============> ",expiryDate);
               // console.log("cvvUnlock ============> ",cvvUnlock);
            });
            return { status:"success", message: "Success"}
        }else{
            return { status: "error", message: getData, resData: data };
        }
        
    } catch (error) {
        return { status: "error", message: error.message ? error.message : error };
    }
}