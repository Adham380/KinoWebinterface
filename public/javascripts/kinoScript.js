
function rowBuilder(seats, i){
    const rowElement = document.createElement('div');
    rowElement.className = 'row';
    rowElement.dataset.id = i;
    rowElement.style.display = "flex";
    rowElementTextDiv = document.createElement('div');
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
    console.log(rowElement);
    //Create the seats
    for(let j = 0; j < seats; j++){
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
    addSeatToRowButton.addEventListener('click', function(event){
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
    });
    const removeSeatToRowButton = document.createElement('button');
    removeSeatToRowButton.className = 'removeSeatFromRow-button';
    removeSeatToRowButton.dataset.id = i;
    removeSeatToRowButton.textContent = `- 1`;
    removeSeatToRowButton.addEventListener('click', function(event){
        //Remove a seat from the row
        const rowElement = event.target.parentElement;
        //If child is the button itself, do not remove it
        if(rowElement.childElementCount == 1){
            //This row has no seats and should thus be removed. All othe rows should have their id updated
            // rowElement.remove();
            return;
        }
        //Get all children with the class builder_seat
        //Remove the last seat
        // seatsArray[seatsArray.length - 1].remove();
        //Remove seat with the highest id
        console.log(seats)
        rowElement.querySelector(`[title="Seat ${seats}"]`).remove();
        //Set the order of the buttons
        addSeatToRowButton.style.order = rowElement.childElementCount + 1;
        categorySelector.style.order = rowElement.childElementCount + 2;
        seats--;
    });
    rowElement.prepend(removeSeatToRowButton);
    //Create the category selector
    const categorySelector = document.createElement('select');
    categorySelector.className = 'row-category-selector';
    categorySelector.style.order = seats + 2;
    categorySelector.dataset.id = seats
    categorySelector.textContent = `Kategorie`;
    //Create the options
    const option1 = document.createElement('option');
    option1.value = 'Parkett';
    option1.textContent = 'Parkett';
    categorySelector.appendChild(option1);
    const option2 = document.createElement('option');
    option2.value = 'Loge';
    option2.textContent = 'Loge';
    categorySelector.appendChild(option2);
    const option3 = document.createElement('option');
    option3.value = 'Loge mit Service';
    option3.textContent = 'Loge mit Service';
    categorySelector.appendChild(option3);
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
            rowBuilder(seats, i);
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
const me = {
    id: 1,
    name: 'John Doe',
}
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
dummySeatsGenerator = (movieId) => {
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
      "sitze": [
        {
          "position": 0,
          "reserviert": true,
          "gebucht": true
        }
      ],
      "Kategorie": "Parkett"
    }
  ]
}
 */
const Kinosaale = [
    {
        id: 1,
        fertig_konfiguriert: true,
        reihen: [
            {
                id: 1,
                sitze: dummySeatsForMovieOne,
                Kategorie: 'Parkett'
            }
        ]
    },
    {
        id: 2,
        fertig_konfiguriert: true,
        reihen: [
            {
                id: 1,
                sitze: dummySeatsForMovieTwo,
                Kategorie: 'Parkett'
            }
        ]
    }
]
const dummySeats = dummySeatsGenerator(1);
const dummySeats2 = dummySeatsGenerator(2);

const dummyScreenings = [
    {
        id: 1,
        film: 'The Matrix',
        playsInKinoSaalId: 1,
        stattgefunden_stat: false,
    },
    {
        id: 2,
        film: 'The Matrix Reloaded',
        playsInKinoSaalId: 2,
        stattgefunden_stat: true,
    },
    {
        id: 3,
        film: 'The Matrix Revolutions',
        playsInKinoSaalId: 2,
        stattgefunden_stat: false,
    }
];

