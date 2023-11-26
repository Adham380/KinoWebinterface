import {screeningAPIFunctions} from './APIFunctions/screeningAPIFunctions.js';
import {hallAPIFunctions} from "./APIFunctions/hallAPIFunctions.js";
import {customerAPIFunctions} from "./APIFunctions/customerAPIFunctions.js";

let isAdmin = false;
//TODO implement proper customer login when all else is done
let me = {
    id: 59,
    name: 'Bobbie',
}

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
        const seatElement = document.createElement('i');
        seatElement.className = 'fas fa-chair'; // Font Awesome seat icon
        seatElement.dataset.id = j;
        seatElement.style.fontSize = '24px';
        seatElement.style.margin = '5px';
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
    const addRowButton = kinosaalBuilder.querySelector('.add-row-button');

    // Insert the new row before the addRowButton
    if (addRowButton) {
        kinosaalBuilder.insertBefore(rowElement, addRowButton);
    } else {
        kinosaalBuilder.appendChild(rowElement);
    }
}
document.addEventListener('click', async function(event) {
    if (event.target.matches('.Kinosaal-Builder-Button')) {
        //Remove all innerHTML from the Kinosaal-Builder
        document.getElementById('Kinosaal-Builder').innerHTML = '';
        //hide the screenings and screening details
        const screeningsElement = document.getElementById('screenings');
        screeningsElement.style.display = 'none';
        const screeningDetailsElement = document.getElementById('screening-details');
        screeningDetailsElement.style.display = 'none';
        //Hide the button
        event.target.style.display = 'none';
        //show the back button
        document.querySelector('.back-button').style.display = 'block';
        document.querySelector('.back-button').addEventListener('click', function () {
            //Hide the Kinosaal-Builder
            document.getElementById('Kinosaal-Builder').style.display = 'none';
            //Show the screenings
            screeningsElement.style.display = 'block';
            //Hide the back button
            this.style.display = 'none';
            //Show the Kinosaal-Builder-Button
            document.querySelector('.Kinosaal-Builder-Button').style.display = 'block';
        });
        //Make visible the Kinosaal-Builder
        document.getElementById('Kinosaal-Builder').style.display = 'block';
        //Make a default of 10 rows and 10 seats
        let rows = 10;
        let seats = 10;
        //Create the rows and besides each row is a button to add or remove seats and set the category
        //     const seatIcon = document.createElement('i');
        //                 seatIcon.className = 'fas fa-chair'; // Font Awesome seat icon
        //                 seatIcon.dataset.id = seat.id;
        //                 seatIcon.style.fontSize = '24px';
        //                 seatIcon.style.margin = '5px';
        //                 seatIcon.title = `Seat ${seat.pos}`;
        //                 // Determine the seat's position in the grid
        //                 seatIcon.style.order = (seat.reihe - 1) * maxSeatsPerRow + seat.pos;
        //                 seatIcon.classList.add('seat');
        //                 seatsElement.appendChild(seatIcon);
        //Create the rows
        for (let i = 0; i < rows; i++) {
            await rowBuilder(seats, i);
        }
        //Under the last row is a button to add or remove rows
        const addRowButton = document.createElement('button');
        addRowButton.className = 'add-row-button';
        // addRowButton.dataset.id = rows;
        addRowButton.textContent = `+ 1`;
        document.getElementById('Kinosaal-Builder').appendChild(addRowButton);
        addRowButton.addEventListener('click', function (event) {
            //Add a row to the Kinosaal-Builder
            const rows = document.getElementById('Kinosaal-Builder').childElementCount - 1;
            rowBuilder(seats, rows - 1);
        });
        const removeRowButton = document.createElement('button');
        removeRowButton.className = 'add-row-button';
        // removeRowButton.dataset.id = rows;
        removeRowButton.textContent = `- 1`;
        removeRowButton.addEventListener('click', function (event) {
            //Remove a row from the Kinosaal-Builder
            const rows = document.getElementById('Kinosaal-Builder').childElementCount - 1;
            //If there is only one row, do not remove it
            if(rows == 1){
                return;
            }
            //Get all rows
            const rowsElement = document.getElementById('Kinosaal-Builder').querySelectorAll('.row');
            //Remove the last row
            rowsElement[rowsElement.length - 1].remove();
        });
        document.getElementById('Kinosaal-Builder').appendChild(removeRowButton);
    }
});
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
        //Show the Kinosaal-Builder-Button
        document.querySelector('.Kinosaal-Builder-Button').style.display = 'block';

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
        //Hide kinosaal builder button
        document.querySelector('.Kinosaal-Builder-Button').style.display = 'none';
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
            //Show the Kinosaal-Builder-Button
            document.querySelector('.Kinosaal-Builder-Button').style.display = 'block';
        });
        //Make visible the Screening-Builder
        await createScreeningForm();
    }
})

