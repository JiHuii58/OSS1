package com.example.webapphkh.services;

import com.example.webapphkh.models.LearningHistory;
import com.example.webapphkh.repositories.LearningHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningHistoryService {

    @Autowired
    private LearningHistoryRepository learningHistoryRepository;

    // Create or Update a learning history
    public LearningHistory saveLearningHistory(LearningHistory learningHistory) {
        return learningHistoryRepository.save(learningHistory);
    }

    // Get all learning history records
    public List<LearningHistory> getAllLearningHistory() {
        return learningHistoryRepository.findAll();
    }

    // Get learning history by userId
    public List<LearningHistory> getLearningHistoryByUserId(Long userId) {
        return learningHistoryRepository.findAllByUserId(userId); // Assumes a custom query is defined
    }

    // Get learning history by ID
    public Optional<LearningHistory> getLearningHistoryById(Long id) {
        return learningHistoryRepository.findById(id);
    }

    // Delete learning history by ID
    public void deleteLearningHistory(Long id) {
        learningHistoryRepository.deleteById(id);
    }
}
