package com.example.webapphkh.controllers;

import com.example.webapphkh.dtos.ForgotPasswordRequest;
import com.example.webapphkh.models.User;
import com.example.webapphkh.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> userOptional = userService.getUserById(id);
        return userOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        if (user == null || user.getEmail() == null || user.getPassword() == null || user.getName() == null) {
            response.put("error", "Dữ liệu đăng ký không hợp lệ");
            return ResponseEntity.badRequest().body(response);
        }

        ResponseEntity<String> registerResponse = userService.registerUser(user);
        String bodyMessage = Objects.requireNonNullElse(registerResponse.getBody(), "Đăng ký không thành công");

        response.put("message", bodyMessage);
        return ResponseEntity.status(registerResponse.getStatusCode()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User loginRequest) {
        Map<String, Object> response = new HashMap<>();

        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            response.put("error", "Email hoặc mật khẩu không hợp lệ");
            return ResponseEntity.badRequest().body(response);
        }

        ResponseEntity<?> loginResponse = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());

        if (loginResponse.getStatusCode() == HttpStatus.UNAUTHORIZED || loginResponse.getStatusCode() == HttpStatus.FORBIDDEN) {
            response.put("error", String.valueOf(loginResponse.getBody()));
            return ResponseEntity.status(loginResponse.getStatusCode()).body(response);
        }

        User user = userService.findByEmail(loginRequest.getEmail());
        response.put("message", "Đăng nhập thành công!");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/update")
    public ResponseEntity<String> updateUser(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        return userService.updateUser(id, name, email, password, profileImage);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return userService.forgotPassword(request.getEmail());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        return userService.resetPassword(token, newPassword);
    }

    @GetMapping("/verify")
public ResponseEntity<String> verifyUser(@RequestParam String code) {
    if (code == null || code.isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã xác minh không hợp lệ.");
    }

    // Gọi dịch vụ để kiểm tra mã xác minh và trả về kết quả
    return userService.verifyCode(code);
}


}