const seatsReservedByMe = [
    {
        seatId: 1,
        screeningId: 1,
    },
    {
        seatId: 2,
        screeningId: 1,
    }
];
const seatsBookedByMe = [
    {
        seatId: 3,
        screeningId: 1,
    },
    {
        seatId: 4,
        screeningId: 1,
    }
];
const dummySeatsForMovieOne = [
    {
        id: 1,
        reservierungs_stat: true,
        reihe: 1,
        pos: 1,
        buchung_stat: false
    },
    {
        id: 2,
        reservierungs_stat: false,
        reihe: 1,
        pos: 2,
        buchung_stat: false
    }
];

//Filmauffuehrungen
const dummySeatsForMovieTwo = [];
let dummySeatsGenerator = (movieId) => {
    let dummySeats = [];
    for(let i = 1; i < 101; i++){
        dummySeats.push({
            id: i,
            //random chance of seat being reserved
            reservierungs_stat: Math.random() > 0.5,
            reihe: Math.floor(i / 10) + 1,
            pos: i % 10 + 1,
            //random chance of seat being booked
            buchung_stat: Math.random() > 0.5,
        });
    }
    return dummySeats;
}
/*
{ So sieht ein Kinosaal aus
  "id": 0,
  "fertig_konfiguriert": true,
  "reihen": [
    {
      "id": 0,
      "seats": [
        {
          "position": 0,
          "reserviert": true,
          "gebucht": true
        }
      ],
      "category": "Parkett"
    }
  ]
}
 */
const Kinosaale = [
    {
        "id": 1,
        "fertig_konfiguriert": true,
        "reihen": [
            {
                "id": 0,
                "seats": [
                    {
                        "id": 0,
                        "position": 0,
                        "reserviert": true,
                        "gebucht": true
                    }
                ],
                "category": "Parkett"
            }
        ]
    },
    {
        id: 2,
        fertig_konfiguriert: true,
        reihen: [
            {
                id: 1,
                seats: dummySeatsForMovieTwo,
                category: 'Parkett'
            }
        ]
    }
]
const dummySeats = dummySeatsGenerator(1);
const dummySeats2 = dummySeatsGenerator(2);
//Attach seats to the Kinosaele
let dummySeatsGeneratorForCinemaHall = (cinemaHallId) => {
    let seatIdCounter = 1; // Initialize a counter for seat IDs

    // Determine a random number of rows between 5 and 10
    const numberOfRows = Math.floor(Math.random() * (10 - 5 + 1)) + 5;

    // Clear existing rows in the cinema hall
    Kinosaale[cinemaHallId - 1].reihen = [];

    for (let rowId = 1; rowId <= numberOfRows; rowId++) {
        // Create a new row
        const newRow = {
            id: rowId,
            seats: [],
            category: 'Randomly Assigned Category' // Assign category as needed
        };

        // Determine a random number of seats for this row, for example between 10 and 15
        const numberOfSeats = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
        for (let seatPos = 1; seatPos <= numberOfSeats; seatPos++) {
            // Generate a seat and push it to the row's seats
            //ChanceOfSeatBeingReserved

            if(Math.random() > 0.5){

            }
            newRow.seats.push({
                id: seatIdCounter++, // Use and increment the seatIdCounter
                reservierungs_stat: Math.random() > 0.5,
                reihe: rowId,
                pos: seatPos,
                buchung_stat: Math.random() > 0.5,
                reserviert: Math.random() > 0.5,
                gebucht: Math.random() > 0.5,
            });
        }

        // Add the new row to the cinema hall
        Kinosaale[cinemaHallId - 1].reihen.push(newRow);
    }
}


