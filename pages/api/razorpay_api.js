import { prisma } from "./_base";
import { RAZOR_CREATE_CUST, RAZOR_CREATE_ORDER } from "./api";


export async function createCustomer(getData) {
    try {
        const headers = new Headers();
        headers.append('content-type', 'application/json');
        headers.append("Authorization", 'Basic cnpwX3Rlc3RfRkNKYmM2YXA0UjR4dEU6VHU2WWhwTjk0N251SXVDeEYxeHp6VVhj');
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(getData),
            redirect: 'follow'
        };
        console.log("bodyData", init);
        const getdata = await fetch(RAZOR_CREATE_CUST, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        console.log("Razorpay Cust Response", getdata);
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}

export async function createOrder(getData) {
    try {
        const headers = new Headers();
        headers.append('content-type', 'application/json');
        headers.append("Authorization", 'Basic cnpwX3Rlc3RfRkNKYmM2YXA0UjR4dEU6VHU2WWhwTjk0N251SXVDeEYxeHp6VVhj');
        const init = {
            method: 'POST',
            headers,
            body: JSON.stringify(getData),
            redirect: 'follow'
        };
        console.log("bodyData", init);
        const getdata = await fetch(RAZOR_CREATE_ORDER, init).then((response) => response.json())
            .then((response) => {
                return response;
            });
        console.log("Razorpay Order Response", getdata);
        return getdata;
    } catch (error) {
        return error.message ? error.message : error;
    }
}