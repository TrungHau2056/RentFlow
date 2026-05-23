package com.rentflow.server.service;

import com.rentflow.server.dto.request.LoginRequestDTO;
import com.rentflow.server.dto.request.RefreshRequestDTO;
import com.rentflow.server.dto.response.auth.JwtResponseDTO;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.TaiKhoanRepository;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.TokenType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public JwtResponseDTO login(LoginRequestDTO dto) {
        String username = dto.getEmail();
        String password = dto.getPassword();
        TaiKhoan user = taiKhoanRepository.findByUsernameWithVaiTro(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new AppException(ErrorCode.PASSWORD_INVALID);
        }
        String accessToken = jwtService.generateToken(user, TokenType.ACCESS);
        String refreshToken = jwtService.generateToken(user, TokenType.REFRESH);
        return JwtResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public JwtResponseDTO refresh(RefreshRequestDTO dto) {
        String refreshToken = dto.getRefreshToken();
        jwtService.checkValid(refreshToken, TokenType.REFRESH);
        String username = jwtService.extractUsername(refreshToken);
        TaiKhoan user = taiKhoanRepository.findByUsernameWithVaiTro(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        String accessToken = jwtService.generateToken(user, TokenType.ACCESS);
        String newRefreshToken = jwtService.generateToken(user, TokenType.REFRESH);
        return JwtResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
}