// Define an async function to use await
async function fetchData() {
    // Fetch the list of all movie screenings when the page loads
    await updateScreenings();

    // When a specific screening is clicked, fetch its details and start checking seat availability
    document.addEventListener('click', async function(event) {
        if (event.target.matches('.screening')) {
            console.log(event.target);
            console.log(event.target.dataset.id);
            const id = event.target.dataset.id;
            await updateScreeningDetails(id);
            //hide all other screenings
            const screeningsElement = document.getElementById('screenings');
            screeningsElement.style.display = 'none';
            const kinosaalBuilder = document.querySelector('.Kinosaal-Builder-Button');
            kinosaalBuilder.style.display = 'none';
            // Start checking seat availability for this screening
            startSeatChecking(id); // Start checking seat availability for this screening
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
                document.querySelector('.Kinosaal-Builder-Button').style.display = 'block';

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

// Periodically update screenings
function refreshScreenings() {
    fetch('https://your-spring-boot-app.com/screenings')
        .then(response => response.json())
        .then(screenings => {
            // Update the screenings display
        })
        .catch(error => console.error('Error fetching screenings:', error));
}
setInterval(refreshScreenings, 30000); // Refresh every 30 seconds

// Function to update screenings
async function updateScreenings() {
    try {
        // const response = await fetch('https://your-spring-boot-app.com/screenings');
        // const screenings = await response.json();
        const screenings = dummyScreenings;
        const screeningsElement = document.getElementById('screenings');
        //Filter out screenings that have already happened
        const upcomingScreenings = screenings.filter(screening => !screening.stattgefunden_stat);
        screeningsElement.innerHTML = ''; // Clear current listings
        // Iterate over screenings and create elements for each one
        console.log(upcomingScreenings);
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
        const screeningDetails = dummyScreenings.find(screening => screening.id == screeningId);
        const screeningDetailsElement = document.getElementById('screening-details');
        screeningDetailsElement.style.display = 'block';
        screeningDetailsElement.innerHTML = `<strong>${screeningDetails.film}</strong> - Screening Details`;
        screeningDetailsElement.dataset.id = screeningDetails.id;
        // Add more details as needed
    } catch (error) {
        console.error('Error fetching screening details:', error);
    }
}

let seatCheckInterval; // Define a variable to store the interval ID

// Function to start checking seat availability
function startSeatChecking(screeningId) {
    const seatsElement = document.getElementById('seats');
    seatsElement.style.display = 'flex';
    seatsElement.style.flexWrap = 'wrap';

    // Assuming a max number of seats per row for layout purposes
    const maxSeatsPerRow = 10;
    //This should be calculated based on the number of seats in the screening and vw
    seatsElement.style.maxWidth = `${maxSeatsPerRow * 50}px`;

    async function checkSeats() {
        try {
            console.log('checking seats');
            // const response = await fetch(`https://your-spring-boot-app.com/screenings/${screeningId}/seats`);
            // const seats = await response.json();
            const seats = dummySeats;
            seatsElement.innerHTML = ''; // Clear current seat listings
            // Iterate over seats and create icons for each one
            // Update the function to mark the seat as reserved if it is already taken
            // For example:
            seats.forEach(seat => {
                const seatIcon = document.createElement('i');
                seatIcon.className = 'fas fa-chair'; // Font Awesome seat icon
                seatIcon.dataset.id = seat.id;
                console.log(seat.id);
                //Check if it reserved by me. Do so by checking the movie the
                //If it is already green, it is reserved by me. This is only temporary until the server is ready to handle reservations
                let  isReservedByMe = false;
                //Find is the seat is reserved by me by checking if there is an object in the array with the seatId and the screeningId
                seatsReservedByMe.forEach(seatReservedByMe => {
                    // console.log(seat.id);
                    // console.log(seatReservedByMe.seatId);
                    // console.log(screeningId);
                    // console.log(seatReservedByMe.screeningId);
                    // console.log(seatReservedByMe.seatId == seat.id && seatReservedByMe.screeningId == screeningId);

                    if(seatReservedByMe.seatId == seat.id && seatReservedByMe.screeningId == screeningId){
                        isReservedByMe = true;
                        console.log('reserved by me');
                    }
                })


                if(isReservedByMe){
                    // alert('This seat is already reserved by you')
                    seatIcon.style.color = 'green';
                    seatIcon.classList.add('selected');
                    console.log('reserved by me');
                } else {
                    //For seat 1, check if it is reserved
                    if(seat.id == 1){
                        console.log('seat 1');
                        console.log(seat.reservierungs_stat);
                        console.log(seatsReservedByMe);
                    }
                    seatIcon.classList.add(seat.reservierungs_stat ? 'reserved' : 'available');
                    seat.reservierungs_stat && checkSeatStatus(seat.id, seatIcon);
                    seatIcon.style.color = seat.reservierungs_stat ? 'red' : 'gray'; // Reserved seats are red, available are gray
                }
                seatIcon.style.fontSize = '24px';
                seatIcon.style.margin = '5px';
                seatIcon.title = `Seat ${seat.pos}`;
                // Determine the seat's position in the grid
                seatIcon.style.order = (seat.reihe - 1) * maxSeatsPerRow + seat.pos;
                seatIcon.classList.add('seat');
                seatsElement.appendChild(seatIcon);
            });
        } catch (error) {
            console.error('Error fetching seats:', error);
        }
    }

    checkSeats()
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

/// Function to attempt seat reservation
async function attemptSeatReservation(seatId, seatElement, screeningId) {
    // If the seat is already selected by the current user, unreserve it
    if (seatElement.classList.contains('selected')) {
        await unreserveSeat(seatId, seatElement);
        seatElement.classList.remove('selected');
        seatElement.style.color = 'gray'; // Change color to gray to indicate available seat
        return;
    }
console.log(seatElement.classList);
    // If the seat is reserved by someone else, do nothing
    if (seatElement.classList.contains('reserved')) {
        return;
    }
console.log(seatElement.classList);
    // Reserve the seat
    try {
        // const response = await fetch(`https://your-spring-boot-app.com/reservations`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ seatId }),
        // });
        // const reservation = await response.json();

        // Dummy reservation with 30% failure chance. Replace with the above code when the server is ready to handle reservations
        const reservation = {
            success: Math.random() > 0.3
        };


        // If the reservation was successful, change the color of the seat
        if (reservation.success) {
            // seatElement.classList.add('selected');
            seatElement.style.color = 'green'; // Change color to green to indicate selected seat
            seatsReservedByMe.push({
                seatId: parseInt(seatId),
                screeningId: parseInt(screeningId)
            });
        } else {
            alert('This seat cannot be reserved.');
        }
    } catch (error) {
        console.error('Error reserving seat:', error);
    }
}

// Function to unreserve a seat
async function unreserveSeat(seatId, seatElement) {
    try {
        // Send a request to the server to unreserve the seat
        // await fetch(`https://your-spring-boot-app.com/reservations/${seatId}/unreserve`, {
        //     method: 'DELETE' // Assuming the server has a DELETE endpoint for unreserving
        // });

        // Dummy unreservation. Replace with the above code when the server is ready to handle unreservations
        dummySeats[seatId].reservierungs_stat = false;
        await checkSeatStatus(seatId, seatElement);


        // The seat will be unreserved on the server side
    } catch (error) {
        console.error('Error unreserving seat:', error);
    }
}


// Function to finalize the reservation
async function finalizeReservation() {
    // Finalize the reservation
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
    // Send a POST request to the server for login
});

// User logout
document.querySelector('#logout-button').addEventListener('click', function() {
    // Send a POST request to the server for logout
});
