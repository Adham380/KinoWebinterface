// JavaScript function to create a new customer
export async function createCustomer(name) {
    try {
        const response = await fetch('/customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        const customer = await response.json();
        return customer;
    } catch (error) {
        console.error('Error creating customer:', error);
    }
}

// JavaScript function to add a reservation for a customer
export async function addReservationForCustomer(customerId, filmScreeningId, seatId) {
    try {
        const response = await fetch(`/customer/${customerId}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filmScreeningId, seatId }),
        });
        const reservation = await response.json();
        return reservation;
    } catch (error) {
        console.error('Error adding reservation:', error);
    }
}

// JavaScript function to get all reservations for a customer
export async function getReservationsForCustomer(customerId) {
    try {
        const response = await fetch(`/customer/${customerId}/reservations`);
        const reservations = await response.json();
        return reservations;
    } catch (error) {
        console.error('Error getting reservations:', error);
    }
}

// JavaScript function to delete a reservation for a customer
export async function deleteReservationForCustomer(customerId, reservationId) {
    try {
        const response = await fetch(`/customer/${customerId}/reservations/${reservationId}`, {
            method: 'DELETE',
        });
        const result = await response.text();
        return result;
    } catch (error) {
        console.error('Error deleting reservation:', error);
    }
}

// JavaScript function to transform a reservation into a booking
export async function transformReservationIntoBooking(reservationId) {
    try {
        const response = await fetch(`/customer/reservations/${reservationId}/toBuchung`, {
            method: 'POST'
        });
        const booking = await response.json();
        return booking;
    } catch (error) {
        console.error('Error transforming reservation into booking:', error);
    }
}

// JavaScript function to get all bookings for a customer
export async function getAllBookingsForCustomer(customerId) {
    try {
        const response = await fetch(`/customer/${customerId}/bookings`);
        const bookings = await response.json();
        return bookings
    } catch (error) {
        console.error('Error getting all bookings:', error);
    }
}

// JavaScript function to add a new booking to a customer
export async function addNewBookingToCustomer(customerId, seatId, filmScreeningId) {
    try {
        const response = await fetch(`/customer/${customerId}/booking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seatId, filmScreeningId }),
        });
        const booking = await response.json();
        return booking;
    } catch (error) {
        console.error('Error adding new booking:', error);
    }
}

// JavaScript function to delete a booking for a customer
export async function deleteBookingForCustomer(customerId, bookingId) {
    try {
        const response = await fetch(`/customer/${customerId}/booking/${bookingId}`, {
            method: 'DELETE',
        });
        const result = await response.text();
        return result;
    } catch (error) {
        console.error('Error deleting booking:', error);
    }
}

export const customerAPIFunctions = {
    createCustomer,
    addReservationForCustomer,
    getReservationsForCustomer,
    deleteReservationForCustomer,
    transformReservationIntoBooking,
    getAllBookingsForCustomer,
    addNewBookingToCustomer,
    deleteBookingForCustomer,
}