import {screeningAPIFunctions} from './APIFunctions/screeningAPIFunctions.js';
import {hallAPIFunctions} from "./APIFunctions/hallAPIFunctions.js";
import {customerAPIFunctions} from "./APIFunctions/customerAPIFunctions.js";
import {seatManagement} from "./seatManagement.js";
import {userAuth} from "./userAuth.js";
import {moviePosters} from "./moviePosters.js";

let isAdmin = false;
await userAuth.initalizeCustomerHtml()
const initialUser = await userAuth.getUser();
if(initialUser != null || initialUser !== undefined){
     document.querySelector('#logout-button').style.display = 'block';

}
let updateScreeningCurrentlyRunning = false;

async function rowBuilder(seatRow, seats, i) {
    const rowElement = document.createElement('div');
    rowElement.className = 'row';
    rowElement.dataset.id = seatRow.id;
    rowElement.style.display = "flex";
    let rowElementTextDiv = document.createElement('div');
    rowElementTextDiv.className = 'row-text';
    rowElementTextDiv.textContent = `Reihe ${i + 1}`;
    rowElement.appendChild(rowElementTextDiv);
    for (let j = 0; j < seats; j++) {
        const seatElement = document.createElement('i');
        seatElement.className = 'fas fa-chair'; // Font Awesome seat icon
        seatElement.dataset.id = j;
        seatElement.title = `Seat ${j + 1}`;
        seatElement.style.order = j + 1;
        seatElement.classList.add('builder_seat');
        rowElement.appendChild(seatElement);
    }
    let seatsArray = rowElement.querySelectorAll('.builder_seat');

    const addSeatToRowButton = document.createElement('button');
    addSeatToRowButton.style.order = seats + 1;
    addSeatToRowButton.className = 'addSeatToRow-button';
    addSeatToRowButton.dataset.id = i;
    addSeatToRowButton.textContent = `+ 1`;
    rowElement.appendChild(addSeatToRowButton);
    addSeatToRowButton.addEventListener('click', function (event) {
        hallAPIFunctions.updateRowInHall(seatRow.id, {
            categoryId: seatRow.category.id,
            numberOfSeats: seats + 1,
        }).then((response) => {
            //If successful, update the seats
            if (response.status == 200) {

                const rowElement = event.target.parentElement;
                const seatElement = document.createElement('i');
                seatElement.className = 'fas fa-chair';
                seatElement.dataset.id = seats + 1;
                seatElement.title = `Seat ${seats + 1}`;
                seatElement.style.order = seats + 1;
                seatElement.classList.add('builder_seat');
                rowElement.insertBefore(seatElement, rowElement.lastChild);
                addSeatToRowButton.style.order = rowElement.childElementCount + 1;
                categorySelector.style.order = rowElement.childElementCount + 2;
                seats++;

            }
        });
    });
    const removeSeatFromRowButton = document.createElement('button');
    removeSeatFromRowButton.className = 'removeSeatFromRow-button';
    removeSeatFromRowButton.dataset.id = i;
    removeSeatFromRowButton.textContent = `- 1`;
    removeSeatFromRowButton.addEventListener('click', function (event) {
        const rowElement = event.target.parentElement;
        const seatElement = rowElement.querySelectorAll('.builder_seat')
        if (rowElement.childElementCount == 3) {
            return;
        }
        hallAPIFunctions.updateRowInHall(seatRow.id, {
            categoryId: seatRow.category.id,
            numberOfSeats: seats - 1,
        }).then((response) => {
            if (response.status == 200) {
                seatElement[seatElement.length - 1].remove();
                addSeatToRowButton.style.order = rowElement.childElementCount + 1;
                categorySelector.style.order = rowElement.childElementCount + 2;
                seats--;
            }
        });
    });
    rowElement.prepend(removeSeatFromRowButton);
    const categorySelector = document.createElement('select');
    categorySelector.className = 'row-category-selector';
    categorySelector.style.order = seats + 2;
    categorySelector.dataset.id = seats
    categorySelector.textContent = `category`;
    const categories = await hallAPIFunctions.fetchSeatingCategories();
    console.log(categories);
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement('option');
        option.value = categories[i].id;
        option.textContent = categories[i].name;
        categorySelector.appendChild(option);
    }
    const newCategoryOption = document.createElement('option');
    newCategoryOption.value = 'new';
    newCategoryOption.textContent = 'New category';
    categorySelector.appendChild(newCategoryOption);
    categorySelector.addEventListener('change', function (event) {
        if (event.target.value == 'new') {
            const form = document.createElement('form');
            form.className = 'category-form';
            const inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.name = 'name';
            inputName.placeholder = 'Name';
            form.appendChild(inputName);
            const inputPrice = document.createElement('input');
            inputPrice.type = 'text';
            inputPrice.name = 'price';
            inputPrice.placeholder = 'Price';
            form.appendChild(inputPrice);
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            form.appendChild(submitButton);
            categorySelector.parentElement.appendChild(form);
            form.addEventListener('submit', async function (event) {
                event.preventDefault();
                const form = document.querySelector('.category-form');
                const name = form.children[0].value;
                const price = document.getElementsByName('price')[0].value;
                const category = await hallAPIFunctions.createSeatingCategory(name, price)
                const categorySelectors = document.querySelectorAll('.row-category-selector');
                for (let i = 0; i < categorySelectors.length; i++) {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelectors[i].insertBefore(option, categorySelectors[i].children[categorySelectors[i].children.length - 2]);
                }
                form.remove();
            })
        }
        else {
            hallAPIFunctions.updateRowInHall(seatRow.id, {
                categoryId: event.target.value,
                numberOfSeats: seats,
            }).then((response) => {
                if (response.status == 200) {
                    seatRow.category.id = event.target.value;
                }
            });
        }
    })
    const removeCategoriesOption = document.createElement('option');
    removeCategoriesOption.value = 'remove';
    removeCategoriesOption.textContent = 'Remove category';
    categorySelector.appendChild(removeCategoriesOption);
    categorySelector.addEventListener('change', function (event) {
        if (event.target.value == 'remove') {
            const form = document.createElement('form');
            form.className = 'category-form';
            const inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.name = 'name';
            inputName.placeholder = 'Name';
            form.appendChild(inputName);
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            form.appendChild(submitButton);
            categorySelector.parentElement.appendChild(form);
            form.addEventListener('submit', async function (event) {
                event.preventDefault();
                const name = document.getElementsByName('name')[0].value;
                const categories = await hallAPIFunctions.fetchSeatingCategories();
                let category;
                for (let i = 0; i < categories.length; i++) {
                    if (categories[i].name == name) {
                        category = categories[i];
                        break;
                    }
                }
                const response = await hallAPIFunctions.deleteSeatingCategoryById(category.id)
                const responseText = await response
                console.log(responseText);
                if(responseText.toLowerCase().includes('error')){
                    alert('Error deleting category. Please make sure that there are no seatRows currently using this category.')
                return
                }
                const categorySelectors = document.querySelectorAll('.row-category-selector');
                for (let i = 0; i < categorySelectors.length; i++) {
                    const option = categorySelectors[i].querySelector(`[value="${category.id}"]`);
                    option.remove();
                }
                form.remove();
                categorySelector.value = category.id;
            })
        }
    })
    rowElement.appendChild(categorySelector);
    const kinosaalBuilder = document.getElementById('Kinosaal-Builder');
    const rowControls = kinosaalBuilder.querySelector('.row-controls');

    if (rowControls) {
        kinosaalBuilder.insertBefore(rowElement, rowControls);
    } else {
        kinosaalBuilder.appendChild(rowElement);
    }
}

