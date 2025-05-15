package com.example.webapphkh.repositories;

import com.example.webapphkh.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Tìm câu hỏi theo tense
    List<Question> findByTense(String tense);
    
    // Tìm câu hỏi theo lesson_id (nếu cần thiết)
    List<Question> findByLessonId(Long lessonId);
}
