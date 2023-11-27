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
        console.log('Error creating customer');
    } else {
        console.log('Customer created');
        me = customer;
        //Save me locally
        localStorage.setItem('me', JSON.stringify(me));
    }
}
//Get customer by id
async function getUser() {
//Try to get me locally
    let tempMe = JSON.parse(localStorage.getItem('me'));
    //If me is null, create new customer
    if (tempMe === null) {
        tempMe = await createCustomer();
        me = tempMe;
        console.log(me);
    } else {

        await customerAPIFunctions.getCustomerById(me.id).then(async response => {
            if (response === null) {
                console.log('Error getting customer');
                me = await createCustomer();
            } else {
                console.log('Customer found');
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