document.addEventListener('click', async function(event) {
    if(event.target.matches('.Screening-Builder-Button') && isAdmin){
        document.getElementById('Screening-Builder').innerHTML = '';
        const screeningsElement = document.getElementById('screenings');
        screeningsElement.style.display = 'none';
        const screeningDetailsElement = document.getElementById('screening-details');
        screeningDetailsElement.style.display = 'none';
        document.querySelector('.halls').style.display = 'none';
        event.target.style.display = 'none';
        document.querySelector('.back-button').style.display = 'block';
        document.querySelector('.back-button').addEventListener('click', function () {
            document.getElementById('Screening-Builder').style.display = 'none';
            screeningsElement.style.display = 'block';
            this.style.display = 'none';
            document.querySelector('.Screening-Builder-Button').style.display = 'block';
            document.querySelector('.halls').style.display = 'block';
        });
        await createScreeningForm();
    }
})
document.addEventListener('click', async function(event) {
if(event.target.matches('#hallsEdit') && isAdmin){
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
    });
}
})
async function fetchData() {
    await updateScreenings();

    document.addEventListener('click', async function(event) {
        if (event.target.matches('.screening')) {
            const id = event.target.dataset.id;
            await updateScreeningDetails(id);
            if(event.target.classList.contains('largeScreening')){
                event.target.classList.remove('largeScreening');
                event.target.style.animationName = 'scaleDown'
                event.target.style.animationDuration = '1s'
                event.target.style.animationFillMode = 'forwards'
            } else {
                event.target.style.animationName = ''
                event.target.style.animationDuration = ''
                event.target.style.animationFillMode = ''

                event.target.classList.add('largeScreening');

            }
            const screenings = document.querySelectorAll('.screening');
            screenings.forEach(screening => {
                if (screening.dataset.id != id) {
                    if(screening.classList.contains('largeScreening')){
                        screening.classList.remove('largeScreening');
                        screening.style.animationName = 'scaleDown'
                        screening.style.animationDuration = '1s'
                        screening.style.animationFillMode = 'forwards'

                    }
                }
            });
            const screeningsElement = document.getElementById('screenings');
            document.querySelector('.Screening-Builder-Button').style.display = 'none';

            if(isAdmin){
                const editScreeningButton = document.createElement('button');
                editScreeningButton.className = 'edit-screening-button';
                editScreeningButton.textContent = 'Edit screening';
                editScreeningButton.addEventListener('click', function(event){
                    editScreening(id);
                })
                document.getElementById('screening-details').appendChild(editScreeningButton);
                const screening = await screeningAPIFunctions.getScreeningById(id);
                const hall = await hallAPIFunctions.getHallById(screening.playsInHallId);
                if(!hall.configured) {
                    const editCinemaHallButton = document.createElement('button');
                    editCinemaHallButton.className = 'edit-cinema-hall-button';
                    editCinemaHallButton.textContent = 'Edit cinema hall';
                    editCinemaHallButton.addEventListener('click', function (event) {
                        editCinemaHall(hall.id);
                    })
                    document.getElementById('screening-details').appendChild(editCinemaHallButton);
                }
                const deleteScreeningButton = document.createElement('button');
                deleteScreeningButton.className = 'delete-screening-button';
                deleteScreeningButton.textContent = 'Delete screening';
                deleteScreeningButton.addEventListener('click', async function(event){
                    await screeningAPIFunctions.deleteScreening(id);
                    document.querySelector('.back-button').click();
                    document.querySelector('.Screening-Builder-Form').remove();
                    await updateScreenings();
                })
                document.getElementById('screening-details').appendChild(deleteScreeningButton);
                const ScreeningBuilderForm = document.querySelector('.Screening-Builder-Form');
                if(ScreeningBuilderForm){
                    ScreeningBuilderForm.remove();
                }
            }
            await seatManagement.startSeatChecking(id); // Start checking seat availability for this screening
            if (await userAuth.getUser()) {
                const finalizeButton = document.createElement('button');
                finalizeButton.className = 'finalize-button';
                finalizeButton.textContent = 'Book reserved seats';
                document.getElementById('screening-details').appendChild(finalizeButton);
                finalizeButton.addEventListener('click', seatManagement.finalizeReservation)
                const bookSelectedSeatsButton = document.createElement('button');
                bookSelectedSeatsButton.className = 'book-selected-seats-button';
                bookSelectedSeatsButton.textContent = 'Book selected seats';
                document.getElementById('screening-details').appendChild(bookSelectedSeatsButton);
                bookSelectedSeatsButton.addEventListener('click',(event) => {
                    let selectedSeats = document.querySelectorAll('.selected');
                    selectedSeats.forEach((seat) => {
                        if(!seat.classList.contains('reserved') && !seat.classList.contains('booked')){
                            seat.classList.remove('selected');
                        }
                    })
                    const screeningId = document.querySelector('#screening-details').dataset.id;
                    selectedSeats.forEach(async seat => {
                        const userId = await userAuth.getUser();
                        const response = await customerAPIFunctions.addNewBookingToCustomer(userId.id, seat.dataset.id, screeningId);
                        if(response != null){
                            seatManagement.removeSeatFromSelectedSeats(parseInt(seat.dataset.id), parseInt(screeningId));
                            seat.classList.remove('selected');
                            seat.classList.add('booked');
                            seat.style.color = 'blue';
                        }
                    })
                });
                const reserveSelectedSeatsButton = document.createElement('button');
                reserveSelectedSeatsButton.className = 'reserve-selected-seats-button';
                reserveSelectedSeatsButton.textContent = 'Reserve selected seats';
                document.getElementById('screening-details').appendChild(reserveSelectedSeatsButton);
                reserveSelectedSeatsButton.addEventListener('click',(event) => {
                    let selectedSeats = document.querySelectorAll('.selected');
                    selectedSeats.forEach((seat) => {
                        if(!seat.classList.contains('reserved') || !seat.classList.contains('booked')){
                            seat.classList.remove('selected');
                        }
                    })
                    const screeningId = document.querySelector('#screening-details').dataset.id;
                    selectedSeats.forEach(async seat => {
                      await seatManagement.attemptSeatReservation(seat.dataset.id, seat, screeningId);
                            seatManagement.removeSeatFromSelectedSeats(seat.dataset.id, screeningId);
                            seat.classList.remove('selected');
                    })
                });
                const unReserveReservedSeatsButton = document.createElement('button');
                unReserveReservedSeatsButton.className = 'unreserve-reserved-seats-button';
                unReserveReservedSeatsButton.textContent = 'Unreserve reserved seats';
                document.getElementById('screening-details').appendChild(unReserveReservedSeatsButton);
                unReserveReservedSeatsButton.addEventListener('click',async (event) => {
                    let reservedSeats = document.querySelectorAll('.reservedByMe');
                    reservedSeats.forEach((seat) => {
                        if (!seat.classList.contains('reserved') || !seat.classList.contains('booked')) {
                            seat.classList.remove('selected');
                        }
                    })
                    const userId = await userAuth.getUser();

                    const reservations = await customerAPIFunctions.getReservationsForCustomer(userId.id);
                    const screeningId = document.querySelector('#screening-details').dataset.id;
                    for (const seat of reservedSeats) {

                        const reservationId = reservations.find(reservation => reservation.seatId == seat.dataset.id).id;
                        await customerAPIFunctions.deleteReservationForCustomer(userId.id, reservationId);
                        seatManagement.removeSeatFromSelectedSeats(seat.dataset.id, screeningId);
                        seat.classList.remove('selected');
                        seat.classList.remove('reservedByMe');
                    }
                });
            }
            document.querySelector('.back-button').style.display = 'block';
            document.querySelector('.back-button').addEventListener('click', function() {
                const screeningDetailsElement = document.getElementById('screening-details');
                screeningDetailsElement.style.display = 'none';
                screeningsElement.style.display = 'flex';
                seatManagement.stopSeatChecking();
                const seatsElement = document.getElementById('seats');
                seatsElement.style.display = 'none';
                this.style.display = 'none';
                if(isAdmin) {
                    const editScreeningButton = document.querySelector('.edit-screening-button');
                    if(editScreeningButton){
                        editScreeningButton.remove();
                    }
                    const editCinemaHallButton = document.querySelector('.edit-cinema-hall-button');
                    if(editCinemaHallButton){
                        editCinemaHallButton.remove();
                    }
                    const finalizeButton = document.querySelector('.finalize-button');
                    if(finalizeButton){
                        finalizeButton.remove();
                    }
                    const KinosaalBuilder = document.querySelector('#Kinosaal-Builder');
                    if(KinosaalBuilder){
                        KinosaalBuilder.style.display = 'none';
                    }
                    document.querySelector('.Screening-Builder-Button').style.display = 'block';
                    const hallsList = document.querySelector('.halls');
                    if(hallsList !== null && hallsList.style.display == 'none'){
                        document.querySelector('.halls').style.display = 'flex';
                    }
                }
            });
        }
    });

    document.addEventListener('click', async function(event) {
        if (event.target.matches('.seat')) {
            const id = event.target.dataset.id;
            const screeningId = document.querySelector('#screening-details').dataset.id;
            // If the seat is not reserved or booked, select it
            if (!event.target.classList.contains('reserved') && !event.target.classList.contains('booked')) {
                // If the seat is already selected, deselect it
                if (event.target.classList.contains('selected')) {
                    seatManagement.removeSeatFromSelectedSeats(parseInt(id), screeningId);
                    event.target.classList.remove('selected');
                } else
                    // If the seat is not selected, select it
                    if(!event.target.classList.contains('reservedByMe') && !event.target.classList.contains('booked') && !event.target.classList.contains('reserved')){
                        event.target.classList.add('selected');
                        seatManagement.addSeatToSelectedSeats(parseInt(id), screeningId);
                    }



            }
        }
    });

    document.querySelector('.finalize-button').addEventListener('click', seatManagement.finalizeReservation);
}

