import {screeningAPIFunctions} from './APIFunctions/screeningAPIFunctions.js';
import {hallAPIFunctions} from "./APIFunctions/hallAPIFunctions.js";
import {customerAPIFunctions} from "./APIFunctions/customerAPIFunctions.js";
import {seatManagement} from "./seatManagement.js";
import {userAuth} from "./userAuth.js";
import {moviePosters} from "./moviePosters.js";

let isAdmin = false;
//TODO implement proper customer login when all else is done


async function rowBuilder(seatRow, seats, i) {
    console.log(seatRow);
    const rowElement = document.createElement('div');
    rowElement.className = 'row';
    rowElement.dataset.id = seatRow.id;
    rowElement.style.display = "flex";
    let rowElementTextDiv = document.createElement('div');
    rowElementTextDiv.className = 'row-text';
    rowElementTextDiv.textContent = `Reihe ${i + 1}`;
    rowElement.appendChild(rowElementTextDiv);
    //Textcontent should be fixed width
    // rowElement.style.width = '100%';
    // rowElement.style.display = 'flex';
    // rowElement.style.flexWrap = 'wrap';
    // rowElement.style.maxWidth = `${seats * 50}px`;
    // rowElement.style.justifyContent = 'center';
    // rowElement.style.alignItems = 'center';
    //Create the seats
    for (let j = 0; j < seats; j++) {
        // const seatWidth = "2vw"
        //                     seatIcon.style.fontSize = seatWidth;
        //                     const margin = "0.2vw"
        //                     seatIcon.style.margin = margin;
        //                     seatIcon.title = `Seat ${seat.position}`;
        //                     // Determine the seat's position in the grid
        //                     // seatIcon.style.order = (seat.reihe - 1) * maxSeatsPerRow + seat.pos;
        //                     seatIcon.style.order = seat.position;
        //                     seatIcon.classList.add('seat');
        //                     rowElement.appendChild(seatIcon);
        const seatElement = document.createElement('i');
        seatElement.className = 'fas fa-chair'; // Font Awesome seat icon
        seatElement.dataset.id = j;
        // seatElement.style.fontSize = '24px';
        // seatElement.style.margin =
        seatElement.title = `Seat ${j + 1}`;
        // Determine the seat's position in the grid
        seatElement.style.order = j + 1;
        seatElement.classList.add('builder_seat');
        rowElement.appendChild(seatElement);
    }
    let seatsArray = rowElement.querySelectorAll('.builder_seat');

    //Create the buttons
    const addSeatToRowButton = document.createElement('button');
    addSeatToRowButton.style.order = seats + 1;
    addSeatToRowButton.className = 'addSeatToRow-button';
    addSeatToRowButton.dataset.id = i;
    addSeatToRowButton.textContent = `+ 1`;
    rowElement.appendChild(addSeatToRowButton);
    addSeatToRowButton.addEventListener('click', function (event) {
        hallAPIFunctions.updateRowInHall(seatRow.id, {
            categoryId: seatRow.category.id,
            numberOfSeats: seats + 1,
        }).then((response) => {
            //If successful, update the seats
            if (response.status == 200) {

                //Add a seat to the row
                const rowElement = event.target.parentElement;
                const seatElement = document.createElement('i');
                seatElement.className = 'fas fa-chair'; // Font Awesome seat icon
                seatElement.dataset.id = seats + 1;
                seatElement.style.fontSize = '24px';
                seatElement.style.margin = '5px';
                seatElement.title = `Seat ${seats + 1}`;
                // Determine the seat's position in the grid
                seatElement.style.order = seats + 1;
                seatElement.classList.add('builder_seat');
                rowElement.insertBefore(seatElement, rowElement.lastChild);
                //Set the order of the buttons
                addSeatToRowButton.style.order = rowElement.childElementCount + 1;
                categorySelector.style.order = rowElement.childElementCount + 2;
                seats++;

            }
        });
    });
    const removeSeatFromRowButton = document.createElement('button');
    removeSeatFromRowButton.className = 'removeSeatFromRow-button';
    removeSeatFromRowButton.dataset.id = i;
    removeSeatFromRowButton.textContent = `- 1`;
    removeSeatFromRowButton.addEventListener('click', function (event) {
        //Remove a seat from the row
        const rowElement = event.target.parentElement;
        console.log(rowElement);
        //The last seat in rowElement is the seat to be removed. Check by class
        const seatElement = rowElement.querySelectorAll('.builder_seat')
        console.log(seatElement);
        //If there is only one seat, do not remove it
        if (rowElement.childElementCount == 3) {
            return;
        }
        //Remove the seat from the server
        hallAPIFunctions.updateRowInHall(seatRow.id, {
            categoryId: seatRow.category.id,
            numberOfSeats: seats - 1,
        }).then((response) => {
            //If successful, update the seats
            if (response.status == 200) {
                seatElement[seatElement.length - 1].remove();
                //Set the order of the buttons
                addSeatToRowButton.style.order = rowElement.childElementCount + 1;
                categorySelector.style.order = rowElement.childElementCount + 2;
                seats--;
            }
        });
    });
    rowElement.prepend(removeSeatFromRowButton);
    //Create the category selector
    const categorySelector = document.createElement('select');
    categorySelector.className = 'row-category-selector';
    categorySelector.style.order = seats + 2;
    categorySelector.dataset.id = seats
    categorySelector.textContent = `category`;
    //Get all available categories from the server
    const categories = await hallAPIFunctions.fetchSeatingCategories();
    //Create the options
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement('option');
        option.value = categories[i].id;
        option.textContent = categories[i].name;
        categorySelector.appendChild(option);
    }
    //Add a field to create a new category
    const newCategoryOption = document.createElement('option');
    newCategoryOption.value = 'new';
    newCategoryOption.textContent = 'New category';
    categorySelector.appendChild(newCategoryOption);
    //Add the event listener to the category selector. Create a submit button and a text field
    categorySelector.addEventListener('change', function (event) {
        if (event.target.value == 'new') {
            //Create the form
            const form = document.createElement('form');
            form.className = 'category-form';
            //Create the input fields
            const inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.name = 'name';
            inputName.placeholder = 'Name';
            form.appendChild(inputName);
            const inputPrice = document.createElement('input');
            inputPrice.type = 'text';
            inputPrice.name = 'price';
            inputPrice.placeholder = 'Price';
            form.appendChild(inputPrice);
            //Create the submit button
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            form.appendChild(submitButton);
            //Add the form to the category selector
            categorySelector.parentElement.appendChild(form);
            //Add the event listener to the form
            form.addEventListener('submit', async function (event) {
                //for now just add the category to the dummyCategories
                event.preventDefault();
                //Get the values from the form
                const name = document.getElementsByName('name')[0].value;
                const price = document.getElementsByName('price')[0].value;
                //Create the category
                const category = await hallAPIFunctions.createSeatingCategory(name, price)
                console.log(category);
                //For all rows, add the category to the category selector
                //Get all row-category selectors:
                const categorySelectors = document.querySelectorAll('.row-category-selector');
                console.log(categorySelectors);
                for (let i = 0; i < categorySelectors.length; i++) {
                    //Add the category to the category selector
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    //Append third to last
                    categorySelectors[i].insertBefore(option, categorySelectors[i].children[categorySelectors[i].children.length - 2]);
                }
                //Remove the form
                form.remove();
                //Set the category selector to the newly created category
                // categorySelector.value = category.id;
            })
        }
        else {
            hallAPIFunctions.updateRowInHall(seatRow.id, {
                categoryId: event.target.value,
                numberOfSeats: seats,
            }).then((response) => {
                //If successful, update the seats
                if (response.status == 200) {
                    //Update the category of the row
                    seatRow.category.id = event.target.value;
                }
            });
        }
    })
    //Remove categories
    const removeCategoriesOption = document.createElement('option');
    removeCategoriesOption.value = 'remove';
    removeCategoriesOption.textContent = 'Remove category';
    categorySelector.appendChild(removeCategoriesOption);
    //Add the event listener to the category selector. Create a submit button and a text field
    categorySelector.addEventListener('change', function (event) {
        if (event.target.value == 'remove') {
            //Create the form
            const form = document.createElement('form');
            form.className = 'category-form';
            //Create the input fields
            const inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.name = 'name';
            inputName.placeholder = 'Name';
            form.appendChild(inputName);
            //Create the submit button
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            form.appendChild(submitButton);
            //Add the form to the category selector
            categorySelector.parentElement.appendChild(form);
            //Add the event listener to the form
            form.addEventListener('submit', async function (event) {
                //for now just add the category to the dummyCategories
                event.preventDefault();
                //Get the values from the form
                const name = document.getElementsByName('name')[0].value;
                //Remove the category from the server with the seatRow id
                //Get the id from the category value
                //Find category with the name from the category selector
                const categories = await hallAPIFunctions.fetchSeatingCategories();
                let category;
                for (let i = 0; i < categories.length; i++) {
                    if (categories[i].name == name) {
                        category = categories[i];
                        break;
                    }
                }
                //Remove the category from the server
                await hallAPIFunctions.deleteSeatingCategoryById(category.id)
                const categorySelectors = document.querySelectorAll('.row-category-selector');
                console.log(categorySelectors);
                for (let i = 0; i < categorySelectors.length; i++) {
                    //Remove the category from the category selector
                    //Get the option with the value of the category id
                    const option = categorySelectors[i].querySelector(`[value="${category.id}"]`);
                    //Remove the option
                    option.remove();
                }
                //Remove the form
                form.remove();
                //Set the category selector to the newly created category
                categorySelector.value = category.id;
            })
        }
    })
    rowElement.appendChild(categorySelector);
    // Get the Kinosaal-Builder element
    const kinosaalBuilder = document.getElementById('Kinosaal-Builder');
    const rowControls = kinosaalBuilder.querySelector('.row-controls');

    // Insert the new row before the addRowButton
    if (rowControls) {
        kinosaalBuilder.insertBefore(rowElement, rowControls);
    } else {
        kinosaalBuilder.appendChild(rowElement);
    }
}
document.addEventListener('click', async function(event) {
    if(event.target.matches('.finalize-kinosaal-button') && isAdmin){
        //Get all rows
        const rowsElement = document.getElementById('Kinosaal-Builder').querySelectorAll('.row');
        //Create the Kinosaal object
        const Kinosaal = {
            id: 1,
            fertig_konfiguriert: true,
            reihen: []
        };
        //Iterate over the rows
        rowsElement.forEach(row => {
            //Create the row object
            const rowObject = {
                id: parseInt(row.dataset.id),
                seats: [],
                category: row.querySelector('.row-category-selector').value
            };
            //Iterate over the seats
            const seats = row.querySelectorAll('.builder_seat');
            seats.forEach(seat => {
                //Create the seat object
                const seatObject = {
                    id: parseInt(seat.dataset.id),
                    reservierungs_stat: false,
                    reihe: parseInt(row.dataset.id) + 1,
                    pos: parseInt(seat.dataset.id) + 1,
                    buchung_stat: false
                };
                //Add the seat object to the row object
                rowObject.seats.push(seatObject);
            });
            //Add the row object to the Kinosaal object
            Kinosaal.reihen.push(rowObject);
        });
        //Send the Kinosaal object to the server
        // const response = await fetch(`https://your-spring-boot-app.com/Kinosaale`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ Kinosaal }),
        // });
        // const Kinosaal = await response.json();
        //Dummy Kinosaal
        Kinosaale.push(Kinosaal);
        //Show the screenings
        document.getElementById('screenings').style.display = 'block';
        //Hide the Kinosaal-Builder
        document.getElementById('Kinosaal-Builder').style.display = 'none';
        //Hide the finalize
        event.target.style.display = 'none';

    }
});
document.addEventListener('click', async function(event) {
    if(event.target.matches('.Screening-Builder-Button') && isAdmin){
        //Remove all innerHTML from the Screening-Builder
        document.getElementById('Screening-Builder').innerHTML = '';
        //hide the screenings and screening details
        const screeningsElement = document.getElementById('screenings');
        screeningsElement.style.display = 'none';
        const screeningDetailsElement = document.getElementById('screening-details');
        screeningDetailsElement.style.display = 'none';
        //Hide list of Halls
        document.querySelector('.halls').style.display = 'none';
        //Hide the button
        event.target.style.display = 'none';
        //show the back button
        document.querySelector('.back-button').style.display = 'block';
        document.querySelector('.back-button').addEventListener('click', function () {
            //Hide the Screening-Builder
            document.getElementById('Screening-Builder').style.display = 'none';
            //Show the screenings
            screeningsElement.style.display = 'block';
            //Hide the back button
            this.style.display = 'none';
            //Show the Screening-Builder-Button
            document.querySelector('.Screening-Builder-Button').style.display = 'block';
            //Show the list of Halls
            document.querySelector('.halls').style.display = 'block';
        });
        //Make visible the Screening-Builder
        await createScreeningForm();
    }
})

