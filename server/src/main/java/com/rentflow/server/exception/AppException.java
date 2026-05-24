package com.rentflow.server.exception;


import com.rentflow.server.util.enums.ErrorCode;
import lombok.Getter;

@Getter
public class AppException extends RuntimeException{
    private final ErrorCode errorCode;

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
