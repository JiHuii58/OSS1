package com.example.webapphkh.controllers;

import com.example.webapphkh.models.Question;
import com.example.webapphkh.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    // Get all questions
    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    // Get questions by tense
    @GetMapping("/tense/{tense}")
    public List<Question> getQuestionsByTense(@PathVariable String tense) {
        return questionService.getQuestionsByTense(tense);
    }

    // Get questions by lesson_id
    @GetMapping("/lesson/{lessonId}")  // New endpoint for lesson_id
    public List<Question> getQuestionsByLessonId(@PathVariable Long lessonId) {
        return questionService.getQuestionsByLessonId(lessonId);
    }

    // Get a specific question by id
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        Optional<Question> question = questionService.getQuestionById(id);
        if (question.isPresent()) {
            return ResponseEntity.ok(question.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new question
    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question savedQuestion = questionService.saveQuestion(question);
        return ResponseEntity.ok(savedQuestion);
    }

    // Delete a question
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
