import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8081/users/register", {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác minh.");
        navigate("/login");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Email đã tồn tại hoặc có lỗi xảy ra.";
      toast.error(message);
    }
  };

  return (
    <div className="login_register">
      <form onSubmit={handleRegister}>
        <h2>Đăng Ký</h2>
        <input
          type="text"
          placeholder="Nhập tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đăng ký</button>
        <div className="acc">
          <a href="/login">Đã có tài khoản?</a>
        </div>
      </form>

      {/* CSS nhúng trực tiếp */}
      <style jsx>{`
        /* Keyframes */
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes glow {
          from { text-shadow: 2px 2px 6px rgba(45, 135, 240, 0.4); }
          to { text-shadow: 2px 2px 15px rgba(45, 135, 240, 0.8); }
        }

        /* Container chính */
        .login_register {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #6dd5fa 100%);
          position: relative;
          overflow: hidden;
        }

        .login_register::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
          animation: pulse 10s infinite ease-in-out;
          z-index: 0;
        }

        /* Form đăng ký */
        .login_register form {
          background: rgba(255, 255, 255, 0.95);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(45, 135, 240, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
          animation: fadeIn 1s ease-out;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(45, 135, 240, 0.2);
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .login_register form:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }

        /* Tiêu đề */
        .login_register h2 {
          font-size: 32px;
          font-weight: 800;
          color: #2d87f0;
          margin-bottom: 30px;
          text-shadow: 2px 2px 6px rgba(45, 135, 240, 0.4);
          animation: glow 2s infinite alternate;
        }

        /* Input */
        .login_register input {
          width: 100%;
          padding: 14px;
          margin: 10px 0;
          font-size: 16px;
          border: 2px solid #e0e6ed;
          border-radius: 12px;
          outline: none;
          background: #f8fbff;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.4s ease;
        }

        .login_register input:focus {
          border-color: #2d87f0;
          box-shadow: 0 0 15px rgba(45, 135, 240, 0.6);
          transform: scale(1.02);
          background: #fff;
        }

        .login_register input:hover:not(:focus) {
          border-color: #a3bffa;
        }

        .login_register input::placeholder {
          color: #95a5a6;
          font-style: italic;
        }

        /* Nút đăng ký */
        .login_register button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(45deg, #2d87f0, #6bb9ff);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 600;
          box-shadow: 0 6px 20px rgba(45, 135, 240, 0.5);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .login_register button:hover {
          background: linear-gradient(45deg, #1b6ed1, #4a90e2);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(45, 135, 240, 0.7);
        }

        .login_register button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
          z-index: -1;
        }

        .login_register button:hover::before {
          width: 300px;
          height: 300px;
        }

        /* Container cho liên kết */
        .acc {
          display: flex;
          justify-content: center;
          margin: 15px 0;
        }

        /* Liên kết */
        .acc a {
          color: #2d87f0;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .acc a:hover {
          color: #1b6ed1;
          text-decoration: underline;
          transform: translateY(-2px);
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;