//post customer
/**
 * package application.controllers;
 *
 * import application.mps.generated.kinoService.Booking;
 * import application.mps.generated.kinoService.KinoService;
 * import application.mps.generated.kinoService.Customer;
 * import application.mps.generated.kinoService.Reservation;
 * import application.requestModels.CreateReservationOrBookingRequest;
 * import application.requestModels.CreateCustomerRequest;
 * import application.responseModels.BookingResponse;
 * import application.responseModels.CustomerResponse;
 * import application.responseModels.ReservationResponse;
 * import org.springframework.http.HttpStatus;
 * import org.springframework.http.ResponseEntity;
 * import org.springframework.web.bind.annotation.*;
 *
 * import java.util.ArrayList;
 * import java.util.List;
 *
 * @RestController
 * public class CustomerController {
 *
 *     private final KinoService service = KinoService.getInstance();
 *
 *
 *     @PostMapping(value= "/customer", consumes = "application/json", produces = "application/json")
 *     public ResponseEntity<CustomerResponse> create(@RequestBody final CreateCustomerRequest request) {
 *         try {
 *             Customer customer = service.createCustomer(request.name());
 *             CustomerResponse response = CustomerResponse.createFrom(customer);
 *             return new ResponseEntity<>(response, HttpStatus.OK);
 *         } catch (Exception e) {
 *             return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
 *         }
 *     }
 *
 *     @PostMapping("/customer/{customerId}/reservations")
 *     public ResponseEntity<ReservationResponse> addReservationsForCustomer(@PathVariable("customerId") final int customerId,
 *                                                                           @RequestBody final CreateReservationOrBookingRequest request) {
 *         try {
 *             System.out.println(request);
 *             Reservation reservation = service.createReservation(request.filmScreeningId(), request.seatId(), customerId);
 *             ReservationResponse response = ReservationResponse.createFrom(reservation);
 *             return new ResponseEntity<>(response, HttpStatus.OK);
 *         } catch (Exception e) {
 *             e.printStackTrace(System.err);
 *             return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
 *         }
 *     }
 *
 *     @GetMapping("/customer/{customerId}/reservations")
 *     public ResponseEntity<List<ReservationResponse>> getReservationsForCustomer(@PathVariable("customerId") final int id) {
 *         try {
 *             List<Reservation> reservations = service.getAllReservationsForCustomer(id);
 *             List<ReservationResponse> response = new ArrayList<>();
 *             for (Reservation reservation : reservations) {
 *                 response.add(ReservationResponse.createFrom(reservation));
 *             }
 *             return new ResponseEntity<>(response, HttpStatus.OK);
 *         } catch (Exception e) {
 *             e.printStackTrace();
 *             return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
 *         }
 *     }
 *
 *
 *     @DeleteMapping("/customer/{customerId}/reservations/{reservationId}")
 *     public ResponseEntity<String> deleteReservationsForCustomer(@PathVariable("customerId") final int customerId,
 *                                                                 @PathVariable("reservationId") final int reservationId) {
 *         try {
 *             service.deleteReservationForCustomer(customerId, reservationId);
 *             return new ResponseEntity<>("Delete successful.", HttpStatus.OK);
 *         } catch (Exception e) {
 *             return new ResponseEntity<>("Error while deleting.", HttpStatus.INTERNAL_SERVER_ERROR);
 *         }
 *     }
 *
 *     @PostMapping("customer/reservations/{reservationId}/toBuchung")
 *     public ResponseEntity<BookingResponse> transformReservationIntoBuchung(@PathVariable("reservationId") final int id) {
 *         try {
 *             System.out.println(id);
 *             Reservation reservierung = service.getReservation(id);
 *             System.out.println(reservierung);
 *             Booking booking = reservierung.toBooking();
 *             BookingResponse response = BookingResponse.createFrom(booking);
 *             return new ResponseEntity<>(response, HttpStatus.OK);
 *         } catch (Exception e) {
 *             e.printStackTrace(System.err);
 *             return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
 *         }
 *     }
 *
 *     @GetMapping("/customer/{id}/bookings")
 *     public ResponseEntity<List<BookingResponse>> getAllBookingsForCustomer(@PathVariable("id") final int id) {
 *         try {
 *             List<Booking> bookings = service.getAllBookingsForCustomer(id);
 *             List<BookingResponse> response = new ArrayList<>();
 *             for (Booking booking : bookings) {
 *                 response.add(BookingResponse.createFrom(booking));
 *             }
 *             return new ResponseEntity<>(response, HttpStatus.OK);
 *         } catch (Exception e) {
 *             return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
 *         }
 *     }
 *
 *     @PostMapping("/customer/{customerId}/booking")
 *     public ResponseEntity<BookingResponse> addNewBookingToCustomer(@PathVariable("customerId") final int customerId,
 *                                                                    @RequestBody final CreateReservationOrBookingRequest requestBooking) {
 *         try {
 *             Booking booking = service.addNewBookingToCustomer(customerId, requestBooking.seatId(), requestBooking.filmScreeningId());
 *             BookingResponse response = BookingResponse.createFrom(booking);
 *             return new ResponseEntity<>(response, HttpStatus.OK);
 *         } catch (Exception e) {
 *             return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
 *         }
 *     }
 *
 *     @DeleteMapping("/customer/{customerId}/booking/{bookingId}")
 *     public ResponseEntity<String> deleteBookingForCustomer(@PathVariable("customerId") final int customerId, @PathVariable("bookingId") final int bookingId) {
 *         try {
 *             service.deleteBookingForCustomer(customerId, bookingId);
 *             return new ResponseEntity<>("Successfully deleted.", HttpStatus.OK);
 *         } catch (Exception e) {
 *             return new ResponseEntity<>("Error while deleting.", HttpStatus.INTERNAL_SERVER_ERROR);
 *         }
 *     }
 * }
 *
 */
