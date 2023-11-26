

/**
 *    fetchHall,
 *     createSeatingCategory,
 *     fetchSeatingCategories,
 *     createHall,
 *     fetchHallById,
 *     deleteHallById,
 *     finishHall,
 *     addRowsToHall,
 *     updateRowInHall,
 *     getAllHalls
 */
async function getAllHalls () {
    const response = await fetch('http://localhost:8080/halls');
    const data = await response.json();
    return data;
}

async function getHallById (hallId) {
    const response = await fetch('http://localhost:8080/hall/' + hallId);
    const data = await response.json();
    return data;
}

async function createHall (hall) {
    const response = await fetch('http://localhost:8080/hall', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hall),
    });
    const data = await response.json();
    return data;
}

async function deleteHallById (hallId) {
    const response = await fetch('http://localhost:8080/hall/' + hallId, {
        method: 'DELETE',
    });
    const data = await response.json();
    return data;
}

async function finishHall (hallId) {
    const response = await fetch('http://localhost:8080/hall/' + hallId + '/finish', {
        method: 'POST',
    });
    const data = await response.json();
    return data;
}

async function createSeatingCategory (name, price) {
    const response = await fetch('http://localhost:8080/seatingCategory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: name, price: price}),
    });
    const data = await response.json();
    console.log(data);
    return data;
}
async function deleteSeatingCategory (seatingCategoryId) {
    const response = await fetch('http://localhost:8080/seatingCategory/' + seatingCategoryId, {
        method: 'DELETE',
    });
    const data = await response.text();
    return data;

}

async function fetchSeatingCategories (hallId) {
    const response = await fetch('http://localhost:8080/seatingCategories');
    const data = await response.json();
    return data;
}

async function addRowsToHall (hallId, rows) {
    const response = await fetch('http://localhost:8080/hall/' + hallId + '/rows', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rows),
    });
    const data = await response.json();
    console.log(data);
    return data;
}

async function updateRowInHall (rowId, row) {
    const response = await fetch('http://localhost:8080/hall/rows/' + rowId, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(row),
    });
    const data = await response.text();
    return data;
}
async function deleteRowFromHall(hallId, rowId) {
    const response = await fetch('http://localhost:8080/hall/'+ hallId + '/rows/' + rowId, {
        method: 'DELETE',
    });
    const data = await response.text()
    console.log(data);
    return data;
}
//Export module as an object
module.exports = {
    finishHall,
    createSeatingCategory,
    fetchSeatingCategories,
    createHall,
    deleteHallById,
    addRowsToHall,
    updateRowInHall,
    getAllHalls,
    getHallById,
    deleteSeatingCategory,
    deleteRowFromHall
}