//This gets film screenings.
async function fetchData() {
    // Fetch the list of all movie screenings when the page loads
    await updateScreenings();

    // When a specific screening is clicked, fetch its details and start checking seat availability
    document.addEventListener('click', async function(event) {
        if (event.target.matches('.screening')) {
            const id = event.target.dataset.id;
            await updateScreeningDetails(id);
            if(event.target.classList.contains('largeScreening')){
                event.target.classList.remove('largeScreening');
                event.target.style.animationName = 'scaleDown'
                event.target.style.animationDuration = '1s'
                event.target.style.animationFillMode = 'forwards'
            } else {
                // Make screening clicked active
                event.target.classList.add('largeScreening');

            }
            // Make all other screenings inactive
            const screenings = document.querySelectorAll('.screening');
            screenings.forEach(screening => {
                if (screening.dataset.id != id) {
                    screening.classList.remove('largeScreening');
                }
            });
            //hide all other screenings
            const screeningsElement = document.getElementById('screenings');
            // screeningsElement.style.display = 'none';
            //hide the Screening-Builder
            document.querySelector('.Screening-Builder-Button').style.display = 'none';
            const hallsList = document.querySelector('.halls');
            if(hallsList){
                document.querySelector('.halls').style.display = 'none';
            }
            //hide the list of Halls

            //show edit button if the user is an admin
            if(isAdmin){
                const editScreeningButton = document.createElement('button');
                editScreeningButton.className = 'edit-screening-button';
                editScreeningButton.textContent = 'Edit screening';
                editScreeningButton.addEventListener('click', function(event){
                    //Edit the screening
                    editScreening(id);
                })
                document.getElementById('screening-details').appendChild(editScreeningButton);
                const screening = await screeningAPIFunctions.getScreeningById(id);
                const hall = await hallAPIFunctions.getHallById(screening.playsInHallId);
                if(!hall.configured) {
                    //Edit the cinema hall
                    const editCinemaHallButton = document.createElement('button');
                    editCinemaHallButton.className = 'edit-cinema-hall-button';
                    editCinemaHallButton.textContent = 'Edit cinema hall';
                    editCinemaHallButton.addEventListener('click', function (event) {
                        //Edit the cinema hall
                        editCinemaHall(hall.id);
                    })
                    document.getElementById('screening-details').appendChild(editCinemaHallButton);
                }
            }
            // Start checking seat availability for this screening
            await seatManagement.startSeatChecking(id); // Start checking seat availability for this screening
            // Show a booking button if the user is logged in
            if (await userAuth.getUser()) {
                //If it does not exist yet, create it
                const finalizeButton = document.createElement('button');
                finalizeButton.className = 'finalize-button';
                finalizeButton.textContent = 'Book reserved seats';
                document.getElementById('screening-details').appendChild(finalizeButton);
                finalizeButton.addEventListener('click', seatManagement.finalizeReservation);
            }
            // Show the back button
            document.querySelector('.back-button').style.display = 'block';
            // Hide the screening details after clicking on a button and show all screenings again instead
            //If event listener does not exist yet, add it
            document.querySelector('.back-button').addEventListener('click', function() {
                const screeningDetailsElement = document.getElementById('screening-details');
                screeningDetailsElement.style.display = 'none';
                screeningsElement.style.display = 'block';
                // Reset the seats
                //Stop checking seats
                seatManagement.stopSeatChecking();
                const seatsElement = document.getElementById('seats');
                seatsElement.style.display = 'none';
                this.style.display = 'none';
                if(isAdmin) {
                    //Delete all the edit buttons
                    const editScreeningButton = document.querySelector('.edit-screening-button');
                    if(editScreeningButton){
                        editScreeningButton.remove();
                    }
                    const editCinemaHallButton = document.querySelector('.edit-cinema-hall-button');
                    if(editCinemaHallButton){
                        editCinemaHallButton.remove();
                    }
                    const finalizeButton = document.querySelector('.finalize-button');
                    if(finalizeButton){
                        finalizeButton.remove();
                    }
                    const KinosaalBuilder = document.querySelector('#Kinosaal-Builder');
                    if(KinosaalBuilder){
                        KinosaalBuilder.style.display = 'none';
                    }
                    document.querySelector('.Screening-Builder-Button').style.display = 'block';
                    const hallsList = document.querySelector('.halls');
                    if(hallsList !== null && hallsList.style.display == 'none'){
                        document.querySelector('.halls').style.display = 'block';
                    }
                }
            });
        }
    });

    // Handle seat selection and reservation
    document.addEventListener('click', async function(event) {
        if (event.target.matches('.seat')) {
            const id = event.target.dataset.id;
            const screeningId = document.querySelector('#screening-details').dataset.id;
            await seatManagement.attemptSeatReservation(id, event.target, screeningId);
        }
    });

    // Finalize the reservation
    document.querySelector('.finalize-button').addEventListener('click', seatManagement.finalizeReservation);
}

