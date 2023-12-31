import { customerAPIFunctions} from "./APIFunctions/customerAPIFunctions.js";

var me;

async function initializeCustomerHtml() {
    const user = await getUser();
    if(user == null || user == undefined || user.name == ""){
        document.querySelector('#CustomerNameHeader').innerText = "Willkommen, Gast!";

    } else {
        document.querySelector('#CustomerNameHeader').innerText = "Willkommen, " + user.name + "!" + " (" + user.id + ")";
    }
    const registerForm = document.createElement('form');
    registerForm.className = 'register-form';
    const registerInput = document.createElement('input');
    registerInput.type = 'text';
    registerInput.name = 'newUserName';
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
        console.log(name);
        const user = await customerAPIFunctions.createCustomer(name);
        console.log(user);
        if (user != null) {
            //Set the user
            localStorage.setItem('me', JSON.stringify(user));
            //Update the header
            document.querySelector('#CustomerNameHeader').innerText = "Willkommen, " + user.name + "!" + " (" + user.id + ")";
            //Remove the form
            this.remove();
            setTimeout(() => {
                location.reload();
            }, 1000)
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
        console.error("Error getting user:", error);

    }
}

async function setUser(user) {
    console.log(user);
    me = user;

    localStorage.setItem('me', JSON.stringify(me));
    setTimeout(() => {
        location.reload();

    }, 1000);
}

export const userAuth = {
    getUser,
    setUser,
    initalizeCustomerHtml: initializeCustomerHtml
};