async function postCustomer(customerName) {
    try {
        const response = await fetch('/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerName }),
        });
        const newCustomer = await response.json();
        console.log(newCustomer);
        return newCustomer;
    } catch (error) {
        console.error('Error creating customer:', error);
    }
}
//get reservations
async function getReservationsForCustomer(customerId) {
    try {
        const response = await fetch(`/customer/${customerId}/reservations`);
        const reservations = await response.json();
        console.log(reservations);
        return reservations;
    } catch (error) {
        console.error('Error getting reservations:', error);
    }
}
//get bookings
async function getBookingsForCustomer(customerId) {
    try {
        const response = await fetch(`/customer/${customerId}/bookings`);
        const bookings = await response.json();
        console.log(bookings);
        return bookings;
    } catch (error) {
        console.error('Error getting bookings:', error);
    }
}
async function addReservationForCustomer(customerId, filmScreeningId, seatId) {
try {
        const response = await fetch(`/customer/${customerId}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filmScreeningId, seatId }),
        });
        const reservation = await response.json();
        console.log(reservation);
        return reservation;
    } catch (error) {
        console.error('Error adding reservation:', error);
    }
}
async function addBookingForCustomer(customerId, filmScreeningId, seatId) {
    try {
        const response = await fetch(`/customer/${customerId}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filmScreeningId, seatId }),
        });
        const booking = await response.json();
        console.log(booking);
        return booking;
    } catch (error) {
        console.error('Error adding booking:', error);
    }
}
async function deleteReservationForCustomer(customerId, reservationId) {
    try {
        const response = await fetch(`/customer/${customerId}/reservations/${reservationId}`, {
            method: 'DELETE',
        });
        const result = await response.text();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error deleting reservation:', error);
    }
}
async function deleteBookingForCustomer(customerId, bookingId) {
    try {
        const response = await fetch(`/customer/${customerId}/bookings/${bookingId}`, {
            method: 'DELETE',
        });
        const result = await response.text();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error deleting booking:', error);
    }
}
async function transformReservationIntoBooking(reservationId) {
    try {
        const response = await fetch(`/customer/reservations/${reservationId}/toBuchung`, {
            method: 'POST'
        });
        const booking = await response.json();
        console.log(booking);
        return booking;
    } catch (error) {
        console.error('Error transforming reservation into booking:', error);
    }
}
module.exports = {
    postCustomer,
    getReservationsForCustomer,
    getBookingsForCustomer,
    addReservationForCustomer,
    addBookingForCustomer,
    deleteReservationForCustomer,
    deleteBookingForCustomer,
    transformReservationIntoBooking
}
