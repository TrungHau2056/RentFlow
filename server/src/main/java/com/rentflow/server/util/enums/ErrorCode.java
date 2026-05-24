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
    HOP_DONG_KY_GUI_NOT_FOUND(404, "Không tìm thấy hợp đồng ký gửi", HttpStatus.NOT_FOUND),
    HOP_DONG_THUE_NOT_FOUND(404, "Không tìm thấy hợp đồng thuê", HttpStatus.NOT_FOUND),
    HOA_HONG_NOT_FOUND(404, "Không tìm thấy hoa hồng", HttpStatus.NOT_FOUND),
    GIAO_DICH_NOT_FOUND(404, "Không tìm thấy giao dịch tài chính", HttpStatus.NOT_FOUND),
    NHAN_VIEN_NOT_FOUND(404, "Không tìm thấy nhân viên", HttpStatus.NOT_FOUND),
    TIEN_DAM_BAO_DA_THU(400, "Tiền đảm bảo đã được ghi nhận cho hợp đồng này", HttpStatus.BAD_REQUEST),
    HOA_HONG_DA_TINH(400, "Hoa hồng đã được tính cho hợp đồng thuê này", HttpStatus.BAD_REQUEST),
    HOA_HONG_DA_THANH_TOAN(400, "Hoa hồng đã được thanh toán", HttpStatus.BAD_REQUEST),
    HOP_DONG_CHUA_DU_DIEU_KIEN(400, "Hợp đồng ký gửi chưa đủ điều kiện hoàn trả", HttpStatus.BAD_REQUEST),
    HOP_DONG_KHONG_HOP_LE(400, "Hợp đồng ký gửi không ở trạng thái hợp lệ", HttpStatus.BAD_REQUEST),
    DA_HOAN_TRA(400, "Đã xuất lệnh hoàn trả cho hợp đồng này", HttpStatus.BAD_REQUEST)
     ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
