async function getScreenings(){
    const response = await fetch('http://localhost:8080/screenings');
    const data = await response.json();
    console.log(data);
    return data;
}

/**
 * Get reserved seats for a screening
 * @param screeningId
 * @returns {Promise<any>}
 */
async function getReservedSeats(screeningId){
    const response = await fetch('http://localhost:8080/screening/' + screeningId + '/reservedSeats');
    const data = await response.json();
    return data;
}

async function getBookedSeats(screeningId){
    const response = await fetch('http://localhost:8080/screening/' + screeningId + '/bookedSeats');
    const data = await response.json();
    console.log(data);
    return data;
}
async function getScreeningById(screeningId){
    const response = await fetch('http://localhost:8080/screening/' + screeningId);
    const data = await response.json();
    console.log(data);
    return data;
}
//get earnings
async function getEarnings(screeningId) {
    console.log("Calculating earnings for screening with ID " + screeningId);
    const response = await fetch('http://localhost:8080/screening/' + screeningId + '/earnings');
    const data = await response.json();
    return data;

}
async function patchScreening(screening, screeningId) {
    console.log("THIS IS THE SCREENING: " + JSON.stringify(screening));
    const response = await fetch(`http://localhost:8080/screening/${screeningId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({film: screening.film, playsInHallId: screening.playsInHallId, played: screening.played}),
    });
    const data = await response.json();
    console.log(data);
    return data;
}
async function postScreening(screening) {
    console.log(JSON.stringify(screening));
    const response = await fetch('http://localhost:8080/screening', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({film: screening.film, playsInHallId: screening.playsInHallId, played: screening.played}),
    });
    const data = await response.json();
    console.log(data);
    return data;
}
async function deleteScreening(screeningId) {
    console.log("Deleting screening with ID " + screeningId);
    const response = await fetch('http://localhost:8080/screening/' + screeningId, {
        method: 'DELETE',
    });
    const data = await response.json();
    return data;

}

module.exports = {
    getScreenings,
    getReservedSeats,
    getBookedSeats,
    getScreeningById,
    getEarnings,
    patchScreening,
    postScreening,
    deleteScreening
}