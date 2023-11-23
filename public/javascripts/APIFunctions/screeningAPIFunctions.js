// JavaScript function to fetch all screenings
async function fetchAllScreenings() {
    try {
        const response = await fetch('/screening');
        const screenings = await response.json();
        console.log(screenings);
        return screenings;
    } catch (error) {
        console.error('Error fetching screenings:', error);
    }
}

// JavaScript function to add a new screening
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
        console.log(newScreening);
        return newScreening;
    } catch (error) {
        console.error('Error adding new screening:', error);
    }
}

// JavaScript function to update a screening
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

// JavaScript function to calculate earnings from a screening
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

export const screeningAPIFunctions = {
    fetchAllScreenings,
    addNewScreening,
    updateScreening,
    calculateEarningsFromScreening,
}