// Call the async function
fetchData();
// Function to update an existing screening (dummy implementation)
async function patchScreening(screeningData) {
    // Send a PATCH or PUT request to the server
    // Update the screenings display
    await screeningAPIFunctions.updateScreening(screeningData.id, screeningData.film, parseInt(screeningData.playsInHallId), screeningData.played).then(() => {
        //Click back button
        document.querySelector('.back-button').click();
        //Remove the form
        document.querySelector('.Screening-Builder-Form').remove();
        //refresh the screenings
        updateScreenings();
    });
    // Hide the screening builder

}
async function createScreeningForm(screeningData) {
    //Make visible the Screening-Builder
    document.getElementById('Screening-Builder').style.display = 'block';
    //Create the form
    const form = document.createElement('form');
    form.className = 'Screening-Builder-Form';
    //Create the input fields
    const inputFilm = document.createElement('input');
    inputFilm.type = 'text';
    inputFilm.name = 'film';
    inputFilm.placeholder = 'Film';
    form.appendChild(inputFilm);
    const inputplaysInHallId = document.createElement('select');
    //Get the Kinosaale from the server. For now just use the dummyKinosaale array
    const halls = await hallAPIFunctions.getAllHalls();
    for(let i = 0; i < halls.length; i++){
        const hall = await hallAPIFunctions.getHallById(parseInt(halls[i]));
        if(hall.configured) {
            const option = document.createElement('option');
            option.value = halls[i];
            option.textContent = `Hall ${halls[i]}`;
            inputplaysInHallId.appendChild(option);
        }
    }
    inputplaysInHallId.name = 'playsInHallId';
    form.appendChild(inputplaysInHallId);
    // Create a select element for stattgefunden status
    const selectStattgefundenStat = document.createElement('select');
    selectStattgefundenStat.name = 'played';

// Create stattgefunden option
    const stattgefundenOption = document.createElement('option');
    stattgefundenOption.value = true;
    stattgefundenOption.textContent = 'stattgefunden';

// Create nicht stattgefunden option
    const nichtstattgefundenOption = document.createElement('option');
    nichtstattgefundenOption.value = false;
    nichtstattgefundenOption.textContent = 'nicht stattgefunden';

// Append options to the select element
    selectStattgefundenStat.appendChild(stattgefundenOption);
    selectStattgefundenStat.appendChild(nichtstattgefundenOption);

// Append the select element to the form
    form.appendChild(selectStattgefundenStat);
    //Create the submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    form.appendChild(submitButton);
    //Add the form to the Screening-Builder
    document.getElementById('Screening-Builder').appendChild(form);
    //Add the event listener to the form
    form.addEventListener('submit', async function (event) {
        //for now just add the screening to the dummyScreenings
        event.preventDefault();
        //Get the values from the form
        const film = document.getElementsByName('film')[0].value;
        const playsInHallId = document.getElementsByName('playsInHallId')[0].value;
        const played = document.getElementsByName('played')[0].value;
        screeningAPIFunctions.addNewScreening( parseInt(playsInHallId),film, played).then(() => {
            //Click back button
            document.querySelector('.back-button').click();
            //Remove the form
            document.querySelector('.Screening-Builder-Form').remove();
            //refresh the screenings
            updateScreenings();
        })

    })
}
async function populateScreeningForm(screeningData) {
    //if form already exists remove it
    const form = document.querySelector('.Screening-Builder-Form');
    if (form) {
        form.remove();
        return;
    }
    await createScreeningForm(screeningData);
    //<form class="Screening-Builder-Form"><input type="text" name="film" placeholder="Film"><select name="playsInHallId"><option value="1">Kinosaal 1</option><option value="2">Kinosaal 2</option></select><select name="played"><option value="true">stattgefunden</option><option value="false">nicht stattgefunden</option></select><button type="submit">Submit</button></form>
    //Get the input fields
    const inputFilm = document.getElementsByName('film')[0];
    const inputplaysInHallId = document.getElementsByName('playsInHallId')[0];
    const inputStattgefundenStat = document.getElementsByName('played')[0];
    //Populate the input fields
    inputFilm.value = screeningData.film;
    inputplaysInHallId.value = screeningData.playsInHallId;
    //Set selected to the one that contains the screeningData.playsInHallId
    //The string of the options will be Hall + id
    inputplaysInHallId.querySelector(`[value="${screeningData.playsInHallId}"]`).selected = true;
    //If stattgefunden, select the value true
    if(screeningData.played){
        inputStattgefundenStat.querySelector(`[value="true"]`).selected = true;
    }
    else{
        inputStattgefundenStat.querySelector(`[value="false"]`).selected = true;
    }

    // Update the submit event for the screening form to handle both create and update
    document.querySelector('.Screening-Builder-Form').addEventListener('submit', async function (event) {
        event.preventDefault();
        //Get the values from the form
        const film = document.getElementsByName('film')[0].value;
        const playsInHallId = document.getElementsByName('playsInHallId')[0].value;
        let played = document.getElementsByName('played')[0].value;
        //Make string into boolean
        played == 'true' ? played = true : played = false;
        //Create the screening object
        const screening = {
            id: screeningData.id,
            film: film,
            playsInHallId: playsInHallId,
            played: played
        };
        //Update the screening
        await patchScreening(screening);
    });
}
// Periodically update screenings
async function refreshScreenings() {
    await updateScreenings();
}
setInterval(refreshScreenings, 30000); // Refresh every 30 seconds
async function editScreening(screeningId){
    //Fetch the screening
    // const response = await fetch(`https://your-spring-boot-app.com/screenings/${screeningId}`);
    // const screening = await response.json();
    //Find the screening with the id
    const screeningData = await screeningAPIFunctions.fetchAllScreenings().then(screenings => {
        return screenings.find(screening => screening.id == screeningId);
    })
    // const screeningData = dummyScreenings.find(screening => screening.id == screeningId);

    //Populate the form
    populateScreeningForm(screeningData);

}
async function editCinemaHall(hallId){

    //Hide the screening-details
    document.getElementById('screening-details').style.display = 'none';
    //Screening innerhtml should be empty
    document.getElementById('screening-details').innerHTML = '';
    if(document.querySelector('.seatsElement') != null){
        document.querySelector('.seatsElement').innerHTML = '';
    }
    if(document.querySelector('#Kinosaal-Builder').innerHTML != null){
        document.querySelector('#Kinosaal-Builder').innerHTML = '';
    }
    //Show the Kinosaal-Builder
    document.getElementById('Kinosaal-Builder').style.display = 'block';
    //Stop interval for seat checking
    seatManagement.stopSeatChecking();
    // const screeningData = dummyScreenings.find(screening => screening.id == screeningId);
    //Get the Kinosaal
    // const response2 = await fetch(`https://your-spring-boot-app.com/Kinosaale/${screeningData.playsInHallId}`);
    // const Kinosaal = await response2.json();
    //Find the Kinosaal with the id
    let hall = await hallAPIFunctions.getHallById(hallId);

    console.log(hall);
    //Populate the Kinosaal-Builder
    //Remove all innerHTML from the
    for(let i = 0; i < hall.seatRows.length; i++){
        await rowBuilder(hall.seatRows[i], hall.seatRows[i].seats.length , i);
    }
    //addRowButton
    const addRowButton = document.createElement('button');
    addRowButton.className = 'add-row-button';
    // addRowButton.dataset.id = rows;
    addRowButton.textContent = `Add row`;
    document.getElementById('Kinosaal-Builder').appendChild(addRowButton);
    addRowButton.addEventListener('click', async function (event) {
        //Add a row to the Kinosaal-Builder
        const rows = document.getElementById('Kinosaal-Builder').childElementCount - 1;
        let category;
        console.log(hall);
        if (!hall.seatRows || hall.seatRows.length == 0) {
            //Get available categories
            category = await hallAPIFunctions.fetchSeatingCategories().then(categories => {
                console.log(categories);
                return categories[0];
            });
        } else {
            category = hall.seatRows[hall.seatRows.length - 1].category;
        }
        hallAPIFunctions.addRowsToHall(hallId,
            [{
                categoryId: category.id,
                numberOfSeats: 10
            }
            ]
        ).then((response) => {
            console.log(response);
            if (response.seatRows != null && response.seatRows.length > hall.seatRows.length - 1) {
                //Get the hall
                hallAPIFunctions.getHallById(hallId).then(async hall => {
                    //Get the last row
                    const row = hall.seatRows[hall.seatRows.length - 1];
                    console.log(row);
                    //Create the row
                    console.log(hall.seatRows.length - 1);
                    await rowBuilder(row, row.seats.length, hall.seatRows.length - 1);
                }).then(() => {
                   //Update this rows category to the new category
                    const rowsElement = document.getElementById('Kinosaal-Builder').querySelectorAll('.row');
                    const row = rowsElement[rowsElement.length - 1];
                    const categorySelector = row.querySelector('.row-category-selector');
                    //Change selected to the new category
                    categorySelector.querySelector(`[value="${category.id}"]`).selected = true;
                })
            }
        });

    });
    const removeRowButton = document.createElement('button');
    removeRowButton.className = 'remove-row-button';
    // removeRowButton.dataset.id = rows;
    removeRowButton.textContent = `Remove row`;
    removeRowButton.addEventListener('click', async function (event) {
        const currentHall = await hallAPIFunctions.getHallById(hallId);
        console.log(currentHall.seatRows[currentHall.seatRows.length - 1].id);
        console.log(currentHall.id);
        hallAPIFunctions.deleteRow(currentHall.id, currentHall.seatRows[currentHall.seatRows.length - 1].id).then((response) => {
            if (response.status == 200) {
                //Remove a row from the Kinosaal-Builder
                const rows = document.getElementById('Kinosaal-Builder').childElementCount - 1;
                //If there is only one row, do not remove it
                if (rows == 1) {
                    return;
                }
                //Get all rows
                const rowsElement = document.getElementById('Kinosaal-Builder').querySelectorAll('.row');
                //Remove the last row
                rowsElement[rowsElement.length - 1].remove();
            }
        });
    });
    const rowControls = document.createElement('div');
    rowControls.className = 'row-controls';
    rowControls.appendChild(addRowButton);
    rowControls.appendChild(removeRowButton);
    rowControls.style.display = 'flex';
    rowControls.style.flexDirection = 'row';
    document.getElementById('Kinosaal-Builder').appendChild(rowControls);
    //Add button to finish configuration
    const finalizeButton = document.createElement('button');
    finalizeButton.className = 'finalize-kinosaal-button';
    finalizeButton.textContent = 'Finalize cinema hall';
    finalizeButton.addEventListener('click', function(event){
        hallAPIFunctions.finishHall(hallId).then((response) => {
            console.log(response);
            if(response.status == 200){
                //Hide the Kinosaal-Builder
                document.getElementById('Kinosaal-Builder').style.display = 'none';
                //Show the screenings
                document.getElementById('screenings').style.display = 'block';
                //Hide the back button
                document.querySelector('.back-button').style.display = 'none';
                //Show the list of Halls
                document.querySelector('.halls').style.display = 'block';
                //Show the screenings
                document.getElementById('screenings').style.display = 'block';
                document.querySelector('.Screening-Builder-Button').style.display = 'block';
            }
        })
    })
    document.getElementById('Kinosaal-Builder').appendChild(finalizeButton);
}
function screeningArraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // Sort arrays to ensure order is the same
    a = [...a].sort((x, y) => x.id - y.id);
    b = [...b].sort((x, y) => x.id - y.id);

    for (var i = 0; i < a.length; ++i) {
        if (a[i].id !== b[i].id || a[i].film !== b[i].film || a[i].played !== b[i].played || a[i].playsInHallId !== b[i].playsInHallId) {
            return false;
        }
    }
    return true;
}
// Function to update screenings
async function updateScreenings() {
    try {
        //Get from localhost localhost:8080/screening
        const screenings = await screeningAPIFunctions.fetchAllScreenings()
        const oldScreenings = JSON.parse(localStorage.getItem('screenings'));
        console.log(oldScreenings);
        console.log(screenings);
        console.log(oldScreenings == screenings);
        const screeningsElement = document.getElementById('screenings')
        console.log(screeningsElement.innerHTML)
        if(screeningsElement.childElementCount > 0 && screeningArraysEqual(oldScreenings, screenings) ){
            return;
        }
        // const screenings = dummyScreenings;

        //Filter out screenings that have already happened
        const upcomingScreenings = screenings.filter(screening => !screening.played);
        screeningsElement.innerHTML = ''; // Clear current listings
        // Iterate over screenings and create elements for each one
        for (const screening of upcomingScreenings) {
            const screeningElement = document.createElement('div');
            screeningElement.className = 'screening';
            screeningElement.dataset.id = screening.id;
            screeningElement.textContent = `${screening.film} - Click to view details`;
            const moviePoster = await moviePosters.getMoviePoster(screening.film);
            if (moviePoster) {
                screeningElement.style.backgroundImage = `url(${moviePoster})`;

            }
            screeningsElement.appendChild(screeningElement);
        }
        localStorage.setItem('screenings', JSON.stringify(screenings));
    } catch (error) {
        console.error('Error fetching screenings:', error);
    }
}