fetchData();
async function patchScreening(screeningData) {
    await screeningAPIFunctions.updateScreening(screeningData.id, screeningData.film, parseInt(screeningData.playsInHallId), screeningData.played).then(() => {
        document.querySelector('.back-button').click();
        document.querySelector('.Screening-Builder-Form').remove();
        updateScreenings();
    });

}
async function createScreeningForm(screeningData, patchBoolean) {
    document.getElementById('Screening-Builder').style.display = 'block';
    const form = document.createElement('form');
    form.className = 'Screening-Builder-Form';
    const inputFilm = document.createElement('input');
    inputFilm.type = 'text';
    inputFilm.name = 'film';
    inputFilm.placeholder = 'Film';
    form.appendChild(inputFilm);
    const inputplaysInHallId = document.createElement('select');
    const halls = await hallAPIFunctions.getAllHalls();
    for(let i = 0; i < halls.length; i++){
        const hall = await hallAPIFunctions.getHallById(parseInt(halls[i]));
        if(hall.configured) {
            const option = document.createElement('option');
            option.value = halls[i];
            option.textContent = `Hall ${halls[i]}`;
            inputplaysInHallId.appendChild(option);
        }
    }
    inputplaysInHallId.name = 'playsInHallId';
    form.appendChild(inputplaysInHallId);
    const selectStattgefundenStat = document.createElement('select');
    selectStattgefundenStat.name = 'played';

    const stattgefundenOption = document.createElement('option');
    stattgefundenOption.value = true;
    stattgefundenOption.textContent = 'stattgefunden';

    const nichtstattgefundenOption = document.createElement('option');
    nichtstattgefundenOption.value = false;
    nichtstattgefundenOption.textContent = 'nicht stattgefunden';

    selectStattgefundenStat.appendChild(stattgefundenOption);
    selectStattgefundenStat.appendChild(nichtstattgefundenOption);

    form.appendChild(selectStattgefundenStat);
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    form.appendChild(submitButton);
    document.getElementById('Screening-Builder').appendChild(form);
    if(!patchBoolean) {
        form.addEventListener('submit', async function (event) {

            event.preventDefault();
            const film = document.getElementsByName('film')[0].value;
            const playsInHallId = document.getElementsByName('playsInHallId')[0].value;
            const played = document.getElementsByName('played')[0].value;
            screeningAPIFunctions.addNewScreening(parseInt(playsInHallId), film, played).then(() => {
                document.querySelector('.back-button').click();
                document.querySelector('.Screening-Builder-Form').remove();
                updateScreenings();
            })

        })
    }
}
async function populateScreeningForm(screeningData) {
    const form = document.querySelector('.Screening-Builder-Form');
    if (form) {
        form.remove();
        return;
    }
    await createScreeningForm(screeningData, true);
    const inputFilm = document.getElementsByName('film')[0];
    const inputplaysInHallId = document.getElementsByName('playsInHallId')[0];
    const inputStattgefundenStat = document.getElementsByName('played')[0];
    inputFilm.value = screeningData.film;
    inputplaysInHallId.value = screeningData.playsInHallId;
    inputplaysInHallId.querySelector(`[value="${screeningData.playsInHallId}"]`).selected = true;
    if(screeningData.played){

        inputStattgefundenStat.querySelector(`[value="true"]`).selected = true;
    }
    else{
        inputStattgefundenStat.querySelector(`[value="false"]`).selected = true;
    }

    document.querySelector('.Screening-Builder-Form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const film = document.getElementsByName('film')[0].value;
        const playsInHallId = document.getElementsByName('playsInHallId')[0].value;
        let played = document.getElementsByName('played')[0].value;
        played == 'true' ? played = true : played = false;
        const screening = {
            id: screeningData.id,
            film: film,
            playsInHallId: playsInHallId,
            played: played
        };
        await patchScreening(screening);
    });
}
async function refreshScreenings() {
    await updateScreenings();
}
let refreshScreeningInterval = setInterval(refreshScreenings, 5000); // Refresh every 30 seconds
async function editScreening(screeningId){
    const screeningData = await screeningAPIFunctions.fetchAllScreenings().then(screenings => {
        return screenings.find(screening => screening.id == screeningId);
    })
    await populateScreeningForm(screeningData);

}
async function editCinemaHall(hallId){
    document.getElementById('screening-details').style.display = 'none';
    document.getElementById('screening-details').innerHTML = '';
    if(document.querySelector('.seatsElement') != null){
        document.querySelector('.seatsElement').innerHTML = '';
    }
    if(document.querySelector('#Kinosaal-Builder').innerHTML != null){
        document.querySelector('#Kinosaal-Builder').innerHTML = '';
    }
    document.getElementById('Kinosaal-Builder').style.display = 'block';
    seatManagement.stopSeatChecking();
    let hall = await hallAPIFunctions.getHallById(hallId);

    for(let i = 0; i < hall.seatRows.length; i++){
        await rowBuilder(hall.seatRows[i], hall.seatRows[i].seats.length , i);
    }
    const addRowButton = document.createElement('button');
    addRowButton.className = 'add-row-button';
    addRowButton.textContent = `Add row`;
    document.getElementById('Kinosaal-Builder').appendChild(addRowButton);
    addRowButton.addEventListener('click', async function (event) {
        const rows = document.getElementById('Kinosaal-Builder').childElementCount - 1;
        let category;
        if (!hall.seatRows || hall.seatRows.length == 0) {
            category = await hallAPIFunctions.fetchSeatingCategories().then(categories => {
                return categories[0];
            });
        } else {
            category = hall.seatRows[hall.seatRows.length - 1].category;
        }
        if(!category){
            category = await hallAPIFunctions.createSeatingCategory('Parkett', 10);
        }
        hallAPIFunctions.addRowsToHall(hallId,
            [{
                categoryId: category.id,
                numberOfSeats: 10
            }
            ]
        ).then((response) => {
            if (response.seatRows != null && response.seatRows.length > hall.seatRows.length - 1) {
                hallAPIFunctions.getHallById(hallId).then(async hall => {
                    const row = hall.seatRows[hall.seatRows.length - 1];
                    await rowBuilder(row, row.seats.length, hall.seatRows.length - 1);
                }).then(() => {
                    const rowsElement = document.getElementById('Kinosaal-Builder').querySelectorAll('.row');
                    const row = rowsElement[rowsElement.length - 1];
                    const categorySelector = row.querySelector('.row-category-selector');
                    categorySelector.querySelector(`[value="${category.id}"]`).selected = true;
                })
            }
        });

    });
    const removeRowButton = document.createElement('button');
    removeRowButton.className = 'remove-row-button';
    removeRowButton.textContent = `Remove row`;
    removeRowButton.addEventListener('click', async function (event) {
        const currentHall = await hallAPIFunctions.getHallById(hallId);
        hallAPIFunctions.deleteRow(currentHall.id, currentHall.seatRows[currentHall.seatRows.length - 1].id).then((response) => {
            if (response.status == 200) {
                const rows = document.getElementById('Kinosaal-Builder').childElementCount - 1;
                if (rows == 1) {
                    return;
                }
                const rowsElement = document.getElementById('Kinosaal-Builder').querySelectorAll('.row');
                rowsElement[rowsElement.length - 1].remove();
            }
        });
    });
    const rowControls = document.createElement('div');
    rowControls.className = 'row-controls';
    rowControls.appendChild(addRowButton);
    rowControls.appendChild(removeRowButton);
    rowControls.style.display = 'flex';
    rowControls.style.flexDirection = 'row';
    document.getElementById('Kinosaal-Builder').appendChild(rowControls);
    const finalizeButton = document.createElement('button');
    finalizeButton.className = 'finalize-kinosaal-button';
    finalizeButton.textContent = 'Finalize cinema hall';
    finalizeButton.addEventListener('click', function(event){
        hallAPIFunctions.finishHall(hallId).then((response) => {
            if(response.status == 200){
                document.getElementById('Kinosaal-Builder').style.display = 'none';
                document.getElementById('screenings').style.display = 'block';
                document.querySelector('.back-button').style.display = 'none';
                document.querySelector('.halls').style.display = 'flex';
                document.getElementById('screenings').style.display = 'block';
                document.querySelector('.Screening-Builder-Button').style.display = 'block';
            }
            hallListBuilder();
            const ScreeningBuilderForm = document.querySelector('.Screening-Builder-Form');
            if(ScreeningBuilderForm){
                ScreeningBuilderForm.remove();
            }
        })
    })
    document.getElementById('Kinosaal-Builder').appendChild(finalizeButton);
}
function screeningArraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    a = [...a].sort((x, y) => x.id - y.id);
    b = [...b].sort((x, y) => x.id - y.id);

    for (var i = 0; i < a.length; ++i) {
        if (a[i].id !== b[i].id || a[i].film !== b[i].film || a[i].played !== b[i].played || a[i].playsInHallId !== b[i].playsInHallId) {
            return false;
        }
    }
    return true;
}
async function updateScreenings(forceUpdateBoolean) {
    try {
        if(updateScreeningCurrentlyRunning){
            return;
        } else {
            updateScreeningCurrentlyRunning = true;

        }
        if(forceUpdateBoolean){
            clearInterval(refreshScreeningInterval)
        }
        let screenings = await screeningAPIFunctions.fetchAllScreenings()
        const oldScreenings = JSON.parse(localStorage.getItem('screenings'));
        const screeningsElement = document.getElementById('screenings')
        if(!isAdmin){
        screenings = screenings.filter(screening => !screening.played)
        }
        if(!forceUpdateBoolean && screeningsElement.childElementCount > 0 && screeningArraysEqual(oldScreenings, screenings)  ){
            return;
        }

        const upcomingScreenings = screenings
        screeningsElement.innerHTML = '';
        for (const screening of upcomingScreenings) {
            const screeningElement = document.createElement('div');
            screeningElement.className = 'screening';
            screeningElement.dataset.id = screening.id;
            if(isAdmin){
                console.log("THIS IS AN ADMin")
            const playedString = screening.played ? 'played' : 'not played yet';
            screeningElement.textContent = `${screening.film} (${screening.id}) - Hall ${screening.playsInHallId} - ${playedString}`;
            } else {
                screeningElement.textContent = `${screening.film} - Hall ${screening.playsInHallId}`;

            }
            const moviePoster = await moviePosters.getMoviePoster(screening.film);
            if (moviePoster) {
                screeningElement.style.backgroundImage = `url(${moviePoster})`;

            }
            screeningsElement.appendChild(screeningElement);
        }
        localStorage.setItem('screenings', JSON.stringify(screenings));
        if(forceUpdateBoolean){
        setTimeout(() => {
            refreshScreeningInterval = setInterval(refreshScreenings, 5000); // Refresh every 30 seconds
        }, 5000);
        }
        updateScreeningCurrentlyRunning = false;
    } catch (error) {
        console.error('Error fetching screenings:', error);
    }
}


