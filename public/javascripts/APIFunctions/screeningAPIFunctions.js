async function getScreeningById(screeningId) {
    try {
        const response = await fetch(`/screening/${screeningId}`);
        const screening = await response.json();
        return screening;
    } catch (error) {
        console.error(`Error fetching screening with ID ${screeningId}:`, error);
    }

}

async function fetchAllScreenings() {
    try {
        const response = await fetch('/screenings');
        const screenings = await response.json();
        return screenings;
    } catch (error) {
        console.error('Error fetching screenings:', error);
    }
}

async function addNewScreening(playsInHallId, film, played) {
    try {
        const response = await fetch('/screening', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playsInHallId, film, played }),
        });
        const newScreening = await response.json();
        return newScreening;
    } catch (error) {
        console.error('Error adding new screening:', error);
    }
}

async function updateScreening(screeningId, film, playsInHallId, played) {
    try {
        const response = await fetch(`/screening/${screeningId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ film, playsInHallId, played }),
        });
        const updatedScreening = await response.json();
        return updatedScreening;
    } catch (error) {
        console.error(`Error updating screening with ID ${screeningId}:`, error);
    }
}

async function calculateEarningsFromScreening(screeningId) {
    try {
        const response = await fetch(`/screening/${screeningId}/earnings`);
        const earnings = await response.json();
        return earnings.value;
    } catch (error) {
        console.error(`Error calculating earnings for screening with ID ${screeningId}:`, error);
    }
}
async function getReservedSeats(screeningId){
    const response = await fetch('/screening/' + screeningId + '/reservedSeats');
    const data = await response.json();
    return data;
}
async function getBookedSeats(screeningId){
    const response = await fetch('/screening/' + screeningId + '/bookedSeats');
    const data = await response.json();
    return data;
}
async function deleteScreening(screeningId) {
    try {
        const response = await fetch(`/screening/${screeningId}`, {
            method: 'DELETE',
        });
        const deletedScreening = await response.json();
        return deletedScreening;
    } catch (error) {
        console.error(`Error deleting screening with ID ${screeningId}:`, error);
    }
}

export const screeningAPIFunctions = {
    getScreeningById,
    fetchAllScreenings,
    addNewScreening,
    updateScreening,
    calculateEarningsFromScreening,
    getReservedSeats,
    getBookedSeats,
    deleteScreening
}