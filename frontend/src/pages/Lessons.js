import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaBookOpen, FaStar, FaRocket } from "react-icons/fa";

const floatIn = keyframes`
  0% { opacity: 0; transform: translateY(20px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 40px 60px;
  background: linear-gradient(135deg, #2980b9 0%, #6dd5fa 50%, #ffffff 100%);
  background-size: cover;
  background-position: center; 
  background-attachment: fixed;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: ${floatIn} 1s ease;
  
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(90deg, #4a90e2, #ff6f61);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: #555;
  font-style: italic;
`;

const LessonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;

`;

const LessonCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  padding: 30px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
  transition: 0.4s ease;
  position: relative;
  overflow: hidden;
  animation: ${floatIn} 0.8s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  }
`;

const CardIcon = styled.div`
  font-size: 32px;
  margin-bottom: 16px;
  color: #4a90e2;
`;

const CardTitle = styled.h3`
  font-size: 22px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
`;

const CardInfo = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 6px;
`;

const Badge = styled.span`
  background-color: ${({ level }) =>
    level === "Beginner"
      ? "#8bc34a"
      : level === "Intermediate"
      ? "#ffc107"
      : "#e53935"};
  color: white;
  font-size: 14px;
  padding: 6px 14px;
  border-radius: 50px;
  font-weight: bold;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 12px;
`;

const PageButton = styled.button`
  padding: 12px 18px;
  border-radius: 30px;
  border: none;
  background: linear-gradient(90deg, #4a90e2, #6a11cb);
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transition: 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(90deg, #6a11cb, #2575fc);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lessonsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch("http://localhost:8081/lessons");
        const data = await response.json();
        setLessons(data);
      } catch (err) {
        console.error("Lỗi fetch:", err);
      }
    };
    fetchLessons();
  }, []);

  const indexOfLastLesson = currentPage * lessonsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
  const currentLessons = lessons.slice(indexOfFirstLesson, indexOfLastLesson);

  const getIcon = (level) => {
    switch (level) {
      case "Beginner": return <FaBookOpen />;
      case "Intermediate": return <FaStar />;
      case "Advanced": return <FaRocket />;
      default: return <FaBookOpen />;
    }
  };

  return (
    <Container>
      <Hero>
        <Title>✨ Khám phá các bài học tiếng Anh</Title>
        <Subtitle>Hành trình chinh phục Anh ngữ bắt đầu từ đây.</Subtitle>
      </Hero>

      <LessonGrid>
        {currentLessons.map((lesson) => (
          <LessonCard key={lesson.id} onClick={() => navigate(`/lesson/${lesson.id}`)}>
            <CardIcon>{getIcon(lesson.level)}</CardIcon>
            <CardTitle>{lesson.title}</CardTitle>
            <CardInfo>📌 Chủ đề: {lesson.topic}</CardInfo>
            <CardInfo>🎓 Cấp độ: {lesson.level}</CardInfo>
            <Badge level={lesson.level}>{lesson.level}</Badge>
          </LessonCard>
        ))}
      </LessonGrid>

      {lessons.length > lessonsPerPage && (
        <Pagination>
          <PageButton
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >⬅ Trước</PageButton>
          <PageButton
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(lessons.length / lessonsPerPage)}
          >Tiếp ➡</PageButton>
        </Pagination>
      )}
    </Container>
  );
};

export default Lessons;