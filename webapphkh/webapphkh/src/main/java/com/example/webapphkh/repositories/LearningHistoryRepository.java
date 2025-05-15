package com.example.webapphkh.repositories;

import com.example.webapphkh.models.LearningHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningHistoryRepository extends JpaRepository<LearningHistory, Long> {

  
    List<LearningHistory> findAllByUserId(Long userId);
}
