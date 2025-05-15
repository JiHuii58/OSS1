import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
              url("https://source.unsplash.com/1600x900/?learning,education") no-repeat center center fixed;
  background-size: cover;
  color: white;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.5) 100%);
    z-index: 0;
  }
`;

const Sidebar = styled.div`
  width: ${({ isOpen }) => (isOpen ? "280px" : "80px")};
  background: linear-gradient(135deg, rgba(20, 20, 40, 0.95), rgba(0, 0, 20, 0.85));
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  padding: 25px 15px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.7);
  transition: width 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  z-index: 10;
  backdrop-filter: blur(5px);
`;

const Content = styled.div`
  flex: 1;
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? "280px" : "80px")};
  padding: 30px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 15px;
  color: #2c3e50;
  width: calc(100% - ${({ isSidebarOpen }) => (isSidebarOpen ? "280px" : "80px")}); /* Sửa: Đảm bảo chiều rộng chính xác */
  height: 100vh; /* Sửa: Đặt chiều cao bằng 100vh để khớp với Sidebar */
  overflow-y: auto;
  transition: margin-left 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(3px);
  box-sizing: border-box; /* Sửa: Đảm bảo padding không làm tăng kích thước */
`;

const ToggleButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  color: white;
  border: none;
  font-size: 28px;
  cursor: pointer;
  align-self: flex-end;
  margin-bottom: 25px;
  padding: 8px 12px;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.7);
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-top: 25px;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  justify-content: ${({ isSidebarOpen }) => (isSidebarOpen ? "flex-start" : "center")};
`;

const Logo = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transition: transform 0.3s ease;
  &:hover {
    transform: rotate(360deg);
  }
`;

const Title = styled.h2`
  color: #ffd700;
  font-size: 24px;
  font-weight: 800;
  display: ${({ isSidebarOpen }) => (isSidebarOpen ? "block" : "none")};
  margin-left: 15px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
  animation: glow 2s infinite alternate;
  @keyframes glow {
    from { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
    to { text-shadow: 0 0 15px rgba(255, 215, 0, 1); }
  }
`;

const NavButton = styled.button`
  width: 100%;
  padding: 12px 15px;
  margin: 8px 0;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  color: white;
  border: none;
  text-align: left;
  cursor: pointer;
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(90deg, #2980b9, #27ae60);
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
  }
`;

const LogoutButton = styled.button`
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(45deg, #c0392b, #e74c3c);
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(231, 76, 60, 0.5);
  }
`;

const ChatBoxContainer = styled.div`
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: ${({ isOpen }) => (isOpen ? "400px" : "60px")};
  height: ${({ isOpen }) => (isOpen ? "500px" : "60px")};
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
  z-index: 100;
`;

const ChatHeader = styled.div`
  background: linear-gradient(45deg, #ffcc00, #ff9900);
  padding: 12px;
  text-align: center;
  cursor: pointer;
  font-weight: 700;
  color: #fff;
  border-bottom: 3px solid rgba(255, 255, 255, 0.3);
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;
  &:hover {
    background: linear-gradient(45deg, #ff9900, #ffcc00);
  }
`;

const ChatMessages = styled.div`
  height: 350px;
  overflow-y: auto;
  padding: 15px;
  background: #ecf0f1;
  color: #2c3e50;
  font-family: 'Arial', sans-serif;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #3498db;
    border-radius: 4px;
  }
  p {
    padding: 10px;
    margin: 8px 0;
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease;
  }
  p.user {
    background: linear-gradient(90deg, #2ecc71, #27ae60);
    color: white;
    align-self: flex-end;
    max-width: 75%;
    font-weight: 600;
    margin-left: auto;
  }
  p.ai {
    background: linear-gradient(90deg, #3498db, #2980b9);
    color: white;
    align-self: flex-start;
    max-width: 75%;
    font-weight: 600;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ChatInput = styled.input`
  width: 75%;
  padding: 12px;
  border: none;
  outline: none;
  margin: 15px 0 0 15px;
  border-radius: 25px;
  font-size: 15px;
  color: #333;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  transition: box-shadow 0.3s ease;
  &:focus {
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  padding: 12px 20px;
  margin: 15px 15px 0 10px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(45deg, #27ae60, #2ecc71);
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(46, 204, 113, 0.5);
  }
`;

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!storedUser || !token) navigate("/login");
    else setUser(storedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message to state
    setMessages(prev => [
      ...prev,
      { text: input, sender: "user" }
    ]);

    // Send message to AI for a response
    try {
      const response = await axios.post("http://localhost:8081/chat_history/ask", {
        userId: user.id,
        message: input
      });

      // Add AI response
      setMessages(prev => [
        ...prev,
        { text: response.data.reply || "AI không trả lời", sender: "ai" }
      ]);
      setInput("");  // Clear the input after sending
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
      setMessages(prev => [
        ...prev,
        { text: "AI gặp lỗi, vui lòng thử lại!", sender: "ai" }
      ]);
    }
  };

  return (
    <Container>
      <Sidebar isOpen={isSidebarOpen}>
        <ToggleButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</ToggleButton>
        
        {isSidebarOpen && (
        <LogoContainer isSidebarOpen={isSidebarOpen} onClick={() => navigate("/dashboard")}>
        <Logo src="/logo.jpg" alt="Logo" />
        <Title isSidebarOpen={isSidebarOpen}>English Master</Title>
      </LogoContainer>
)}
        {isSidebarOpen && <h3>Xin chào, {user?.name || "Người dùng"}</h3>}
        <NavButton isOpen={isSidebarOpen} onClick={() => navigate("/profile")}>👤 Trang cá nhân</NavButton>
        <NavButton isOpen={isSidebarOpen} onClick={() => navigate("/vocabulary")}>📚 Học từ vựng</NavButton>
        <NavButton isOpen={isSidebarOpen} onClick={() => navigate("/lessons")}>📖 Danh sách bài học</NavButton>
        <NavButton isOpen={isSidebarOpen} onClick={() => navigate("/listening_speaking")}>🎧 Luyện nghe & nói</NavButton>
        <NavButton isOpen={isSidebarOpen} onClick={() => navigate("/test_quizz")}>📝 Bài tập kiểm tra</NavButton>
        <NavButton isOpen={isSidebarOpen} onClick={() => navigate("/learninghistory")}>📊 Lịch sử học tập</NavButton>

        <LogoutButton isOpen={isSidebarOpen} onClick={handleLogout}>Đăng xuất</LogoutButton>
      </Sidebar>

      <Content isSidebarOpen={isSidebarOpen}>
        {children}
      </Content>

      <ChatBoxContainer isOpen={chatOpen}>
        <ChatHeader onClick={() => setChatOpen(!chatOpen)}>💬 Chat với AI<span style={{float:'right',color:'red'}}>X</span></ChatHeader>
        <ChatMessages isOpen={chatOpen}>
          {messages.map((msg, i) => (
            <p key={i} className={msg.sender === "user" ? "user" : "ai"}>
                <strong>{msg.sender === "user" ? "User: " : "AI: "}</strong> {msg.text}
            </p>
          ))}
        </ChatMessages>
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
          <ChatInput
            isOpen={chatOpen}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Nhập tin nhắn..."
          />
          <SendButton onClick={handleSendMessage}>Gửi</SendButton>
        </div>
      </ChatBoxContainer>
    </Container>
  );
}

export default DashboardLayout;