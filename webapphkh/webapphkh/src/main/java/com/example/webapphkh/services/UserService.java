package com.example.webapphkh.services;

import com.example.webapphkh.models.User;
import com.example.webapphkh.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, String> resetTokens = new HashMap<>();

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public ResponseEntity<String> registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email đã tồn tại!");
        }

        String verificationCode = UUID.randomUUID().toString();
        user.setVerificationCode(verificationCode);
        user.setEnabled(false);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        sendVerificationEmail(user.getEmail(), verificationCode);
        return ResponseEntity.ok("Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.");
    }

    private void sendVerificationEmail(String email, String code) {
        String verifyUrl = "http://localhost:3000/verify?code=" + code;
        String subject = "Xác minh tài khoản của bạn";
        String text = "Chào bạn,\n\nVui lòng nhấp vào liên kết sau để xác minh tài khoản của bạn:\n" + verifyUrl +
                      "\n\nNếu bạn không đăng ký tài khoản, hãy bỏ qua email này.";
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ResponseEntity<String> verifyUser(String code) {
        Optional<User> userOpt = userRepository.findByVerificationCode(code);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(400).body("Mã xác minh không hợp lệ hoặc đã hết hạn.");
        }
        User user = userOpt.get();
        user.setEnabled(true);
        user.setVerificationCode(null);
        userRepository.save(user);
        return ResponseEntity.ok("Xác minh tài khoản thành công!");
    }

    @Transactional
    public ResponseEntity<?> loginUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body("Email không tồn tại!");
        }

        User user = userOptional.get();
        if (!user.isEnabled()) {
            return ResponseEntity.status(403).body("Tài khoản chưa được xác minh qua email.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body("Mật khẩu không chính xác!");
        }

        user.getLearningHistories().size(); // Kích hoạt lazy loading
        return ResponseEntity.ok(user);
    }

    @Transactional
    public ResponseEntity<String> updateUser(Long id, String name, String email, String password, MultipartFile profileImage) {
        Optional<User> existingUserOptional = userRepository.findById(id);
        if (existingUserOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Người dùng không tồn tại!");
        }

        User existingUser = existingUserOptional.get();

        if (name != null) existingUser.setName(name);
        if (email != null) existingUser.setEmail(email);
        if (password != null && !password.isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(password));
        }

        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                String imageUrl = saveImage(profileImage);
                existingUser.setProfileImage(imageUrl);
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Lỗi khi lưu ảnh.");
            }
        }

        userRepository.save(existingUser);
        return ResponseEntity.ok("Cập nhật thành công!");
    }

    private String saveImage(MultipartFile profileImage) throws IOException {
        String uploadsDir = System.getProperty("user.dir") + "/uploads/";
        File dir = new File(uploadsDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String originalFilename = profileImage.getOriginalFilename();
        String filePath = uploadsDir + originalFilename;

        profileImage.transferTo(new File(filePath));
        return "/uploads/" + originalFilename;
    }

    public ResponseEntity<String> deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Người dùng không tồn tại!");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("Xóa thành công!");
    }

    public ResponseEntity<String> forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Email không tồn tại");
        }

        String token = UUID.randomUUID().toString();
        resetTokens.put(token, email);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Đặt lại mật khẩu");
            message.setText("Click vào liên kết để đặt lại mật khẩu:\nhttp://localhost:3000/reset-password?token=" + token);
            mailSender.send(message);
            return ResponseEntity.ok("Đã gửi email đặt lại mật khẩu");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi gửi email: " + e.getMessage());
        }
    }

    public ResponseEntity<String> resetPassword(String token, String newPassword) {
        if (!resetTokens.containsKey(token)) {
            return ResponseEntity.status(400).body("Token không hợp lệ");
        }

        String email = resetTokens.get(token);
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Không tìm thấy người dùng");
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetTokens.remove(token);

        return ResponseEntity.ok("Mật khẩu đã được cập nhật");
    }
    public ResponseEntity<String> verifyCode(String code) {
    // Kiểm tra mã xác minh trong cơ sở dữ liệu
    Optional<User> userOpt = userRepository.findByVerificationCode(code); // Giả sử bạn có trường này trong User
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã xác minh không hợp lệ hoặc đã hết hạn.");
    }

    // Xử lý xác minh thành công
    User user = userOpt.get();
    user.setEnabled(true);  // Kích hoạt tài khoản sau khi xác minh
    user.setVerificationCode(null);  // Xóa mã xác minh sau khi xác nhận
    userRepository.save(user);  // Lưu thông tin tài khoản

    return ResponseEntity.ok("Xác minh tài khoản thành công!");
}


}
