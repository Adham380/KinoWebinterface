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
        const response = await fetch('/screenings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playsInHallId, film, played }),
        });
        const newScreening = await response.json();
        console.log(newScreening);
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
        console.log(updatedScreening);
        return updatedScreening;
    } catch (error) {
        console.error(`Error updating screening with ID ${screeningId}:`, error);
    }
}

async function calculateEarningsFromScreening(screeningId) {
    try {
        const response = await fetch(`/screening/${screeningId}/earnings`);
        const earnings = await response.json();
        console.log(earnings);
        return earnings;
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

export const screeningAPIFunctions = {
    getScreeningById,
    fetchAllScreenings,
    addNewScreening,
    updateScreening,
    calculateEarningsFromScreening,
    getReservedSeats,
    getBookedSeats
}