import React, { useEffect, useState, useRef } from "react";
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
  padding: 60px 30px;
  background: linear-gradient(135deg, #f8fcff 0%, #dbeeff 50%, #b3d4ff 100%); /* Cải tiến: Gradient đa chiều */
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(45, 135, 240, 0.15) 0%, transparent 70%);
    animation: ${pulse} 12s infinite ease-in-out; /* Cải tiến: Hiệu ứng pulse cho background */
    z-index: -1;
  }
`;

const Wrapper = styled.div`
  max-width: 1000px;
  margin: auto;
  background: rgba(255, 255, 255, 0.95); /* Cải tiến: Thêm độ trong suốt nhẹ */
  border-radius: 25px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15), inset 0 0 10px rgba(45, 135, 240, 0.1); /* Cải tiến: Bóng đổ lớn hơn */
  backdrop-filter: blur(8px); /* Cải tiến: Hiệu ứng kính mờ */
  border: 1px solid rgba(45, 135, 240, 0.2);
  animation: ${fadeIn} 1s ease-out;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px); /* Cải tiến: Nâng lên khi hover */
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled.h2`
  color: #007bff;
  text-align: center;
  font-size: 36px; /* Cải tiến: Tăng kích thước chữ */
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  text-shadow: 2px 2px 6px rgba(45, 135, 240, 0.4); /* Cải tiến: Thêm bóng chữ */
  animation: glow 2s infinite alternate;
  @keyframes glow {
    from { text-shadow: 2px 2px 6px rgba(45, 135, 240, 0.4); }
    to { text-shadow: 2px 2px 15px rgba(45, 135, 240, 0.8); }
  }
`;

const LessonList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); /* Cải tiến: Tăng kích thước tối thiểu của cột */
  gap: 20px;
  margin-top: 20px;
`;

const LessonButton = styled.button`
  background: linear-gradient(45deg, #4facfe, #00f2fe); /* Cải tiến: Gradient đa chiều */
  color: white;
  padding: 14px 18px;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); /* Cải tiến: Bóng đổ lớn hơn */
  cursor: pointer;
  transition: all 0.4s ease;
  animation: ${fadeIn} 0.5s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  &:hover {
    transform: translateY(-5px) scale(1.05); /* Cải tiến: Phóng to và nâng lên khi hover */
    background: linear-gradient(45deg, #1d9bf0, #00c4ff);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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
    height: 300px; /* Cải tiến: Hiệu ứng ripple khi hover */
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #007bff, #00c4ff); /* Cải tiến: Gradient thay vì màu đơn sắc */
  color: white;
  padding: 14px 25px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4); /* Cải tiến: Thêm bóng đổ */
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  &:hover {
    background: linear-gradient(45deg, #0056b3, #0096d6);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.6);
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
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

const Subtitle = styled.h3`
  margin-top: 20px;
  font-size: 26px; /* Cải tiến: Tăng kích thước chữ */
  color: #2c3e50; /* Cải tiến: Màu đậm hơn */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease;
`;

const QuestionBox = styled.div`
  margin-top: 20px;
  background: rgba(244, 250, 255, 0.9); /* Cải tiến: Thêm độ trong suốt nhẹ */
  border: 1px solid #cce5ff;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Cải tiến: Thêm bóng đổ */
  backdrop-filter: blur(5px); /* Cải tiến: Hiệu ứng kính mờ */
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  font-size: 16px;
  border: 2px solid #dfe6e9; /* Cải tiến: Viền mềm mại hơn */
  border-radius: 10px;
  margin-bottom: 10px;
  background: #f9fbfd;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
  outline: none;
  transition: all 0.3s ease;
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 12px rgba(0, 123, 255, 0.5);
    transform: scale(1.02);
    background: #fff;
  }
  &:hover:not(:focus) {
    border-color: #a3bffa;
  }
`;

const Feedback = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: ${({ correct }) => (correct ? "#2ecc71" : "#e74c3c")}; /* Cải tiến: Màu sắc nổi bật hơn */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease;
`;

const Navigation = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  animation: ${fadeIn} 0.5s ease;
`;

const ListeningSpeaking = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:8081/listening_lessons")
      .then((response) => setLessons(response.data))
      .catch((error) => console.error("Lỗi lấy bài nghe:", error));
  }, []);

  const loadLesson = (lessonId) => {
    axios
      .get(`http://localhost:8081/listening_questions/lesson/${lessonId}`)
      .then((response) => {
        setSelectedLesson(lessons.find((lesson) => lesson.id === lessonId));
        setQuestions(response.data);
        setCurrentQuestion(0);
        setUserAnswer("");
        setFeedback("");
      })
      .catch((error) => console.error("Lỗi lấy câu hỏi:", error));
  };

  const startListening = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Trình duyệt không hỗ trợ nhận dạng giọng nói!");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserAnswer(transcript);
      checkAnswer(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const checkAnswer = (answer) => {
    if (questions.length === 0) return;
    const correctAnswer = questions[currentQuestion]?.correctAnswer.toLowerCase().trim();
    setFeedback(answer.toLowerCase().trim() === correctAnswer ? "✅ Đúng!" : `❌ Sai! Đáp án đúng: ${correctAnswer}`);
  };

  return (
    <Container>
      <Wrapper>
        <Title>🎧 Luyện Nghe & Nói</Title>
        {!selectedLesson ? (
          <>
            <Subtitle>📖 Chọn bài nghe:</Subtitle>
            <LessonList>
              {lessons.map((lesson) => (
                <LessonButton key={lesson.id} onClick={() => loadLesson(lesson.id)}>
                  {lesson.title}
                </LessonButton>
              ))}
            </LessonList>
          </>
        ) : (
          <>
            <Subtitle>{selectedLesson.title}</Subtitle>
            <iframe
              width="100%"
              height="400px"
              src={selectedLesson.videoUrl.replace("watch?v=", "embed/")}
              title="Listening Video"
              frameBorder="0"
              allowFullScreen
              style={{ borderRadius: "10px", marginBottom: "20px" }}
            ></iframe>

            {questions.length > 0 && currentQuestion < questions.length && (
              <QuestionBox>
                <p><strong>Điền từ còn thiếu:</strong></p>
                <p style={{ fontSize: "18px" }}>
                  {questions[currentQuestion]?.question.replace("_____", "______")}
                </p>
                <Input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Nhập hoặc nói câu trả lời..."
                />
                <Button onClick={() => checkAnswer(userAnswer)}>Kiểm tra</Button>
                <Button onClick={startListening} disabled={isListening}>
                  {isListening ? "🎙️ Đang nghe..." : "🎤 Nói"}
                </Button>
                {feedback && (
                  <Feedback correct={feedback.includes("✅")}>{feedback}</Feedback>
                )}
                <Navigation>
                  <Button
                    onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                    disabled={currentQuestion === 0}
                  >⬅️ Câu trước</Button>
                  <Button
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                    disabled={currentQuestion >= questions.length - 1}
                  >Câu tiếp theo ➡️</Button>
                </Navigation>
              </QuestionBox>
            )}
            <Button onClick={() => setSelectedLesson(null)} style={{ marginTop: "20px" }}>
              🔙 Quay lại danh sách
            </Button>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default ListeningSpeaking;