package com.rapi.validation;

import org.springframework.validation.Errors;
import org.springframework.validation.ObjectError;

public class RideValidationErrorBuilder {

  public static RideValidationError fromBindingErrors(Errors errors) {

    String err = "Validation failed. " + errors.getErrorCount() + " error(s)";
    RideValidationError error = new RideValidationError(err);

    for(ObjectError objError : errors.getAllErrors())
        error.addValidationError(objError.getDefaultMessage());

    return error;
  }
}
