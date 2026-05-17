package com.rentflow.server.util.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum TokenType {
    @JsonProperty("access")
    ACCESS,
    @JsonProperty("refresh")
    REFRESH,
    RESET
}
