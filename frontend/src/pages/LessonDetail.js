import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 60px 30px 60px 100px;
  background: linear-gradient(to right, #f5f7fa, #c3cfe2);
  box-sizing: border-box;
  background: linear-gradient(135deg, #2980b9 0%, #6dd5fa 50%, #ffffff 100%);
  background-size: cover;
  background-position: center; 
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin-left: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  padding: 50px;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 0.6s ease-in-out;
`;

const Title = styled.h1`
  font-size: 40px;
  color: #2c3e50;
  margin-bottom: 10px;
`;

const Subtitle = styled.h2`
  font-size: 20px;
  color: #34495e;
  margin-bottom: 30px;
  font-weight: 600;
`;

const Paragraph = styled.p`
  font-size: 18px;
  color: #333;
  line-height: 1.7;
  margin-bottom: 30px;
  background: #fdfdfd;
  padding: 20px;
  border-radius: 10px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.03);
`;

const SectionTitle = styled.h3`
  font-size: 22px;
  color: #e74c3c;
  margin-top: 40px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "\1F9E0";
    font-size: 24px;
  }
`;

const QuestionCard = styled.div`
  background: linear-gradient(to right, #ffffff, #f9f9f9);
  border: 1px solid #e3e3e3;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
    transform: scale(1.01);
  }
`;

const Question = styled.p`
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const Option = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: #f8f8f8;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #eaf3ff;
    border-color: #b3d4fc;
  }

  input {
    margin-right: 10px;
  }
`;

const Feedback = styled.div`
  margin-top: 10px;
  font-weight: bold;
  color: ${({ correct }) => (correct ? 'green' : 'red')};
  font-size: 16px;
`;

const Button = styled.button`
  padding: 14px 28px;
  margin: 30px 10px 10px 0;
  font-size: 16px;
  border: none;
  border-radius: 30px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 14px rgba(0,0,0,0.15);
  }
`;

const ScoreBoard = styled.div`
  text-align: right;
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const LessonDetail = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [reading, setReading] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      const res = await fetch(`http://localhost:8081/lessons/${id}`);
      const data = await res.json();
      setLesson(data);
    };

    const fetchReading = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8081/lesson_readings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReading(data[0]);
    };

    const fetchQuestions = async () => {
      const res = await fetch(`http://localhost:8081/lesson_questions/${id}`);
      const data = await res.json();
      setQuestions(data);
    };

    fetchLesson();
    fetchReading();
    fetchQuestions();
  }, [id]);

  const handleAnswer = (index, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [index]: option }));
  };

  const checkAnswers = () => setShowResults(true);

  const totalCorrect = questions.filter(
    (q, i) => selectedAnswers[i] === q.correctOption
  ).length;

  return (
    <Container>
      <ContentWrapper>
        {lesson && (
          <>
            <Title>{lesson.title}</Title>
            <Subtitle>{reading?.title}</Subtitle>
            {reading && <Paragraph>{reading.content}</Paragraph>}

            <SectionTitle>Câu hỏi ôn tập</SectionTitle>

            {showResults && (
              <ScoreBoard>
                🎯 Kết quả: {totalCorrect}/{questions.length} câu đúng
              </ScoreBoard>
            )}

            {questions.map((q, i) => (
              <QuestionCard key={i}>
                <Question>{q.question}</Question>
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <Option key={opt}>
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={opt}
                      checked={selectedAnswers[i] === opt}
                      onChange={() => handleAnswer(i, opt)}
                    /> {opt}. {q[`option${opt}`]}
                  </Option>
                ))}
                {showResults && (
                  <Feedback correct={selectedAnswers[i] === q.correctOption}>
                    {selectedAnswers[i] === q.correctOption
                      ? '✅ Chính xác!'
                      : `❌ Sai rồi! Đáp án đúng là ${q.correctOption}`}
                  </Feedback>
                )}
              </QuestionCard>
            ))}

            <Button onClick={checkAnswers}>✅ Kiểm tra kết quả</Button>
            <Button onClick={() => window.history.back()}>⬅ Quay lại</Button>
          </>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default LessonDetail;