// Function to update screening details
async function updateScreeningDetails(screeningId) {
    try {
        // const response = await fetch(`https://your-spring-boot-app.com/screenings/${screeningId}`);
        // const screeningDetails = await response.json();
        //Find the screening with the id
        const screeningDetails = await screeningAPIFunctions.fetchAllScreenings().then(screenings => {
            return screenings.find(screening => screening.id == screeningId);
        })
        const screeningDetailsElement = document.getElementById('screening-details');
        screeningDetailsElement.style.display = 'block';
        screeningDetailsElement.innerHTML = `<strong>${screeningDetails.film}</strong> - Screening Details `;
        screeningDetailsElement.dataset.id = screeningDetails.id;
        if(isAdmin){
            //Show earnings
            const earnings = await screeningAPIFunctions.calculateEarningsFromScreening(screeningId);
            const earningsElement = document.createElement('div');
            earningsElement.className = 'earnings';
            earningsElement.textContent = `Earnings: ${earnings}€`;
            screeningDetailsElement.appendChild(earningsElement);

        }
    } catch (error) {
        console.error('Error fetching screening details:', error);
    }
}






// User registration
document.querySelector('#registration-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Get user details from form
    // Send a POST request to the server for registration
});

async function hallListBuilder(){
    const halls = await hallAPIFunctions.getAllHalls();
    console.log(halls);
    const hallsContainer = document.createElement('div');
    hallsContainer.className = 'halls';
    document.body.appendChild(hallsContainer);
    for (let i = 0; i < halls.length; i++) {
        const hall = await hallAPIFunctions.getHallById(halls[i]);
        console.log(hall);
        const hallElement = document.createElement('div');
        hallElement.className = 'hall';
        hallElement.textContent = `Hall ${hall.id}`;
        hallsContainer.appendChild(hallElement);
        const deleteHallButton = document.createElement('button');
        deleteHallButton.className = 'delete-hall-button';
        deleteHallButton.textContent = 'Delete Cinema Hall';
        deleteHallButton.addEventListener('click', async function (event) {
            //Delete the hall
            await hallAPIFunctions.deleteHallById(hall.id);
            //Remove the hall from the list of halls
            hallElement.remove();
        });
        hallElement.appendChild(deleteHallButton);
        if (!hall.configured) {
            const editHallButton = document.createElement('button');
            editHallButton.className = 'edit-hall-button';
            editHallButton.textContent = 'Edit Cinema Hall';
            editHallButton.addEventListener('click', async function (event) {
                //Edit the hall

                await editCinemaHall(hall.id);
                //Hide the screen-builder button
                document.querySelector('.Screening-Builder-Button').style.display = 'none';
                //Hide all other halls
                const halls = document.querySelector('.halls');
                halls.style.display = 'none';
                //Show the back button
                const backButton = document.querySelector('.back-button');
                backButton.style.display = 'block';
                //Add event listener to the back button
                backButton.addEventListener('click', function (event) {
                    //Show all halls
                    const halls = document.querySelectorAll('.hall');
                    for (let i = 0; i < halls.length; i++) {
                        halls[i].style.display = 'block';
                    }
                    //Hide the back button
                    backButton.style.display = 'none';
                    //Show the screen-builder button
                    document.querySelector('.Screening-Builder-Button').style.display = 'block';
                    //Remove the Kinosaal-Builder
                    document.getElementById('Kinosaal-Builder').style.display = 'none';
                    //Remove the screening details
                    document.getElementById('screening-details').style.display = 'none';
                    //Remove the seats
                    document.getElementById('seats').style.display = 'none';
                    if(document.querySelector('.finalize-kinosaal-button') != null){
                        //Remove the finalize button
                        document.querySelector('.finalize-kinosaal-button').remove();
                    }
                    //Remove the row controls
                    document.querySelector('.row-controls').remove();
                })
            });
            hallElement.appendChild(editHallButton);
        }
    }
    //Create a button to add a new hall
    const addHallButton = document.createElement('button');
    addHallButton.className = 'add-hall-button';
    addHallButton.textContent = 'Add Cinema Hall';
    addHallButton.addEventListener('click', async function (event) {
        //Add a new hall
        const newHall = await hallAPIFunctions.createHall({configured: false}, []);
        //Add the hall to the list of halls
        const hallElement = document.createElement('div');
        hallElement.className = 'hall';
        hallElement.textContent = `Hall ${newHall.id}`;
        hallsContainer.appendChild(hallElement);
        const deleteHallButton = document.createElement('button');
        deleteHallButton.className = 'delete-hall-button';
        deleteHallButton.textContent = 'Delete Cinema Hall';
        deleteHallButton.addEventListener('click', async function (event) {
            //Delete the hall
            await hallAPIFunctions.deleteHallById(newHall.id);
            //Remove the hall from the list of halls
            hallElement.remove();
        });
        hallElement.appendChild(deleteHallButton);
        const editHallButton = document.createElement('button');
        editHallButton.className = 'edit-hall-button';
        editHallButton.textContent = 'Edit Cinema Hall';
        editHallButton.addEventListener('click', async function (event) {
            //Edit the hall
            await editCinemaHall(newHall.id);
            //Hide the screen-builder button
            document.querySelector('.Screening-Builder-Button').style.display = 'none';
            //Hide all other halls
            const halls = document.querySelectorAll('.hall');
            for (let i = 0; i < halls.length; i++) {
                halls[i].style.display = 'none';
            }
            //Show the back button
            const backButton = document.querySelector('.back-button');
            backButton.style.display = 'block';
            //Add event listener to the back button
            backButton.addEventListener('click', function (event) {
                //Show all halls
                const halls = document.querySelectorAll('.hall');
                for (let i = 0; i < halls.length; i++) {
                    halls[i].style.display = 'block';
                }
                //Hide the back button
                backButton.style.display = 'none';
                //Show the screen-builder button
                document.querySelector('.Screening-Builder-Button').style.display = 'block';
                //Remove the Kinosaal-Builder
                document.getElementById('Kinosaal-Builder').style.display = 'none';
                //Remove the screening details
                document.getElementById('screening-details').style.display = 'none';
                //Remove the seats
                document.getElementById('seats').style.display = 'none';
                //Remove the finalize button
                document.querySelector('.finalize-kinosaal-button').remove();
                //Remove the row controls
                document.querySelector('.row-controls').remove();
            })
        });
        hallsContainer.remove();
        await hallListBuilder();
    })
    hallsContainer.appendChild(addHallButton);
}
// User login
document.querySelector('#login-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    // Get login credentials from form
    //dummy login for now. Get the username and password from the form. Get by name
    const username = document.getElementsByName('username')[0].value;
    const password = document.getElementsByName('password')[0].value;
    if (username == 'admin' && password == 'admin') {
        //clear values
        document.getElementsByName('username')[0].value = '';
        document.getElementsByName('password')[0].value = '';
        isAdmin = true;
        //Hide the login form
        document.querySelector('#login-form').style.display = 'none';
        //Show the logout button
        document.querySelector('#logout-button').style.display = 'block';
        //Show the screening builder button
        document.querySelector('.Screening-Builder-Button').style.display = 'block';
        //Click back button
        document.querySelector('.back-button').click();
        await hallListBuilder();
        await updateScreenings();
    }

    // Send a POST request to the server for login
});

// User logout
document.querySelector('#logout-button').addEventListener('click', function() {
    // Send a POST request to the server for logout
    //Show the login form
    document.querySelector('#login-form').style.display = 'block';
    //Hide the logout button
    document.querySelector('#logout-button').style.display = 'none';
    //refresh
    location.reload();
});
