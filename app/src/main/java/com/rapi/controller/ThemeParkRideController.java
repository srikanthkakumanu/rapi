package com.rapi.controller;

import com.rapi.domain.ThemeParkRide;
import com.rapi.repository.ThemeParkRideRepository;
import com.rapi.validation.RideValidationErrorBuilder;
import com.rapi.validation.RideValidationError;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import org.springframework.validation.Errors;
import javax.validation.Valid;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/themepark") // context path i.e. prefix
public class ThemeParkRideController {
    private static final Logger log = LoggerFactory.getLogger(ThemeParkRideController.class.getCanonicalName());
    private final ThemeParkRideRepository repository;

    // @Autowired can be omitted since v4.3
    public ThemeParkRideController(ThemeParkRideRepository repository) { this.repository = repository; }

    /**
    * Returns all rides
    */
    @GetMapping("/ride")
    public ResponseEntity<Iterable<ThemeParkRide>> getRides() { return ResponseEntity.ok(repository.findAll()); }

    /**
    * Returns a specific ride
    */
    @GetMapping("/ride/{id}")
    public ResponseEntity<?> getRide(@PathVariable long id) {
      Optional<ThemeParkRide> result = repository.findById(id);
      // TODO fix below code section
      if(result.isEmpty())
        return ResponseEntity.ok(result);
      else
        // return ResponseEntity.status(HttpStatus.NOT_FOUND)
        //                       .body(String.format("Invalid ride id %s", id));
        return ResponseEntity.notFound().build();
                              
    }

    /**
    * Creates or saves a ride
    */
    @RequestMapping(value="/ride", method={RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> saveRide(@Valid @RequestBody ThemeParkRide ride, Errors errors) {

      if(errors.hasErrors())
        return ResponseEntity.badRequest()
                              .body(RideValidationErrorBuilder.fromBindingErrors(errors));
      ThemeParkRide result = repository.save(ride);

      // For HATEOS links generaton
      URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                                                  .path("/{id}")
                                                  .buildAndExpand(result.getId())
                                                  .toUri();
      return ResponseEntity.created(location).build();
    }

    /**
     * Deletes a ride by id which is passed as path variable
     * @param id ride id
     * @return
     */
    @DeleteMapping("/ride/{id}")
    public ResponseEntity<ThemeParkRide> deleteRide(@PathVariable long id) {
      repository.deleteById(id);
      return ResponseEntity.noContent().build();
    }

    /**
     * Deletes a ride which is passed in request body
     * @param ride
     * @return
     */
    @DeleteMapping("/ride")
    public ResponseEntity<ThemeParkRide> deleteRide(@RequestBody ThemeParkRide ride) {
      repository.delete(ride);
      return ResponseEntity.noContent().build();
    }

    /**
    * Exception handler method for ThemeRideController validations
    */
    @ExceptionHandler
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public RideValidationError handleException(Exception exception) {
      log.error("Exception caught: ", exception.getMessage());
      return new RideValidationError(exception.getMessage());
    }
}
