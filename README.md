# 🌐 WebAppHọc – Ứng dụng học tiếng Anh tích hợp AI

Đây là một ứng dụng học tiếng Anh gồm backend viết bằng Java Spring Boot restful api và frontend viết bằng React. Ứng dụng hỗ trợ học bài đọc, nghe, câu hỏi trắc nghiệm, tích hợp OpenAI và Gemini API.

---

## 📁 1. Cấu trúc Project

```
projectmnm/
├── webapphkh/                         # Thư mục backend - Spring Boot
│   └── src/...
│   └── pom.xml
│   └── README.md (file này)
├── frontend/                        # Thư mục frontend - React
│   └── src/...
│   └── package.json
└── uploads/                         # Lưu ảnh người dùng
```

---

## ✅ 2. Hướng dẫn cài đặt & chạy project

### BƯỚC 1: Tải project về từ GitHub


git clone https://github.com/JiHuii58/OSS1



### BƯỚC 2: Tạo file cấu hình cho Backend

Vì file `application.properties` chứa API key nên **không được upload lên GitHub**. Ta cần tạo file thủ công như sau:

1. Tạo file:
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

2. Mở file `src/main/resources/application.properties` và thay các dòng sau bằng thông tin thật:

```properties
# ------------------ Cấu hình ứng dụng ------------------
spring.application.name=webapphkh
server.port=8081

# ------------------ Cấu hình CSDL PostgreSQL ------------------
spring.datasource.url=jdbc:postgresql://localhost:5432/AppTA
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# Tùy chọn JPA
spring.jpa.database=postgresql
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

# ------------------ Tích hợp AI ------------------
# (Thay bằng key thật)
spring.ai.openai.api-key=your_openai_api_key
gemini.api.key=your_google_gemini_api_key

# ------------------ Cấu hình gửi email qua Gmail ------------------
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_gmail_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

---

### BƯỚC 3: Khôi phục CSDL PostgreSQL

1. Mở phần mềm quản lý PostgreSQL (PgAdmin hoặc DBeaver...).

2. Tạo một **database tên là `AppTA`**.

3. **Restore file backup** PostgreSQL (file `.sql` hoặc `.backup`) mà em đã cung cấp.

---

### BƯỚC 4: Chạy backend

Vào thư mục webapphkh  rồi chạy:

```bash
./mvnw spring-boot:run
```

> Nếu dùng Windows:
```bash
mvnw.cmd spring-boot:run
```

hoặc có thể chạy bằng cách vào file WebapphkhApplication.java rồi ấn vào biểu tượng hình tam giác ở phía trên để chạy backend.

Kiểm tra backend chạy tại địa chỉ:  
📍 http://localhost:8081

---

### BƯỚC 5: Cài và chạy frontend (React)

```bash
cd frontend
npm install
npm start
```

Sau khi khởi chạy thành công, frontend sẽ chạy ở:  
📍 http://localhost:3000

---


---

## 📬 Liên hệ hỗ trợ

- Email: huynhdonghuy0805@gmail.com
- GitHub: https://github.com/JiHuii58/OSS1
- sđt: 0982078061

Nếu thầy không chạy được có thể liên hệ em và em sẽ hỗ trợ khắc phục tốt nhất có thể để hoàn thành bài tiểu luận một cách tốt nhất ạ.

---


