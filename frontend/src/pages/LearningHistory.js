import { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";

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
  50% { transform: scale(1.02); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #6dd5fa 100%); /* Cải tiến: Gradient đa chiều */
  color: white;
  padding: 50px 30px;
  text-align: center;
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
    animation: ${pulse} 12s infinite ease-in-out; /* Cải tiến: Hiệu ứng pulse cho background */
    z-index: -1;
  }
`;

const Title = styled.h2`
  font-size: 36px; /* Cải tiến: Tăng kích thước chữ */
  font-weight: 800;
  color: #ffcc00;
  margin-bottom: 40px;
  text-transform: uppercase;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5); /* Cải tiến: Bóng chữ lớn hơn */
  animation: ${fadeIn} 1s ease-out;
  background: linear-gradient(to right, #ffcc00, #ff5733); /* Cải tiến: Gradient cho chữ */
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: glow 2s infinite alternate;
  @keyframes glow {
    from { text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5); }
    to { text-shadow: 3px 3px 20px rgba(255, 87, 51, 0.8); }
  }
`;

const HistoryCard = styled.div`
  background: rgba(255, 255, 255, 0.15); /* Cải tiến: Độ trong suốt nhẹ hơn */
  backdrop-filter: blur(12px); /* Cải tiến: Tăng độ mờ */
  margin: 20px auto;
  padding: 25px;
  border-radius: 20px;
  max-width: 650px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1); /* Cải tiến: Bóng đổ lớn hơn */
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${fadeIn} 0.8s ease-in-out;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px); /* Cải tiến: Nâng lên khi hover */
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
  }
`;

const LessonTitle = styled.h3`
  font-size: 24px; /* Cải tiến: Tăng kích thước chữ */
  color: #ffdd57;
  margin-bottom: 15px;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.5s ease;
`;

const ProgressInfo = styled.p`
  font-size: 16px;
  margin: 8px 0;
  color: #f0f8ff; /* Cải tiến: Màu sáng hơn */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.5s ease;
`;

const ProgressBar = styled.div`
  background: rgba(0, 0, 0, 0.5); /* Cải tiến: Độ trong suốt nhẹ */
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  height: 25px; /* Cải tiến: Tăng chiều cao */
  margin-top: 15px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3);
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ffcc00, #ff5733); /* Cải tiến: Gradient đa chiều */
  width: ${(props) => props.progress}%;
  transition: width 1s ease-in-out;
  box-shadow: 0 0 10px rgba(255, 87, 51, 0.8); /* Cải tiến: Thêm ánh sáng */
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shine 2s infinite linear;
  }
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const NoDataMessage = styled.p`
  font-size: 24px; /* Cải tiến: Tăng kích thước chữ */
  font-weight: 700;
  color: #eee;
  margin-top: 30px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
  animation: ${fadeIn} 0.5s ease;
`;

function LearningHistory() {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    fetchSummary(userId);
  }, []);

  const fetchSummary = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8081/learning_history/summary/${userId}`);
      setSummaryData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Lỗi khi tải dữ liệu lịch sử học tập");
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Tiến độ học tập của bạn</Title>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p>{error}</p>
      ) : summaryData.length === 0 ? (
        <NoDataMessage>Không có dữ liệu lịch sử học tập</NoDataMessage>
      ) : (
        summaryData.map((entry) => {
          const percent = Math.round((entry.totalCorrect / entry.totalAttempts) * 100);
          return (
            <HistoryCard key={entry.tense}>
              <LessonTitle>Bài Kiểm Tra: {entry.tense.replace("_", " ")}</LessonTitle>
              <ProgressInfo>Điểm trung bình: {Math.round(entry.totalCorrect / (entry.totalAttempts / 10))} / 10</ProgressInfo>
              <ProgressInfo>Số lần làm bài: {entry.totalAttempts / 10}</ProgressInfo>
              <ProgressInfo>Lần làm gần nhất: {entry.lastAttemptTime}</ProgressInfo>
              <ProgressBar>
                <ProgressBarFill progress={percent} />
              </ProgressBar>
            </HistoryCard>
          );
        })
      )}
    </Container>
  );
}

export default LearningHistory;