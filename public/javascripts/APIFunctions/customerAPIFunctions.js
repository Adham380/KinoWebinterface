export async function createCustomer(name) {
    try {
        const response = await fetch('/customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        console.log(response);
        const customer = await response.json();
        console.log(customer);
        return customer;
    } catch (error) {
        console.error('Error creating customer:', error);
    }
}
export async function getCustomerById(customerId) {
    try {
        const response = await fetch(`/customer/${customerId}`);
        const customer = await response.json();
        return customer;
    } catch (error) {
        console.error(`Error fetching customer with ID ${customerId}:`, error);
    }

}
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

export async function getReservationsForCustomer(customerId) {
    try {
        const response = await fetch(`/customer/${customerId}/reservations`);
        const reservations = await response.json();
        return reservations;
    } catch (error) {
        console.error('Error getting reservations:', error);
    }
}

export async function deleteReservationForCustomer(customerId, reservationId) {
    try {
        customerId = parseInt(customerId);
        reservationId = parseInt(reservationId);
        const response = await fetch(`/customer/${customerId}/reservations/${reservationId}`, {
            method: 'DELETE',
        });
        const result = await response.text();
        return result;
    } catch (error) {
        console.error('Error deleting reservation:', error);
    }
}


export async function getAllBookingsForCustomer(customerId) {
    try {
        const response = await fetch(`/customer/${customerId}/bookings`);
        const bookings = await response.json();
        return bookings
    } catch (error) {
        console.error('Error getting all bookings:', error);
    }
}

export async function addNewBookingToCustomer(customerId, seatId, filmScreeningId) {
    try {
        customerId = parseInt(customerId)
        seatId = parseInt(seatId)
        filmScreeningId = parseInt(filmScreeningId)
        console.log(customerId, seatId, filmScreeningId)
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
    getCustomerById,
    addReservationForCustomer,
    getReservationsForCustomer,
    deleteReservationForCustomer,
    getAllBookingsForCustomer,
    addNewBookingToCustomer,
    deleteBookingForCustomer,
}