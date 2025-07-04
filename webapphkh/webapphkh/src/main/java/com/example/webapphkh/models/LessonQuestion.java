package com.example.webapphkh.models;

import jakarta.persistence.*;

@Entity
@Table(name = "lesson_questions")
public class LessonQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false) 
    private Lesson lesson;  

    @Column(name = "question", nullable = false)
    private String question;

    @Column(name = "option_a", nullable = false)
    private String optionA;

    @Column(name = "option_b", nullable = false)
    private String optionB;

    @Column(name = "option_c", nullable = false)
    private String optionC;

    @Column(name = "option_d", nullable = false)
    private String optionD;

    @Column(name = "correct_option", nullable = false)
    private String correctOption;

    public LessonQuestion() {}

    public LessonQuestion(Lesson lesson, String question, String optionA, String optionB, String optionC, String optionD, String correctOption) {
        this.lesson = lesson;
        this.question = question;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctOption = correctOption;
    }

    // ✅ Getters và Setters đầy đủ
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Lesson getLesson() { return lesson; }  
    public void setLesson(Lesson lesson) { this.lesson = lesson; }  
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    
    public String getOptionA() { return optionA; }
    public void setOptionA(String optionA) { this.optionA = optionA; }
    
    public String getOptionB() { return optionB; }
    public void setOptionB(String optionB) { this.optionB = optionB; }
    
    public String getOptionC() { return optionC; }
    public void setOptionC(String optionC) { this.optionC = optionC; }
    
    public String getOptionD() { return optionD; }
    public void setOptionD(String optionD) { this.optionD = optionD; }
    
    public String getCorrectOption() { return correctOption; }
    public void setCorrectOption(String correctOption) { this.correctOption = correctOption; }
}
