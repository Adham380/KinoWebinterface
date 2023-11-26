//post customer
async function postCustomer(customerName) {
    try {
        const response = await fetch('http://localhost:8080/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerName }),
        });
        const newCustomer = await response.json();
        console.log(newCustomer);
        return newCustomer;
    } catch (error) {
        console.error('Error creating customer:', error);
    }
}
//get reservations
async function getReservationsForCustomer(customerId) {
    try {
        const response = await fetch(`http://localhost:8080/customer/${customerId}/reservations`);
        const reservations = await response.json();
        console.log(reservations);
        return reservations;
    } catch (error) {
        console.error('Error getting reservations:', error);
    }
}
//get bookings
async function getBookingsForCustomer(customerId) {
    try {
        const response = await fetch(`http://localhost:8080/customer/${customerId}/bookings`);
        const bookings = await response.json();
        console.log(bookings);
        return bookings;
    } catch (error) {
        console.error('Error getting bookings:', error);
    }
}
async function addReservationForCustomer(customerId, filmScreeningId, seatId) {
try {
        const response = await fetch(`http://localhost:8080/customer/${customerId}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filmScreeningId, seatId }),
        });
        const reservation = await response.json();
        console.log(reservation);
        return reservation;
    } catch (error) {
        console.error('Error adding reservation:', error);
    }
}
async function addBookingForCustomer(customerId, filmScreeningId, seatId) {
    try {
        console.log(customerId);
        console.log(filmScreeningId);
        console.log(seatId);
        const response = await fetch(`http://localhost:8080/customer/${customerId}/booking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filmScreeningId, seatId }),
        });
        const booking = await response.json();
        console.log(booking);
        return booking;
    } catch (error) {
        console.error('Error adding booking:', error);
    }
}
async function deleteReservationForCustomer(customerId, reservationId) {
    try {
        const response = await fetch(`http://localhost:8080/customer/${customerId}/reservations/${reservationId}`, {
            method: 'DELETE',
        });
        const result = await response.text();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error deleting reservation:', error);
    }
}
async function deleteBookingForCustomer(customerId, bookingId) {
    try {
        const response = await fetch(`http://localhost:8080/customer/${customerId}/bookings/${bookingId}`, {
            method: 'DELETE',
        });
        const result = await response.text();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error deleting booking:', error);
    }
}
async function transformReservationIntoBooking(reservationId) {
    try {
        const response = await fetch(`http://localhost:8080/customer/reservations/${reservationId}/toBuchung`, {
            method: 'POST'
        });
        const booking = await response.json();
        console.log(booking);
        return booking;
    } catch (error) {
        console.error('Error transforming reservation into booking:', error);
    }
}
module.exports = {
    postCustomer,
    getReservationsForCustomer,
    getBookingsForCustomer,
    addReservationForCustomer,
    addBookingForCustomer,
    deleteReservationForCustomer,
    deleteBookingForCustomer,
    transformReservationIntoBooking
}
