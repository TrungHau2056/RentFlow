package com.rentflow.server.controller;


import com.rentflow.server.dto.request.LoginRequestDTO;
import com.rentflow.server.dto.request.RefreshRequestDTO;
import com.rentflow.server.dto.request.RegisterRequestDTO;
import com.rentflow.server.dto.response.ApiSuccessResponse;
import com.rentflow.server.dto.response.auth.JwtResponseDTO;
import com.rentflow.server.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Validated
@RequiredArgsConstructor
@Tag(name = "01. Xác thực (Auth)", description = "Đăng nhập, đăng ký, refresh token")
public class AuthController {
    private final AuthService authService;
    @PostMapping("/login")
    @Operation(summary = "Đăng nhập", description = "Đăng nhập bằng email và mật khẩu, nhận JWT token")
    public ApiSuccessResponse<JwtResponseDTO> login(@RequestBody @Valid LoginRequestDTO dto) {
        return ApiSuccessResponse.<JwtResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Login successfully")
                .data(authService.login(dto))
                .build();
    }

    @PostMapping("/register")
    @Operation(summary = "Đăng ký", description = "Đăng ký tài khoản mới (khách hàng)")
    public ApiSuccessResponse<JwtResponseDTO> register(@RequestBody @Valid RegisterRequestDTO dto) {
        return ApiSuccessResponse.<JwtResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .message("Đăng ký tài khoản thành công")
                .data(authService.register(dto))
                .build();
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Làm mới JWT access token bằng refresh token")
    public ApiSuccessResponse<JwtResponseDTO> refresh(@RequestBody @Valid RefreshRequestDTO dto) {
        return ApiSuccessResponse.<JwtResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .message("Refresh successfully")
                .data(authService.refresh(dto))
                .build();
    }
}
