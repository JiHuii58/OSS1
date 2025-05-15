import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Keyframes cho animation
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Container chính
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #6dd5fa 100%);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    animation: ${pulse} 10s infinite ease-in-out;
    z-index: 0;
  }
`;

// Form đăng nhập
const LoginForm = styled.form`
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(45, 135, 240, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: ${fadeIn} 1s ease-out;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(45, 135, 240, 0.2);
  z-index: 1;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  }
`;

// Tiêu đề
const Title = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: #2d87f0;
  margin-bottom: 30px;
  text-shadow: 2px 2px 6px rgba(45, 135, 240, 0.4);
  animation: glow 2s infinite alternate;
  @keyframes glow {
    from { text-shadow: 2px 2px 6px rgba(45, 135, 240, 0.4); }
    to { text-shadow: 2px 2px 15px rgba(45, 135, 240, 0.8); }
  }
`;

// Input
const Input = styled.input`
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
  &:focus {
    border-color: #2d87f0;
    box-shadow: 0 0 15px rgba(45, 135, 240, 0.6);
    transform: scale(1.02);
    background: #fff;
  }
  &:hover:not(:focus) {
    border-color: #a3bffa;
  }
  &::placeholder {
    color: #95a5a6;
    font-style: italic;
  }
`;

// Container cho các liên kết
const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
`;

// Liên kết
const Link = styled.a`
  color: #2d87f0;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  &:hover {
    color: #1b6ed1;
    text-decoration: underline;
    transform: translateY(-2px);
    display: inline-block;
  }
`;

// Nút đăng nhập
const LoginButton = styled.button`
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
  &:hover {
    background: linear-gradient(45deg, #1b6ed1, #4a90e2);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(45, 135, 240, 0.7);
  }
  &::before {
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
  &:hover::before {
    width: 300px;
    height: 300px;
  }
`;

// Cải tiến ToastContainer
const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    border-radius: 10px;
    font-family: 'Arial', sans-serif;
    font-weight: 600;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  .Toastify__toast--success {
    background: linear-gradient(45deg, #2ecc71, #27ae60);
  }
  .Toastify__toast--error {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8081/users/login", {
        email,
        password,
      });

      if (response.status === 200 && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        toast.success("Đăng nhập thành công!", { closeButton: false });
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error("Lỗi đăng nhập. Vui lòng thử lại!");
      }
    } catch (error) {
      toast.error("Sai tài khoản hoặc mật khẩu!", { closeButton: false });
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleLogin}>
        <Title>Đăng Nhập</Title>
        <Input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <LinkContainer>
          <Link href="/register">Đăng Ký</Link>
          <Link href="/forgot">Quên mật khẩu?</Link>
        </LinkContainer>
        <LoginButton type="submit">Đăng nhập</LoginButton>
      </LoginForm>
      <StyledToastContainer />
    </LoginContainer>
  );
};

export default LoginPage;