import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 40px;
  background: linear-gradient(135deg, #84fab0, #8fd3f4);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-family: "Poppins", sans-serif;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
`;

const Dropdown = styled.select`
  padding: 10px 15px;
  font-size: 18px;
  border-radius: 10px;
  border: none;
  outline: none;
  background-color: #fff;
  color: #0077cc;
  font-weight: bold;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const FlashcardContainer = styled.div`
  perspective: 1200px;
  width: 350px;
  height: 220px;
  margin-bottom: 20px;
`;

const Flashcard = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.7s ease-in-out;
  cursor: pointer;
  ${(props) => (props.flipped ? "transform: rotateY(180deg);" : "")}
`;

const FlashcardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
  backface-visibility: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const FlashcardFront = styled(FlashcardSide)`
  background: linear-gradient(135deg, #0077cc, #00b4db);
  color: white;
`;

const FlashcardBack = styled(FlashcardSide)`
  background: #fff;
  color: #0077cc;
  transform: rotateY(180deg);
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const Button = styled.button`
  padding: 12px 18px;
  font-size: 18px;
  background-color: ${(props) => (props.primary ? "#ff7eb3" : "#ff4444")};
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background-color: ${(props) => (props.primary ? "#ff4d6d" : "#cc0000")};
  }
`;

const Vocabulary = () => {
  const [vocabulary, setVocabulary] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    try {
      const response = await fetch("http://localhost:8081/vocabulary");
      const data = await response.json();
      setVocabulary(data);
      setTopics([...new Set(data.map((word) => word.topic))]);
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    }
  };

  const filteredVocabulary = selectedTopic
    ? vocabulary.filter((word) => word.topic === selectedTopic)
    : vocabulary;

  const currentWord = filteredVocabulary[currentWordIndex] || {};

  return (
    <Container>
      <Title>📚 Vocabulary Learning</Title>

      <Dropdown
        value={selectedTopic}
        onChange={(e) => {
          setSelectedTopic(e.target.value);
          setCurrentWordIndex(0);
          setFlipped(false);
        }}
      >
        <option value="">Select a Topic</option>
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </Dropdown>

      {filteredVocabulary.length > 0 ? (
        <>
          <FlashcardContainer>
            <Flashcard flipped={flipped} onClick={() => setFlipped(!flipped)}>
              <FlashcardFront>{currentWord.word}</FlashcardFront>
              <FlashcardBack>{currentWord.meaning}</FlashcardBack>
            </Flashcard>
          </FlashcardContainer>

          <Controls>
            <Button
              primary
              onClick={() => setCurrentWordIndex((prev) => (prev - 1 + filteredVocabulary.length) % filteredVocabulary.length)}
              disabled={filteredVocabulary.length <= 1}
            >
              ⬅ Previous
            </Button>
            <Button onClick={() => {
              const utterance = new SpeechSynthesisUtterance(currentWord.word);
              utterance.lang = "en-US";
              speechSynthesis.speak(utterance);
            }}>
              🔊 Pronounce
            </Button>
            <Button
              primary
              onClick={() => setCurrentWordIndex((prev) => (prev + 1) % filteredVocabulary.length)}
              disabled={filteredVocabulary.length <= 1}
            >
              Next ➡
            </Button>
          </Controls>
        </>
      ) : (
        <p>No words available for this topic.</p>
      )}
    </Container>
  );
};

export default Vocabulary;