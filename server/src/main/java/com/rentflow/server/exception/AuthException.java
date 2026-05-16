package com.rentflow.server.exception;

import com.rentflow.server.util.enums.ErrorCode;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.AuthenticationException;

@Setter
@Getter
public class AuthException extends AuthenticationException {
    private final ErrorCode errorCode;

    public AuthException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}