dummySeatsGeneratorForCinemaHall(1);
dummySeatsGeneratorForCinemaHall(2);
const dummyScreenings = [
    {
        id: 1,
        film: 'The Matrix',
        playsInHallId: 1,
        played: false,
    },
    {
        id: 2,
        film: 'The Matrix Reloaded',
        playsInHallId: 2,
        played: true,
    },
    {
        id: 3,
        film: 'The Matrix Revolutions',
        playsInHallId: 2,
        played: false,
    }
];

//This gets film screenings.
async function fetchData() {
    // Fetch the list of all movie screenings when the page loads
    await updateScreenings();

    // When a specific screening is clicked, fetch its details and start checking seat availability
    document.addEventListener('click', async function(event) {
        if (event.target.matches('.screening')) {
            const id = event.target.dataset.id;
            await updateScreeningDetails(id);
            //hide all other screenings
            const screeningsElement = document.getElementById('screenings');
            screeningsElement.style.display = 'none';
            const kinosaalBuilder = document.querySelector('.Kinosaal-Builder-Button');
            kinosaalBuilder.style.display = 'none';
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
                //Edit the cinema hall
                const editCinemaHallButton = document.createElement('button');
                editCinemaHallButton.className = 'edit-cinema-hall-button';
                editCinemaHallButton.textContent = 'Edit cinema hall';
                editCinemaHallButton.addEventListener('click', function(event){
                    //Edit the cinema hall
                    editCinemaHall(id);
                })
                document.getElementById('screening-details').appendChild(editCinemaHallButton);
            }
            // Start checking seat availability for this screening
            await startSeatChecking(id); // Start checking seat availability for this screening
            // Show a booking button if the user is logged in
            if (me) {
                //If it does not exist yet, create it
                const finalizeButton = document.createElement('button');
                finalizeButton.className = 'finalize-button';
                finalizeButton.textContent = 'Finalize Reservation';
                document.getElementById('screening-details').appendChild(finalizeButton);
                finalizeButton.addEventListener('click', finalizeReservation)
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
                clearInterval(seatCheckInterval); // Clear the interval to stop seat checking
                stopSeatChecking();
                const seatsElement = document.getElementById('seats');
                seatsElement.style.display = 'none';
                this.style.display = 'none';
                //show the Kinosaal-Builder-Button
                if(isAdmin) {
                    document.querySelector('.Kinosaal-Builder-Button').style.display = 'block';
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
                }
            });
        }
    });

    // Handle seat selection and reservation
    document.addEventListener('click', async function(event) {
        if (event.target.matches('.seat')) {
            const id = event.target.dataset.id;
            const screeningId = document.querySelector('#screening-details').dataset.id;
            await attemptSeatReservation(id, event.target, screeningId);
        }
    });

    // Finalize the reservation
    document.querySelector('.finalize-button').addEventListener('click', finalizeReservation);
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
        const option = document.createElement('option');
        option.value = halls[i];
        option.textContent = `Hall ${halls[i]}`;
        inputplaysInHallId.appendChild(option);
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
async function editCinemaHall(screeningId){
    //Hide the screening-details
    document.getElementById('screening-details').style.display = 'none';
    //Screening innerhtml should be empty
    document.getElementById('screening-details').innerHTML = '';
    document.querySelector('.seatsElement').innerHTML = '';
    //Show the Kinosaal-Builder
    document.getElementById('Kinosaal-Builder').style.display = 'block';
    const screeningData = await screeningAPIFunctions.fetchAllScreenings().then(screenings => {
        return screenings.find(screening => screening.id == screeningId);
    })
    //Stop interval for seat checking
    clearInterval(seatCheckInterval);
    // const screeningData = dummyScreenings.find(screening => screening.id == screeningId);
    //Get the Kinosaal
    // const response2 = await fetch(`https://your-spring-boot-app.com/Kinosaale/${screeningData.playsInHallId}`);
    // const Kinosaal = await response2.json();
    //Find the Kinosaal with the id
    const hall = await hallAPIFunctions.getHallById(screeningData.playsInHallId);
    console.log(hall);
    //Populate the Kinosaal-Builder
    //Remove all innerHTML from the
    for(let i = 0; i < hall.seatRows.length; i++){
        await rowBuilder(hall.seatRows[i], hall.seatRows[i].seats.length, i);
    }
}

