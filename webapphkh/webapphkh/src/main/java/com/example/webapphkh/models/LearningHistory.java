package com.example.webapphkh.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_history")
public class LearningHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    private Integer score;
    private String status;
    private LocalDateTime timestamp;

    @Column(name = "tense") // thêm dòng này để ánh xạ với cột tense trong DB
    private String tense;

    // ✅ Bỏ lesson nếu không dùng nữa
    // private Lesson lesson;

    // === GETTER/SETTER ===
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getTense() { return tense; }
    public void setTense(String tense) { this.tense = tense; }
}
