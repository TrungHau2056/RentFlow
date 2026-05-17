package com.rentflow.server.service;


import com.rentflow.server.dto.request.LoginRequestDTO;
import com.rentflow.server.dto.request.RefreshRequestDTO;
import com.rentflow.server.dto.response.auth.JwtResponseDTO;
import com.rentflow.server.entity.NguoiDung;
import com.rentflow.server.exception.AppException;
import com.rentflow.server.repository.NguoiDungRepository;
import com.rentflow.server.util.enums.ErrorCode;
import com.rentflow.server.util.enums.TokenType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public JwtResponseDTO login(LoginRequestDTO dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();
        // Tìm NguoiDung theo email với join fetch VaiTro
        NguoiDung user = nguoiDungRepository.findByEmailWithVaiTro(email)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        
        // Kiểm tra password
        if (!passwordEncoder.matches(password, user.getMatKhauMaHoa())) {
            throw new AppException(ErrorCode.PASSWORD_INVALID);
        }
        
        // Gen token
        String accessToken = jwtService.generateToken(user, TokenType.ACCESS);
        String refreshToken = jwtService.generateToken(user, TokenType.REFRESH);

        return JwtResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }


    public JwtResponseDTO refresh(RefreshRequestDTO dto) {
        String refreshToken = dto.getRefreshToken();
        // check valid
        jwtService.checkValid(refreshToken, TokenType.REFRESH);
        String email = jwtService.extractEmail(refreshToken);
        NguoiDung user = nguoiDungRepository.findByEmailWithVaiTro(email)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        String accessToken = jwtService.generateToken(user, TokenType.ACCESS);
        String newRefreshToken = jwtService.generateToken(user, TokenType.REFRESH);
        return JwtResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
}
