// Function to start checking seat availability
import {customerAPIFunctions} from "./APIFunctions/customerAPIFunctions.js";
import {screeningAPIFunctions} from "./APIFunctions/screeningAPIFunctions.js";
import {hallAPIFunctions} from "./APIFunctions/hallAPIFunctions.js";
import {userAuth} from "./userAuth.js";
let seatCheckInterval;
let me = await userAuth.getUser();
let selectedSeatsForFilmScreening = new Map();
function addSeatToSelectedSeats(seatId, screeningId){
    //key should be screeningId and seatId combined.  Value should be the seatId
    const key = screeningId + seatId;
    selectedSeatsForFilmScreening.set(key, seatId);
}
function removeSeatFromSelectedSeats(seatId, screeningId){
    const key = screeningId.toString() + seatId.toString()
    console.log(key);
    selectedSeatsForFilmScreening.delete(key);
    console.log(selectedSeatsForFilmScreening);

}
console.log(me);
async function startSeatChecking(screeningId) {


    async function checkSeats() {
        try {
            //All selected seats in map
            const selectedSeatsString = JSON.stringify(Array.from(selectedSeatsForFilmScreening.values()));
            const seatsElement = document.getElementById('seats');
            seatsElement.classList.add('loading');
            seatsElement.style.display = 'flex';
            seatsElement.style.flexWrap = 'wrap';
            const screening = await screeningAPIFunctions.getScreeningById(screeningId)
            const hall = await hallAPIFunctions.getHallById(screening.playsInHallId)
            const screeningReservations = await screeningAPIFunctions.getReservedSeats(screeningId)
            const screeningBookings = await screeningAPIFunctions.getBookedSeats(screeningId);
            const myReservations = await customerAPIFunctions.getReservationsForCustomer(me.id);
            const myBookings = await customerAPIFunctions.getAllBookingsForCustomer(me.id)
            let myReservationsForScreening = [];
            //Check if I have a reservation that has a seat equal to the one in screeningReservations
            for(let i = 0; i < screeningReservations.length; i++){
                //Check if I have a reservation for this seat
                if(myReservations.find(reservation => reservation.seatId == screeningReservations[i])){
                    myReservationsForScreening.push(screeningReservations[i]);
                }
            }
            let myBookingsForScreening = [];
            //Check if I have a booking that has a seat equal to the one in screeningBookings
            for(let i = 0; i < screeningBookings.length; i++){
                //Check if I have a booking for this seat
                if(myBookings.find(booking => booking.seatId == screeningBookings[i])){
                    myBookingsForScreening.push(screeningBookings[i]);
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
            console.log(myReservationsForScreening);
            console.log(myBookingsForScreening);
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
                    if (myBookingsForScreening.find(booking => booking == seat.id)) {
                        // alert('This seat is already booked by you')
                        seatIcon.style.color = 'blue';
                        seatIcon.classList.add('booked');
                    } else
                    if (isReservedByMe) {
                        console.log('This seat is already reserved by you')
                        // alert('This seat is already reserved by you')
                        seatIcon.classList.add('reservedByMe');
                    } else
                    if (screeningBookings.find(booking => booking == seat.id)) {
                        // alert('This seat is already booked')
                        seatIcon.style.color = 'red';
                        seatIcon.classList.add('booked');
                    } else
                    if (screeningReservations.find(reservation => reservation == seat.id && !isReservedByMe)) {
                        // alert('This seat is already booked')
                        seatIcon.style.color = 'red';
                        seatIcon.classList.add('reserved');
                    } else

                    if(selectedSeatsForFilmScreening.has(screeningId + seat.id)){
                        console.log('This seat is already selected by you')
                        console.log(screeningId + seat.id);
                        seatIcon.classList.add('selected');
                    //     Remove the other classes if they exist
                        seatIcon.classList.remove('booked');
                        seatIcon.classList.remove('reserved');
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
                        const seatRow = hall.seatRows.find(row => row.seats.find(seat => seat.id == seatId));
                        const category = seatRow.category;
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
                seatElement.classList.add('reservedByMe');
            }).then(() => {
                updatePrice(screeningId);
            });

        } catch (error) {
            console.error('Error reserving seat:', error);
        }
    }
}
async function getReservedSeatsForScreening(screeningId){
    const reservations = await customerAPIFunctions.getReservationsForCustomer(me.id);
    //Filter out the reservations that are for the current screening
    return reservations.filter(reservation => reservation.filmScreeningId == screeningId);
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
/// Function to attempt seat reservation



// Function to finalize the reservation
async function finalizeReservation() {
    //get all my reserved seats for this screening
    const reservations = await getReservedSeatsForScreening(document.querySelector('#screening-details').dataset.id);
    for(let reservationsIndex in reservations){
        customerAPIFunctions.addNewBookingToCustomer(me.id, reservations[reservationsIndex].seatId, reservations[reservationsIndex].filmScreeningId).then(() => {
            //Remove the selected class
            const hmtlReservations = document.querySelectorAll('.reservedByMe');
            for(let i = 0; i < hmtlReservations.length; i++){
                hmtlReservations[i].classList.remove('selected');
                //remove reserved class
                hmtlReservations[i].classList.remove('reservedByMe');
                //add booked class
                hmtlReservations[i].classList.add('booked');
                hmtlReservations[i].style.color = 'blue';
            }

        });

    }
}
export const seatManagement = {
    startSeatChecking,
    stopSeatChecking,
    attemptSeatReservation,
    getReservedSeatsForScreening,
    finalizeReservation,
    addSeatToSelectedSeats,
    removeSeatFromSelectedSeats,

}