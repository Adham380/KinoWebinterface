import { customerAPIFunctions} from "./APIFunctions/customerAPIFunctions.js";

var me = {
    id: 59,
    name: 'Bobbie',
}
async function createCustomer() {
   if(me === null){
       me = {
           name: 'Bobbie',
       }
    }
    const customer = await customerAPIFunctions.createCustomer(me.name)
    if(customer == null){
    } else {
        me = customer;
        //Save me locally
        localStorage.setItem('me', JSON.stringify(me));
    }
}
//Get customer by id
async function getUser() {
//Try to get me locally
    let tempMe = localStorage.getItem('me')
    console.log(tempMe);
    //If me is null, create new customer
    if (tempMe === null || tempMe === undefined) {
        tempMe = await createCustomer();
        me = JSON.parse(JSON.stringify(tempMe));
    } else {

        await customerAPIFunctions.getCustomerById(me.id).then(async response => {
            if (response === null) {
                me = await createCustomer();
            } else {
                localStorage.setItem('me', JSON.stringify(response));
                me = response;
            }
        });
    }
    return JSON.parse(localStorage.getItem('me'));
}
export const userAuth = {
    getUser,
}