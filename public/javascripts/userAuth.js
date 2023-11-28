import { customerAPIFunctions} from "./APIFunctions/customerAPIFunctions.js";

var me;

async function initializeCustomerHtml() {
    const user = await getUser();
    if(user == null || user == undefined || user.name == ""){
        document.querySelector('#CustomerNameHeader').innerText = "Willkommen, Gast!";

    } else {
        document.querySelector('#CustomerNameHeader').innerText = "Willkommen, " + user.name + "!" + " (" + user.id + ")";
    }
//Append a small register form
    const registerForm = document.createElement('form');
    registerForm.className = 'register-form';
    const registerInput = document.createElement('input');
    registerInput.type = 'text';
    registerInput.name = 'name';
    registerInput.placeholder = 'Register as new customer';
    registerForm.appendChild(registerInput);
    const registerButton = document.createElement('button');
    registerButton.type = 'submit';
    registerButton.textContent = 'Register';
    registerForm.appendChild(registerButton);
    document.querySelector('#CustomerNameHeader').appendChild(registerForm);
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const name = document.querySelector('.register-form input').value;
        const user = await customerAPIFunctions.createCustomer(name);
        if (user != null) {
            //Set the user
            localStorage.setItem('me', JSON.stringify(user));
            //Update the header
            document.querySelector('#CustomerNameHeader').innerText = "Willkommen, " + user.name + "!" + " (" + user.id + ")";
            //Remove the form
            this.remove();
            setTimeout(() => {
                location.reload();
            }, 500)
        }
    });
}
try {

    const storedMe = localStorage.getItem('me');
    console.log(storedMe.name)
    const parsedMe = JSON.parse(storedMe);
    console.log(parsedMe.name)
    if (parsedMe == null || parsedMe == undefined || parsedMe == "" || parsedMe.name == null || parsedMe.name == undefined || parsedMe.name == "") {

            const newMe = await customerAPIFunctions.createCustomer("Bobbie");

            me = newMe;
                localStorage.setItem('me', JSON.stringify(me));

    } else {
        me = storedMe;
    }
} catch (error) {
    await initializeCustomerHtml()
    console.error("Error parsing 'me' from localStorage:", error);
    // Create customer
    // const newMe = await customerAPIFunctions.createCustomer('Bobbie');
    // console.log(newMe);
    // if (newMe != null) {
    //     me = newMe;
    //     localStorage.setItem('me', JSON.stringify(me));
    // }
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
    try {

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
    } catch (error) {
        // await initializeCustomerHtml()
        console.error("Error getting user:", error);
    // location.reload();


    }
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
    initalizeCustomerHtml: initializeCustomerHtml
};