// Function to update screenings
async function updateScreenings() {
    try {
        //Get from localhost localhost:8080/screening
        const screenings = await screeningAPIFunctions.fetchAllScreenings()
        // const screenings = dummyScreenings;
        const screeningsElement = document.getElementById('screenings');
        //Filter out screenings that have already happened
        const upcomingScreenings = screenings.filter(screening => !screening.played);
        screeningsElement.innerHTML = ''; // Clear current listings
        // Iterate over screenings and create elements for each one
        upcomingScreenings.forEach(screening => {
            const screeningElement = document.createElement('div');
            screeningElement.className = 'screening';
            screeningElement.dataset.id = screening.id;
            screeningElement.textContent = `${screening.film} - Click to view details`;
            screeningsElement.appendChild(screeningElement);
        });
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

let seatCheckInterval; // Define a variable to store the interval ID

// Function to start checking seat availability
async function startSeatChecking(screeningId) {


    async function checkSeats() {
        try {
            const seatsElement = document.getElementById('seats');
            seatsElement.classList.add('loading');
            seatsElement.style.display = 'flex';
            seatsElement.style.flexWrap = 'wrap';
            const screening = await screeningAPIFunctions.getScreeningById(screeningId)
            const hall = await hallAPIFunctions.getHallById(screening.playsInHallId)
            const screeningReservations = await screeningAPIFunctions.getReservedSeats(screeningId)
            const screeningBookings = await screeningAPIFunctions.getBookedSeats(screeningId);
            const myReservations = await customerAPIFunctions.getReservationsForCustomer(me.id);
            let myReservationsForScreening = [];
            //Check if I have a reservation that has a seat equal to the one in screeningReservations
            for(let i = 0; i < screeningReservations.length; i++){
                //Check if I have a reservation for this seat
                if(myReservations.find(reservation => reservation.seatId == screeningReservations[i])){
                    myReservationsForScreening.push(screeningReservations[i]);
                }
            }
            const myBookings = await customerAPIFunctions.getAllBookingsForCustomer(me.id)
            let myBookingsForScreening = [];
            //Check if I have a booking that has a seat equal to the one in screeningBookings
            for(let i = 0; i < screeningBookings.length; i++){
                //Check if I have a booking for this seat
                if(myBookings.find(booking => booking == screeningBookings[i].seatId)){
                    myBookingsForScreening.push(screeningBookings[i].seatId);
                }
            }
            // Assuming a max number of seats per row for layout purposes
            //check every object in hall.seatRows and check which is the longest
            let maxSeatsPerRow = 0;
            hall.seatRows.forEach(row => {
                if(row.seats.length > maxSeatsPerRow){
                    maxSeatsPerRow = row.seats.length;
                }
            })
            //This should be calculated based on the number of seats in the screening and vw
            seatsElement.style.maxWidth = `${maxSeatsPerRow * 3}vw`;
            seatsElement.innerHTML = ''; // Clear current seat listings
            // Iterate over seats and create icons for each one
            // Update the function to mark the seat as reserved if it is already taken
            // For example:

            let rows = hall.seatRows;

            //Iterate over the rows
            rows.forEach(row => {
                //Create the row element
                const rowElement = document.createElement('div');
                rowElement.className = 'row';
                rowElement.dataset.id = row.id;
                // Style as row
                rowElement.style.display = 'flex';
                rowElement.style.flexWrap = 'no-wrap';
                //Iterate over the seats
                row.seats.forEach(seat => {

                    const seatIcon = document.createElement('i');
                    seatIcon.className = 'fas fa-chair'; // Font Awesome seat icon
                    seatIcon.dataset.id = seat.id;
                    //Check if it reserved by me. Do so by checking the movie the
                    //If it is already green, it is reserved by me. This is only temporary until the server is ready to handle reservations
                    let isReservedByMe = false;
                    if (myReservationsForScreening.find(reservation => reservation == seat.id)) {
                        isReservedByMe = true;
                    }
                    if (isReservedByMe) {
                        // alert('This seat is already reserved by you')
                        seatIcon.style.color = 'green';
                        seatIcon.classList.add('selected');
                    }
                    if (screeningBookings.find(booking => booking == seat.id)) {
                        // alert('This seat is already booked')
                        seatIcon.style.color = 'blue';
                        seatIcon.classList.add('booked');
                    }
                    if (screeningReservations.find(reservation => reservation == seat.id && !isReservedByMe)) {
                        // alert('This seat is already booked')
                        seatIcon.style.color = 'red';
                        seatIcon.classList.add('reserved');
                    }
                    if (myBookingsForScreening.find(booking => booking == seat.id)) {
                        // alert('This seat is already booked by you')
                        seatIcon.style.color = 'blue';
                        seatIcon.classList.add('booked');
                    }
                    const seatWidth = "2vw"
                    seatIcon.style.fontSize = seatWidth;
                    const margin = "0.2vw"
                    seatIcon.style.margin = margin;
                    seatIcon.title = `Seat ${seat.position}`;
                    // Determine the seat's position in the grid
                    // seatIcon.style.order = (seat.reihe - 1) * maxSeatsPerRow + seat.pos;
                    seatIcon.style.order = seat.position;
                    seatIcon.classList.add('seat');
                    rowElement.appendChild(seatIcon);
                    //If this is the first of the row, add padding left
                   if(seat.position == 1 && row.seats.length < maxSeatsPerRow){
                       //If even number of seats, add padding left for number of seats in the row less than maxSeatsPerRow to the first seat
                       const numberOfSeats = row.seats.length;
                       const emptySpaceWidth = (maxSeatsPerRow - numberOfSeats) * parseFloat(seatWidth) + parseFloat(margin) * (maxSeatsPerRow - numberOfSeats);
                       const marginLeft = emptySpaceWidth / 2; // Centering the seats by dividing the empty space by two.
                       seatIcon.style.marginLeft = `${marginLeft + 0.4}vw`; // Apply the calculated margin to the first seat.
                   }
                   //Add hover of position and category on seat
                     seatIcon.addEventListener('mouseover', function(event){
                        const seatElement = event.target;
                        const seatId = seatElement.dataset.id;
                        const seat = hall.seatRows.find(row => row.seats.find(seat => seat.id == seatId)).seats.find(seat => seat.id == seatId);
                        const category = seat.category;
                        seatElement.title = `Seat ${seat.position} - Category: ${category.name}`;
                     })
                })
                const category = document.createElement('p');
                category.textContent = `Category: ${row.category.name}`;
                rowElement.appendChild(category);
                seatsElement.appendChild(rowElement);

            });
            seatsElement.classList.remove('loading');
            seatsElement.classList.add('seatsElement');
            await updatePrice(screeningId);
        } catch (error) {
            console.error('Error fetching seats:', error);
        }
    }

    await checkSeats()
    // Clear any existing interval before starting a new one
    if (seatCheckInterval) {
        clearInterval(seatCheckInterval);
    }
    seatCheckInterval = setInterval(checkSeats, 10000);
}

// Function to stop checking seat availability
function stopSeatChecking() {
    if (seatCheckInterval) {
        clearInterval(seatCheckInterval);
        seatCheckInterval = null; // Reset the interval variable
    }
}

// Function to check the current status of a seat (for example, after the reservation timer expires)
async function checkSeatStatus(seatId, seatIcon) {
    try {
        // const response = await fetch(`https://your-spring-boot-app.com/seats/${seatId}`);
        // const seat = await response.json();

        const seat = dummySeats[seatId];
        seatIcon.style.color = seat.reservierungs_stat ? 'red' : 'gray';
    } catch (error) {
        console.error('Error checking seat status:', error);
    }
}
async function updatePrice(screeningId){
    const totalPriceToPayHtml = document.createElement('p');
    //If element does not exist yet, create it
    if(!document.querySelector('.total-price-to-pay')) {
        //Create new html element
        totalPriceToPayHtml.className = 'total-price-to-pay';
        totalPriceToPayHtml.textContent = 'Total price to pay: 0';
        document.getElementById('screening-details').appendChild(totalPriceToPayHtml);
    }
    const screening = await screeningAPIFunctions.getScreeningById(screeningId);
    //Get all reservations so far
    const reservations = await customerAPIFunctions.getReservationsForCustomer(me.id);
    //Filter out the reservations that are for the current screening
    const reservationsForScreening = reservations.filter(reservation => reservation.filmScreeningId == screeningId);
    //For each seat, check the price
    let totalPrice = 0;
    for(let i = 0; i < reservationsForScreening.length; i++){
        //Get the seat
        const seat = await hallAPIFunctions.getHallById(screening.playsInHallId).then(hall => {
            return hall.seatRows.find(row => row.seats.find(seat => seat.id == reservationsForScreening[i].seatId));
        })
        //Get the category of the seat
        const category = seat.category;
        //Get the price of the category
        const price = category.price;
        //Add the price to the total price
        totalPrice += price;
    }
    //Update the total price to pay
    document.querySelector('.total-price-to-pay').textContent = `Total price to pay: ${totalPrice}`;
    //Add the total price to pay to the screening details
}
async function getReservedSeatsForScreening(screeningId){
    const reservations = await customerAPIFunctions.getReservationsForCustomer(me.id);
    //Filter out the reservations that are for the current screening
    return reservations.filter(reservation => reservation.filmScreeningId == screeningId);
}
/// Function to attempt seat reservation
async function attemptSeatReservation(seatId, seatElement, screeningId) {
    // If is already booked by me, return and do nothing
    const isBookedByMe = seatElement.classList.contains('booked');
    if (isBookedByMe) {
        return;
    }
    const isReservedByMe = seatElement.classList.contains('selected');
    // If the seat is already selected by the current user, unreserve it
    if (seatElement.classList.contains('selected')) {
        //Get the reservation
        const reservation = await customerAPIFunctions.getReservationsForCustomer(me.id).then(reservations => {
            return reservations.find(reservation => reservation.seatId == seatId);
        });
        customerAPIFunctions.deleteReservationForCustomer(me.id, reservation.id).then(() => {
            seatElement.classList.remove('selected');
            seatElement.style.color = 'black';
            updatePrice(screeningId);
        });
    }
    // If the seat is reserved by someone else, do nothing
    if (seatElement.classList.contains('reserved')) {
        return;
    }
    if(!isReservedByMe){

    // Reserve the seat
    try {
        customerAPIFunctions.addReservationForCustomer(me.id, screeningId, seatId, ).then(() => {
            seatElement.classList.add('selected');
            seatElement.style.color = 'green';
        }).then(() => {
            updatePrice(screeningId);
        });

    } catch (error) {
        console.error('Error reserving seat:', error);
    }
    }
}



// Function to finalize the reservation
async function finalizeReservation() {
    //get all my reserved seats for this screening
    const reservations = await getReservedSeatsForScreening(document.querySelector('#screening-details').dataset.id);
    for(let reservationsIndex in reservations){
       customerAPIFunctions.addNewBookingToCustomer(me.id, reservations[reservationsIndex].seatId, reservations[reservationsIndex].filmScreeningId).then(() => {
           //Remove the selected class
           const hmtlReservations = document.querySelectorAll('.selected');
              for(let i = 0; i < hmtlReservations.length; i++){
                hmtlReservations[i].classList.remove('selected');
                //remove reserved class
                hmtlReservations[i].classList.remove('reserved');
                //add booked class
                hmtlReservations[i].classList.add('booked');
                hmtlReservations[i].style.color = 'blue';
            }

       });

    }
}

// User registration
document.querySelector('#registration-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Get user details from form
    // Send a POST request to the server for registration
});

// User login
document.querySelector('#login-form').addEventListener('submit', function(event) {
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
        //Show the Kinosaal-Builder-Button
        document.querySelector('.Kinosaal-Builder-Button').style.display = 'block';
        //Hide the login form
        document.querySelector('#login-form').style.display = 'none';
        //Show the logout button
        document.querySelector('#logout-button').style.display = 'block';
        //Show the screening builder button
        document.querySelector('.Screening-Builder-Button').style.display = 'block';
        //Click back button
        document.querySelector('.back-button').click();

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
    //Hide the Kinosaal-Builder-Button
    document.querySelector('.Kinosaal-Builder-Button').style.display = 'none';
    //refresh
    location.reload();
});
