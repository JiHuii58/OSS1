package com.example.webapphkh.repositories;

import com.example.webapphkh.models.LessonQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface LessonQuestionRepository extends JpaRepository<LessonQuestion, Long> {

    @Query("SELECT q FROM LessonQuestion q WHERE q.lesson.id = :lessonId")  // 🔥 Sửa lại truy vấn
    List<LessonQuestion> findByLessonId(@Param("lessonId") Long lessonId);
}
