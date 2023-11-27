import { customerAPIFunctions} from "./APIFunctions/customerAPIFunctions.js";

var me;


try {
    const storedMe = localStorage.getItem('me');
    if (storedMe) {
        console.log('storedMe:', storedMe);
        me = JSON.parse(storedMe);
    } else {
        console.log("storedMe is null, setting default");
        me = { id: 59, name: 'Bobbie' };
    }
} catch (error) {
    console.error("Error parsing 'me' from localStorage:", error);
    me = { id: 59, name: 'Bobbie' };
    localStorage.setItem('me', JSON.stringify(me));
}

async function createCustomer() {
    const customer = await customerAPIFunctions.createCustomer(me.name);
    if (customer != null) {
        me = customer;
        localStorage.setItem('me', JSON.stringify(me));
    }
    return me;
}

async function getUser() {
    let tempMe = localStorage.getItem('me');
    if (!tempMe) {
        me = await createCustomer();
    } else {
        me = JSON.parse(tempMe);
        const response = await customerAPIFunctions.getCustomerById(me.id);
        if (response !== null) {
            localStorage.setItem('me', JSON.stringify(response));
            me = response;
        } else {
            me = await createCustomer();
        }
    }
    return me;
}

async function setUser(user) {
    console.log(user);
    me = user;

    localStorage.setItem('me', JSON.stringify(me));
    //Reload page if necessary
    setTimeout(() => {
        location.reload();

    }, 1000);
}

export const userAuth = {
    getUser,
    setUser,
};