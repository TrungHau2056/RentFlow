package com.rentflow.server.util;

import com.rentflow.server.entity.TaiKhoan;
import com.rentflow.server.exception.AuthException;
import com.rentflow.server.repository.TaiKhoanRepository;
import com.rentflow.server.util.enums.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final TaiKhoanRepository taiKhoanRepository;

    public TaiKhoan getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AuthException(ErrorCode.UNAUTHORIZED);
        }
        String username = auth.getName();
        return taiKhoanRepository.findByUsernameWithVaiTro(username)
                .orElseThrow(() -> new AuthException(ErrorCode.ACCOUNT_NOT_EXIST));
    }

    public boolean isChuNhaOwner(Long chuNhaId) {
        TaiKhoan currentUser = getCurrentUser();
        if (currentUser.getChuNhaSet() == null || currentUser.getChuNhaSet().isEmpty()) {
            return false;
        }
        return currentUser.getChuNhaSet().stream()
                .anyMatch(cn -> cn.getId().equals(chuNhaId));
    }
}