package com.example.webapphkh.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "listening_questions")  
public class ListeningQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonBackReference  
    private ListeningLesson lesson;

    @Column(nullable = false)
    private String question;

    @Column(name = "correct_answer", nullable = false)  // Đảm bảo tên cột đúng
    private String correctAnswer;

    // Constructors
    public ListeningQuestion() {}

    public ListeningQuestion(ListeningLesson lesson, String question, String correctAnswer) {
        this.lesson = lesson;
        this.question = question;
        this.correctAnswer = correctAnswer;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ListeningLesson getLesson() { return lesson; }
    public void setLesson(ListeningLesson lesson) { this.lesson = lesson; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
}
