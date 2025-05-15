package com.example.webapphkh.services;

import com.example.webapphkh.models.ListeningLesson;
import com.example.webapphkh.repositories.ListeningLessonRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ListeningLessonService {
    @Autowired
    private ListeningLessonRepository lessonRepository;

    // ✅ Thêm @Transactional để giữ session khi lấy dữ liệu
    @Transactional
    public List<ListeningLesson> getAllLessons() {
        List<ListeningLesson> lessons = lessonRepository.findAll();
        lessons.forEach(lesson -> lesson.getQuestions().size()); 
        return lessons;
    }

    @Transactional
    public Optional<ListeningLesson> getLessonById(Long id) {
        Optional<ListeningLesson> lesson = lessonRepository.findById(id);
        lesson.ifPresent(l -> l.getQuestions().size()); 
        return lesson;
    }

    public ListeningLesson saveLesson(ListeningLesson lesson) {
        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }
}
