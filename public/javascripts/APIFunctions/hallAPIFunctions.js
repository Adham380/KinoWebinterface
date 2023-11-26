//-----------------REST Hall functions------------------
//Get hall
async function getHallById(hallId) {
    try {
        //get REST API from localhost:3000/screenings
        const response = await fetch('/hall/' + hallId);
        const hall = await response.json();
        return hall;
    } catch (error) {
        console.error('Error fetching hall:', error);
    }
}
// JavaScript function to create a new seating category
async function createSeatingCategory(name, price) {
    try {
        const response = await fetch('/seatingCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price }),
        });
        const newCategory = await response.json();
        return newCategory;
    } catch (error) {
        console.error('Error creating seating category:', error);
    }
}
//Delete seating category
async function deleteSeatingCategoryById(seatingCategoryId) {
    try {
        const response = await fetch(`/seatingCategory/${seatingCategoryId}`, {
            method: 'DELETE',
        });
        const result = await response.text();
        return result;
    } catch (error) {
        console.error(`Error deleting seating category with ID ${seatingCategoryId}:`, error);
    }

}

// JavaScript function to get all seating categories
async function fetchSeatingCategories() {
    try {
        const response = await fetch('/seatingCategories');
        const seatingCategories = await response.json();
        return seatingCategories;
    } catch (error) {
        console.error('Error fetching seating categories:', error);
    }
}

// JavaScript function to create a new hall
async function createHall(configured, seatRows) {
    try {
        const response = await fetch('/hall', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ configured, seatRows }),
        });
        const newHall = await response.json();
        return newHall;
    } catch (error) {
        console.error('Error creating hall:', error);
    }
}

// JavaScript function to get a hall by ID
async function fetchHallById(hallId) {
    try {
        const response = await fetch(`/hall/${hallId}`);
        const hall = await response.json();
        return hall;
    } catch (error) {
        console.error(`Error fetching hall with ID ${hallId}:`, error);
    }
}

// JavaScript function to delete a hall by ID
async function deleteHallById(hallId) {
    try {
        const response = await fetch(`/hall/${hallId}`, {
            method: 'DELETE',
        });
        const result = await response.text();
        return result;
    } catch (error) {
        console.error(`Error deleting hall with ID ${hallId}:`, error);
    }
}

// JavaScript function to finish a hall
async function finishHall(hallId) {
    try {
        const response = await fetch(`/hall/${hallId}/finish`);
        const result = await response.text();
        return result;
    } catch (error) {
        console.error(`Error finishing hall with ID ${hallId}:`, error);
    }
}

// JavaScript function to add rows to a hall
async function addRowsToHall(hallId, rows) {1
    try {
        const response = await fetch(`/hall/${hallId}/rows`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rows),
        });
        const updatedHall = await response.json();
        return updatedHall;
    } catch (error) {
        console.error(`Error adding rows to hall with ID ${hallId}:`, error);
    }
}

// JavaScript function to update a row in a hall
async function updateRowInHall(rowId, row) {
    try {
        console.log("This is the row: " + row);
        console.log("This is the rowId: " + rowId);
        console.log(rowId);
        const response = await fetch(`/hall/rows/${rowId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(row),
        });
        return await response;
    } catch (error) {
        console.error(`Error updating row with ID ${rowId}:`, error);
    }
}
async function deleteRow(hallId, rowId) {
    try {
        const response = await fetch(`/hall/${hallId}/rows/${rowId}`, {
            method: 'DELETE',
        });
        const result = await response
        return result;
    } catch (error) {
        console.error(`Error deleting row with ID ${rowId}:`, error);
    }
}
async function getAllHalls() {
    try {
        const response = await fetch('/halls');
        const halls = await response.json();
        return halls;
    } catch (error) {
        console.error('Error fetching halls:', error);
    }
}
export const hallAPIFunctions = {
    getHallById,
    createSeatingCategory,
    fetchSeatingCategories,
    createHall,
    fetchHallById,
    deleteHallById,
    finishHall,
    addRowsToHall,
    updateRowInHall,
    getAllHalls,
    deleteSeatingCategoryById,
    deleteRow
}