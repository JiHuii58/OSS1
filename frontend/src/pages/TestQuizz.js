import React, { useState, useEffect, useCallback } from 'react';  // Thêm useCallback
import axios from 'axios';
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
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e6ff 50%, #b3d4ff 100%); /* Cải tiến: Gradient đa chiều */
  padding: 40px 30px;
  font-family: 'Poppins', sans-serif; /* Cải tiến: Font hiện đại hơn */
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

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 36px; /* Cải tiến: Tăng kích thước chữ */
  text-align: center;
  text-shadow: 2px 2px 6px rgba(45, 135, 240, 0.4); /* Cải tiến: Thêm bóng chữ */
  animation: ${fadeIn} 1s ease-out;
  background: linear-gradient(to right, #2c3e50, #3498db); /* Cải tiến: Gradient cho chữ */
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: glow 2s infinite alternate;
  @keyframes glow {
    from { text-shadow: 2px 2px 6px rgba(45, 135, 240, 0.4); }
    to { text-shadow: 2px 2px 15px rgba(45, 135, 240, 0.8); }
  }
`;

const Select = styled.select`
  padding: 12px;
  margin-bottom: 30px;
  font-size: 16px;
  border: 2px solid #dfe6e9; /* Cải tiến: Viền mềm mại hơn */
  border-radius: 10px;
  background: #f9fbfd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 12px rgba(52, 152, 219, 0.5);
    transform: scale(1.02);
  }
  &:hover:not(:focus) {
    border-color: #a3bffa;
  }
`;

const QuestionBox = styled.div`
  background: rgba(255, 255, 255, 0.95); /* Cải tiến: Thêm độ trong suốt nhẹ */
  border: 1px solid #cce5ff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Cải tiến: Thêm bóng đổ */
  backdrop-filter: blur(5px); /* Cải tiến: Hiệu ứng kính mờ */
  animation: ${fadeIn} 0.5s ease;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
`;

const QuestionText = styled.p`
  font-weight: 700;
  font-size: 18px; /* Cải tiến: Tăng kích thước chữ */
  color: #2c3e50;
  margin-bottom: 10px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
`;

const AnswerInput = styled.input`
  padding: 12px;
  width: 100%;
  margin-top: 8px;
  font-size: 16px;
  border: 2px solid #dfe6e9; /* Cải tiến: Viền mềm mại hơn */
  border-radius: 10px;
  background: #f9fbfd;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
  outline: none;
  transition: all 0.3s ease;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 12px rgba(52, 152, 219, 0.5);
    transform: scale(1.02);
    background: #fff;
  }
  &:hover:not(:focus) {
    border-color: #a3bffa;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(45deg, #3498db, #6bb9ff); /* Cải tiến: Gradient thay vì màu đơn sắc */
  color: white;
  border: none;
  padding: 14px 25px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 25px;
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.5); /* Cải tiến: Thêm bóng đổ */
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  &:hover {
    background: linear-gradient(45deg, #2980b9, #4a90e2);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(52, 152, 219, 0.7);
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

const ResultBox = styled.div`
  margin-top: 30px;
  padding: 25px;
  background: rgba(236, 240, 241, 0.9); /* Cải tiến: Thêm độ trong suốt nhẹ */
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Cải tiến: Thêm bóng đổ */
  backdrop-filter: blur(5px); /* Cải tiến: Hiệu ứng kính mờ */
  animation: ${fadeIn} 0.5s ease;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
`;

const CorrectAnswer = styled.p`
  margin-top: 10px;
  font-size: 16px; /* Cải tiến: Tăng kích thước chữ */
  font-weight: 600;
  color: #2ecc71; /* Cải tiến: Màu sắc nổi bật hơn */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease;
`;

const WrongAnswer = styled.p`
  margin-top: 10px;
  font-size: 16px; /* Cải tiến: Tăng kích thước chữ */
  font-weight: 600;
  color: #e74c3c; /* Cải tiến: Màu sắc nổi bật hơn */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease;
`;
function TestQuiz() {
  const [selectedTense, setSelectedTense] = useState('present_simple');
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Định nghĩa fetchQuestions với useCallback
  const fetchQuestions = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8081/questions/tense/${selectedTense}`);
      setQuestions(response.data);
      setUserAnswers([]); // reset answers
      setIsSubmitted(false);
      setScore(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, [selectedTense]); // Chỉ thay đổi khi selectedTense thay đổi

  useEffect(() => {
    fetchQuestions(); // Gọi hàm fetchQuestions
  }, [fetchQuestions]); // Đảm bảo rằng fetchQuestions được đưa vào dependency array

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a =>
          a.questionId === questionId ? { ...a, answer } : a
        );
      }
      return [...prev, { questionId, answer }];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let correctAnswers = 0;
    const questionsPayload = questions.map((q) => {
      const userAnswerObj = userAnswers.find((a) => a.questionId === q.id);
      const userAnswer = userAnswerObj?.answer || '';
      const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ? 1 : 0;
      if (isCorrect) correctAnswers++;

      return {
        id: q.id,
        lessonId: q.lesson_id || 1,
        score: isCorrect,
      };
    });

    setScore(correctAnswers);
    setIsSubmitted(true);

    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const progressData = {
      userId,
      score: correctAnswers,
      tense: selectedTense,
      status: 'completed',
      questions: questionsPayload
    };

    try {
      await axios.post(`http://localhost:8081/learning_history/save`, progressData);
    } catch (error) {
      console.error("Error saving test result:", error);
    }
  };

  return (
    <Container>
      <Title>📝 Chọn thì ngữ pháp để làm bài:</Title>
      <Select value={selectedTense} onChange={(e) => setSelectedTense(e.target.value)}>
        <option value="present_simple">Present Simple</option>
        <option value="past_simple">Past Simple</option>
        <option value="future_simple">Future Simple</option>
        <option value="present_continuous">Present Continuous</option>
        <option value="past_continuous">Past Continuous</option>
        <option value="future_continuous">Future Continuous</option>
        <option value="present_perfect">Present Perfect</option>
        <option value="past_perfect">Past Perfect</option>
        <option value="future_perfect">Future Perfect</option>
      </Select>

      <form onSubmit={handleSubmit}>
        {questions.map((q) => {
          const userAnswer = userAnswers.find((a) => a.questionId === q.id)?.answer || '';
          const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

          return (
            <QuestionBox key={q.id}>
              <QuestionText>{q.questionText}</QuestionText>
              <AnswerInput
                type="text"
                value={userAnswer}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                disabled={isSubmitted}
              />

              {isSubmitted && (
                <>
                  {isCorrect ? (
                    <CorrectAnswer>✅ Đúng</CorrectAnswer>
                  ) : (
                    <WrongAnswer>❌ Sai – Đáp án đúng: <strong>{q.correctAnswer}</strong></WrongAnswer>
                  )}
                </>
              )}
            </QuestionBox>
          );
        })}

        {!isSubmitted && <SubmitButton type="submit">Nộp bài</SubmitButton>}
      </form>

      {isSubmitted && (
        <ResultBox>
          <h3>🎉 Kết quả: {score} / {questions.length} câu đúng</h3>
        </ResultBox>
      )}
    </Container>
  );
}

export default TestQuiz;