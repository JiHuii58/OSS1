import React from "react";
import styled, { keyframes } from "styled-components";

// Định nghĩa keyframes cho animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; 
  width: 100%;
  background: linear-gradient(135deg, #2980b9 0%, #6dd5fa 50%, #ffffff 100%);
  background-size: cover;
  background-position: center; 
  color: white;
  padding: 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 1.2s ease-out;
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    animation: wave 15s infinite ease-in-out;
    z-index: 0;
  }
  @keyframes wave {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
    50% { transform: scale(1.1) rotate(5deg); opacity: 0.8; }
  }
`;

const WelcomeMessage = styled.h2`
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 25px;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
  background: linear-gradient(to right, #ffd700, #ff8c00); /* Đổi màu gradient: từ vàng đậm đến cam nhạt */
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: glowText 2s infinite alternate;
  position: relative;
  z-index: 1;
  @keyframes glowText {
    from { text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4); }
    to { text-shadow: 3px 3px 20px rgba(255, 140, 0, 0.8); } /* Đổi màu text-shadow để phù hợp với gradient mới */
  }
`;
const CallToAction = styled.p`
  font-size: 20px;
  font-style: italic;
  margin-bottom: 35px;
  color:black;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  animation: slideUp 1.5s ease-out;
  position: relative;
  z-index: 1;
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Avatar = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #ffcc00;
  margin-bottom: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  transition: all 0.5s ease;
  position: relative;
  z-index: 1;
  &:hover {
    transform: scale(1.15) rotate(10deg);
    box-shadow: 0 15px 40px rgba(255, 204, 0, 0.6);
  }
  &::after {
    content: '';
    position: absolute;
    top: -15px;
    left: -15px;
    width: calc(100% + 30px);
    height: calc(100% + 30px);
    border-radius: 50%;
    border: 2px dashed #ffcc00;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  &:hover::after {
    opacity: 0.7;
    animation: spin 3s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 25px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35), inset 0 0 15px rgba(255, 255, 255, 0.2);
  width: 85%;
  max-width: 650px;
  margin-top: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  position: relative;
  z-index: 1;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.5);
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #ffcc00, #ffeb3b);
  color: #1a1a1a;
  font-size: 20px;
  font-weight: 700;
  padding: 14px 30px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 25px;
  box-shadow: 0 6px 20px rgba(255, 204, 0, 0.5);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  &:hover {
    background: linear-gradient(45deg, #ffeb3b, #ffcc00);
    transform: scale(1.1) translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 204, 0, 0.8);
  }
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.4);
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
function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Container>
      {user?.profileImage && (
        <Avatar
          src={`http://localhost:8081${user.profileImage}`}
          alt="User Avatar"
        />
      )}
      <WelcomeMessage>
        Chào mừng {user?.name || "bạn"} đến với English Master!
      </WelcomeMessage>
      <CallToAction>
        "Mỗi ngày một chút, giấc mơ nói tiếng Anh trôi chảy sẽ thành hiện thực!"
      </CallToAction>
      <Card>
        <h3 style={{color:"black"}}>🚀 Bắt đầu hành trình học tiếng Anh ngay hôm nay!</h3>
        <p style={{color:"black"}}>Chinh phục từ vựng, luyện nghe, và giao tiếp tự tin.</p>
      </Card>
      <Button>Bắt đầu học đi nào!</Button>
    </Container>
  );
}

export default Dashboard;