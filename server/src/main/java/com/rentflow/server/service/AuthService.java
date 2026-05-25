package com.rentflow.server.service;

import com.rentflow.server.dto.request.LoginRequestDTO;
import com.rentflow.server.dto.request.RefreshRequestDTO;
import com.rentflow.server.dto.request.RegisterRequestDTO;
import com.rentflow.server.dto.response.auth.JwtResponseDTO;
import com.rentflow.server.entity.KhachHang;
import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.entity.VaiTro;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.KhachHangRepository;
import com.rentflow.server.repository.TaiKhoanRepository;
import com.rentflow.server.repository.VaiTroRepository;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.TokenType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final TaiKhoanRepository taiKhoanRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final VaiTroRepository vaiTroRepository;
    private final KhachHangRepository khachHangRepository;

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

    @Transactional
    public JwtResponseDTO register(RegisterRequestDTO dto) {
        if (taiKhoanRepository.findByUsernameWithVaiTro(dto.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.EMAIL_DA_TON_TAI);
        }

        VaiTro vaiTro = vaiTroRepository.findByTenVaiTro("KHACH_HANG")
                .orElseThrow(() -> new AppException(ErrorCode.VAI_TRO_NOT_FOUND));

        TaiKhoan taiKhoan = TaiKhoan.builder()
                .username(dto.getEmail())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .trangThai("HOAT_DONG")
                .vaiTro(vaiTro)
                .build();
        taiKhoan = taiKhoanRepository.save(taiKhoan);

        KhachHang khachHang = KhachHang.builder()
                .taiKhoan(taiKhoan)
                .hoTen(dto.getHoTen())
                .email(dto.getEmail())
                .soDienThoai(dto.getSoDienThoai())
                .nhuCauThue(dto.getNhuCauThue())
                .build();
        khachHangRepository.save(khachHang);

        String accessToken = jwtService.generateToken(taiKhoan, TokenType.ACCESS);
        String refreshToken = jwtService.generateToken(taiKhoan, TokenType.REFRESH);
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
