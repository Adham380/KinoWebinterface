var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cors = require("cors");
const screeningAPICalls = require('./apiCalls/screeningAPICalls');
const customerAPICalls = require('./apiCalls/customerAPICalls');
const hallAPICalls = require('./apiCalls/hallAPICalls');
var app = express();
app.use(cors({origin: 'http://localhost:3000'}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // or specify a domain instead of '*'
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/kino', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'public', 'kino.html'));
});

app.get('/screenings', function(req, res, next) {
    screeningAPICalls.getScreenings().then(data => {
        res.send(data);
    });
});
// Add endpoint for getting reserved seats for a screening
app.get('/screening/:screeningId/reservedSeats', function(req, res, next) {
    screeningAPICalls.getReservedSeats(req.params.screeningId).then(data => {
        res.send(data);
    });
});

// Add endpoint for getting booked seats for a screening
app.get('/screening/:screeningId/bookedSeats', function(req, res, next) {
    screeningAPICalls.getBookedSeats(req.params.screeningId).then(data => {
        res.send(data);
    });
});

// Add endpoint for getting a screening by id
app.get('/screening/:screeningId', function(req, res, next) {
    screeningAPICalls.getScreeningById(req.params.screeningId).then(data => {
        res.send(data);
    });
});

// Add endpoint for getting earnings for a screening
app.get('/screening/:screeningId/earnings', function(req, res, next) {
    screeningAPICalls.getEarnings(req.params.screeningId).then(data => {
        res.send(data);
    });
});

// Add endpoint for posting a new screening
app.patch('/screening/:screeningId', function(req, res, next) {
    screeningAPICalls.patchScreening(req.body, req.params.screeningId).then(data => {
        res.send(data);
    });
});
app.post('/screening', function(req, res, next) {
    screeningAPICalls.postScreening(req.body).then(data => {
        res.send(data);
    });
});

app.get('/hall/:hallId', function(req, res, next) {
    hallAPICalls.getHallById(req.params.hallId).then(data => {
        res.send(data);
    });
});

// Add endpoint for creating a new seating category
app.post('/seatingCategory', function(req, res, next) {
    hallAPICalls.createSeatingCategory(req.body.name, req.body.price).then(data => {
        res.send(data);
    });
});

app.delete('/seatingCategory/:seatingCategoryId', function(req, res, next) {
    hallAPICalls.deleteSeatingCategory(req.params.seatingCategoryId).then(data => {
        res.send(data);
    });
})
// Add endpoint for fetching all seating categories
app.get('/seatingCategories', function(req, res, next) {
    hallAPICalls.fetchSeatingCategories().then(data => {
        res.send(data);
    });
});

// Add endpoint for creating a new hall
app.post('/hall', function(req, res, next) {
    hallAPICalls.createHall(req.body.configured, req.body.seatRows).then(data => {
        res.send(data);
    });
});

// Add endpoint for fetching a hall by ID
app.get('/hall/:hallId', function(req, res, next) {
    hallAPICalls.getHallById(req.params.hallId).then(data => {
        res.send(data);
    });
});

// Add endpoint for deleting a hall by ID
app.delete('/hall/:hallId', function(req, res, next) {
    hallAPICalls.deleteHallById(req.params.hallId).then(data => {
        res.send(data);
    });
});

// Add endpoint for finishing a hall
app.get('/hall/:hallId/finish', function(req, res, next) {
    hallAPICalls.finishHall(req.params.hallId).then(data => {
        res.send(data);
    });
});

// Add endpoint for adding rows to a hall
app.post('/hall/:hallId/rows', function(req, res, next) {
    hallAPICalls.addRowsToHall(req.params.hallId, req.body.rows).then(data => {
        res.send(data);
    });
});

// Add endpoint for updating a row in a hall
app.patch('/hall/rows/:rowId', function(req, res, next) {
    hallAPICalls.updateRowInHall( req.params.rowId, req.body).then(data => {
        res.send(data);
    });
});

// Add endpoint for getting all halls
app.get('/halls', function(req, res, next) {
    hallAPICalls.getAllHalls().then(data => {
        res.send(data);
    });
});

// Add endpoint for creating a new customer
app.post('/customer', function(req, res, next) {
    customerAPICalls.postCustomer(req.body.name).then(data => {
        res.send(data);
    });
});

// Add endpoint for adding a reservation for a customer
app.post('/customer/:customerId/reservations', function(req, res, next) {
    customerAPICalls.addReservationForCustomer(req.params.customerId, req.body.filmScreeningId, req.body.seatId).then(data => {
        res.send(data);
    });
});

// Add endpoint for getting all reservations for a customer
app.get('/customer/:customerId/reservations', function(req, res, next) {
    customerAPICalls.getReservationsForCustomer(req.params.customerId).then(data => {
        res.send(data);
    });
});

// Add endpoint for deleting a reservation for a customer
app.delete('/customer/:customerId/reservations/:reservationId', function(req, res, next) {
    customerAPICalls.deleteReservationForCustomer(req.params.customerId, req.params.reservationId).then(data => {
        res.send(data);
    });
});

// Add endpoint for transforming a reservation into a booking
app.post('/customer/reservations/:reservationId/toBuchung', function(req, res, next) {
    customerAPICalls.transformReservationIntoBooking(req.params.reservationId).then(data => {
        res.send(data);
    });
});

// Add endpoint for getting all bookings for a customer
app.get('/customer/:customerId/bookings', function(req, res, next) {
    customerAPICalls.getBookingsForCustomer(req.params.customerId).then(data => {
        res.send(data);
    });
});

// Add endpoint for adding a new booking to a customer
app.post('/customer/:customerId/booking', function(req, res, next) {
    customerAPICalls.addBookingForCustomer(req.params.customerId,  req.body.filmScreeningId, req.body.seatId).then(data => {
        res.send(data);
    });
});

// Add endpoint for deleting a booking for a customer
app.delete('/customer/:customerId/booking/:bookingId', function(req, res, next) {
    customerAPICalls.deleteBookingForCustomer(req.params.customerId, req.params.bookingId)
        .then(data => {
            res.send(data);
        });
});
module.exports = app;
