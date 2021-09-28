package com.rapi.validation;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.ArrayList;
import java.util.List;

public class RideValidationError {
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<String> errors = new ArrayList<>();
    private final String message;

    public RideValidationError(String message) { this.message = message; }

    public void addValidationError(String message) { errors.add(message); }

    public List<String> getErrors() { return errors; }

    public String getErrorMessage() { return message; }
}