async function updateScreeningDetails(screeningId) {
    try {
        const screeningDetails = await screeningAPIFunctions.fetchAllScreenings().then(screenings => {
            return screenings.find(screening => screening.id == screeningId);
        })
        const screeningDetailsElement = document.getElementById('screening-details');
        screeningDetailsElement.style.display = 'flex';
        screeningDetailsElement.innerHTML = `<strong>${screeningDetails.film}</strong> - Screening Details `;
        screeningDetailsElement.style.textAlign = 'center';
        screeningDetailsElement.dataset.id = screeningDetails.id;
        if(isAdmin){
            const earnings = await screeningAPIFunctions.calculateEarningsFromScreening(screeningId);
            const earningsElement = document.createElement('div');
            earningsElement.className = 'earnings';
            earningsElement.textContent = `Earnings: ${earnings}€`;
            screeningDetailsElement.appendChild(earningsElement);

        }
    } catch (error) {
        console.error('Error fetching screening details:', error);
    }
}







async function hallListBuilder(){
    if(document.querySelector('.halls') != null){
        document.querySelector('.halls').remove();
    }
    const halls = await hallAPIFunctions.getAllHalls();
    const hallsContainer = document.createElement('div');
    hallsContainer.className = 'halls';
    document.body.appendChild(hallsContainer);
    for (let i = 0; i < halls.length; i++) {
        try {
            const hall = await hallAPIFunctions.getHallById(parseInt(halls[i]));
            const hallElement = document.createElement('div');
            hallElement.className = 'hall';
            hallElement.textContent = `Hall ${hall.id}`;
            hallsContainer.appendChild(hallElement);
            const deleteHallButton = document.createElement('button');
            deleteHallButton.className = 'delete-hall-button';
            deleteHallButton.textContent = 'Delete Cinema Hall';
            deleteHallButton.addEventListener('click', async function (event) {
                await hallAPIFunctions.deleteHallById(hall.id);
                hallElement.remove();
            });
            hallElement.appendChild(deleteHallButton);
            if (!hall.configured) {
                const editHallButton = document.createElement('button');
                editHallButton.className = 'edit-hall-button';
                editHallButton.textContent = 'Edit Cinema Hall';
                editHallButton.addEventListener('click', async function (event) {

                    await editCinemaHall(hall.id);
                    document.querySelector('.Screening-Builder-Button').style.display = 'none';
                    const halls = document.querySelector('.halls');
                    halls.style.display = 'none';
                    const backButton = document.querySelector('.back-button');
                    backButton.style.display = 'block';
                    backButton.addEventListener('click', function (event) {
                        const halls = document.querySelectorAll('.hall');
                        for (let i = 0; i < halls.length; i++) {
                            halls[i].style.display = 'block';
                        }
                        backButton.style.display = 'none';
                        document.querySelector('.Screening-Builder-Button').style.display = 'block';
                        document.getElementById('Kinosaal-Builder').style.display = 'none';
                        document.getElementById('screening-details').style.display = 'none';
                        document.getElementById('seats').style.display = 'none';
                        if (document.querySelector('.finalize-kinosaal-button') != null) {
                            document.querySelector('.finalize-kinosaal-button').remove();
                        }
                        document.querySelector('.row-controls').remove();
                    })
                });
                hallElement.appendChild(editHallButton);
            }
        } catch (error) {
            console.error('Error fetching the following hall:', halls[i]);

        }
    }
    const addHallButton = document.createElement('button');
    addHallButton.className = 'add-hall-button';
    addHallButton.textContent = 'Add Cinema Hall';
    addHallButton.addEventListener('click', async function (event) {
        const newHall = await hallAPIFunctions.createHall({configured: false}, []);
        const hallElement = document.createElement('div');
        hallElement.className = 'hall';
        hallElement.textContent = `Hall ${newHall.id}`;
        hallsContainer.appendChild(hallElement);
        const deleteHallButton = document.createElement('button');
        deleteHallButton.className = 'delete-hall-button';
        deleteHallButton.textContent = 'Delete Cinema Hall';
        deleteHallButton.addEventListener('click', async function (event) {
            await hallAPIFunctions.deleteHallById(newHall.id);
            hallElement.remove();
        });
        hallElement.appendChild(deleteHallButton);
        const editHallButton = document.createElement('button');
        editHallButton.className = 'edit-hall-button';
        editHallButton.textContent = 'Edit Cinema Hall';
        editHallButton.addEventListener('click', async function (event) {
            await editCinemaHall(newHall.id);
            document.querySelector('.Screening-Builder-Button').style.display = 'none';
            const halls = document.querySelectorAll('.hall');
            for (let i = 0; i < halls.length; i++) {
                halls[i].style.display = 'none';
            }
            const backButton = document.querySelector('.back-button');
            backButton.style.display = 'block';
            backButton.addEventListener('click', function (event) {
                const halls = document.querySelectorAll('.hall');
                for (let i = 0; i < halls.length; i++) {
                    halls[i].style.display = 'block';
                }
                backButton.style.display = 'none';
                document.querySelector('.Screening-Builder-Button').style.display = 'block';
                document.getElementById('Kinosaal-Builder').style.display = 'none';
                document.getElementById('screening-details').style.display = 'none';
                document.getElementById('seats').style.display = 'none';
                document.querySelector('.finalize-kinosaal-button').remove();
                document.querySelector('.row-controls').remove();
            })
        });
        hallsContainer.remove();
        await hallListBuilder();
    })
    hallsContainer.appendChild(addHallButton);
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
    });
}
document.querySelector('#login-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementsByName('username')[0].value;
    let password = document.getElementsByName('password')[0].value;
    document.querySelector('#logout-button').style.display = 'block';

    if (username == 'admin' && password == 'admin') {
        document.getElementsByName('username')[0].value = '';
        document.getElementsByName('password')[0].value = '';
        isAdmin = true;
        document.querySelector('#login-form').style.display = 'none';
        document.querySelector('.Screening-Builder-Button').style.display = 'block';
        document.querySelector('.back-button').click();
        document.querySelector('#hallsEdit').style.display = 'block';
        await hallListBuilder();
        await updateScreenings(true);
    }
});
document.querySelector('#user-login-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const customerId = parseInt(document.getElementsByName('id')[0].value);
    const user = await customerAPIFunctions.getCustomerById(customerId);
    if(user == undefined || user == null){
      alert('User does not exist');
    } else {
        await userAuth.setUser(user);

    }
});
document.querySelector('#logout-button').addEventListener('click', function() {
    document.querySelector('#login-form').style.display = 'block';
    document.querySelector('#logout-button').style.display = 'none';
    localStorage.setItem('me', undefined);
    location.reload();
});
