package com.example.webapphkh.services;

import com.example.webapphkh.models.Question;
import com.example.webapphkh.repositories.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    // Get all questions
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    // Get questions by tense
    public List<Question> getQuestionsByTense(String tense) {
        return questionRepository.findByTense(tense);
    }

    // Get questions by lesson_id
    public List<Question> getQuestionsByLessonId(Long lessonId) {
        return questionRepository.findByLessonId(lessonId);  // Find questions by lessonId
    }

    // Get a specific question by id
    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    // Save a new question
    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    // Delete a question
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}
