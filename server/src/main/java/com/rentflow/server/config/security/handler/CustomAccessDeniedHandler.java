package com.rentflow.server.config.security.handler;

import com.rentflow.server.dto.response.ApiErrorResponse;
import com.rentflow.server.util.enums.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Slf4j
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException, IOException {
        log.error("-----------------------------------access denied handler start------------------------------------");
        response.setStatus(HttpStatus.OK.value());
        response.setContentType("application/json;charset=utf-8");
        ApiErrorResponse apiErrorResponse = ApiErrorResponse.builder()
                .status(ErrorCode.ACCESS_DENIED.getCode())
                .message(ErrorCode.ACCESS_DENIED.getMessage())
                .path(request.getRequestURI())
                .error(ErrorCode.ACCESS_DENIED.name())
                .build();
        ObjectMapper objectMapper = new ObjectMapper();
        // convert object to string
        response.getWriter().write(objectMapper.writeValueAsString(apiErrorResponse));
    }
}
