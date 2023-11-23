async function getScreenings(){
    const response = await fetch('http://localhost:8080/screening');
    const data = await response.json();
    console.log(data);
    return data;
}
//Export module as an object
module.exports = {
    getScreenings
}