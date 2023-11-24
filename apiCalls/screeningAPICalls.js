async function getScreenings(){
    const response = await fetch('http://localhost:8080/screening');
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
    //It's a list of seatIds that are reserved
    const bookedSeats = [];
    data.forEach(seat => {
        bookedSeats.push(seat.seatId);
    })
    return bookedSeats;
}
async function getScreeningById(screeningId){
    const response = await fetch('http://localhost:8080/screening/' + screeningId);
    const data = await response.json();
    console.log(data);
    return data;
}
//get earnings
async function getEarnings(screeningId) {
    const response = await fetch('http://localhost:8080/screening/' + screeningId + '/earnings');
    const data = await response.json();
    console.log(data);
    return data;

}
async function postScreening(screening, screeningId) {
    console.log(JSON.stringify(screening));
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

//Export module as an object
module.exports = {
    getScreenings,
    getReservedSeats,
    getBookedSeats,
    getScreeningById,
    getEarnings,
    postScreening
}