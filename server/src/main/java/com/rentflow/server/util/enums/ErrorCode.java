package com.rentflow.server.util.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    UNAUTHORIZED(401, "Your credentials were invalid, please check again", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(403, "You're not allowed to access this action, please try later", HttpStatus.FORBIDDEN),
    REGEX_INVALID(400, "Your regex was invalid, please try on later", HttpStatus.BAD_REQUEST),
    JWT_SIGN_ERROR(400, "There was an error when sign your token, please check out your token's format",
            HttpStatus.BAD_REQUEST),
    TOKEN_SIGNATURE_INVALID(400, "Your token signature was invalid, please login again to get your new access token",
            HttpStatus.BAD_REQUEST),
    TOKEN_DISABLED(401, "Your token is disabled", HttpStatus.UNAUTHORIZED),
     TOKEN_EXPIRED(401, "Your token was expired, please login again", HttpStatus.UNAUTHORIZED),
     ACCOUNT_NOT_EXIST(401, "Can't find any account with your given email, please try others", HttpStatus.UNAUTHORIZED),
     PASSWORD_INVALID(401, "Your password is invalid, please check again", HttpStatus.UNAUTHORIZED),
TOKEN_INVALID(401,"your token was invalid",HttpStatus.UNAUTHORIZED),
      CHU_NHA_NOT_FOUND(404, "Landlord not found", HttpStatus.NOT_FOUND),
      BAT_DONG_SAN_NOT_FOUND(404, "Property not found", HttpStatus.NOT_FOUND),
      LICH_HEN_NOT_FOUND(404, "Appointment not found", HttpStatus.NOT_FOUND),
      HOP_DONG_NOT_FOUND(404, "Contract not found", HttpStatus.NOT_FOUND),
      INVALID_STATUS_TRANSITION(400, "Invalid status transition", HttpStatus.BAD_REQUEST),
      NHAN_VIEN_NOT_FOUND(404, "Employee not found", HttpStatus.NOT_FOUND),
      DUPLICATE_LICH_HEN(400, "There is already an appointment at this time", HttpStatus.BAD_REQUEST),
      INVALID_LICH_HEN(400, "Appointment is not in valid state for this action", HttpStatus.BAD_REQUEST),
      INVALID_BAT_DONG_SAN(400, "Property is not in valid state for this action", HttpStatus.BAD_REQUEST),
      INVALID_HOP_DONG(400, "Contract is not in valid state for this action", HttpStatus.BAD_REQUEST)
      ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
