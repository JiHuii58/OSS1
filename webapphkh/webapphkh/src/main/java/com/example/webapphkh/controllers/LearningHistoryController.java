package com.example.webapphkh.controllers;

import com.example.webapphkh.models.LearningHistory;
import com.example.webapphkh.models.Question;
import com.example.webapphkh.models.User;
import com.example.webapphkh.services.LearningHistoryService;
import com.example.webapphkh.services.QuestionService;
import com.example.webapphkh.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/learning_history")
@CrossOrigin(origins = "http://localhost:3000")
public class LearningHistoryController {

    @Autowired
    private LearningHistoryService learningHistoryService;
    @Autowired
    private QuestionService questionService;
    @Autowired
    private UserService userService;

    @PostMapping("/save")
    public ResponseEntity<?> saveLearningHistory(@RequestBody Map<String, Object> resultData) {
        Object userIdObj = resultData.get("userId");
        if (userIdObj == null) {
            return ResponseEntity.badRequest().body("UserId not provided");
        }

        Long userId;
        try {
            userId = Long.parseLong(userIdObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid UserId format");
        }

        Optional<User> optionalUser = userService.getUserById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = optionalUser.get();
        Object questionsObject = resultData.get("questions");
        if (!(questionsObject instanceof List<?>)) {
            return ResponseEntity.badRequest().body("Questions data invalid or missing");
        }

        String tense = resultData.get("tense") != null ? resultData.get("tense").toString() : "unknown";

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> questions = (List<Map<String, Object>>) questionsObject;

        for (Map<String, Object> questionData : questions) {
            Object questionIdObj = questionData.get("id");
            if (questionIdObj == null) continue;

            Long questionId;
            try {
                questionId = Long.parseLong(questionIdObj.toString());
            } catch (NumberFormatException e) {
                continue;
            }

            int score = 0;
            Object scoreObj = questionData.get("score");
            if (scoreObj != null) {
                try {
                    score = Integer.parseInt(scoreObj.toString());
                } catch (NumberFormatException ignored) {}
            }

            Optional<Question> questionEntity = questionService.getQuestionById(questionId);
            if (questionEntity.isPresent()) {
                LearningHistory learningHistory = new LearningHistory();
                learningHistory.setUser(user);
                learningHistory.setQuestion(questionEntity.get());
                learningHistory.setScore(score);
                learningHistory.setStatus(score > 0 ? "completed" : "incomplete");
                learningHistory.setTense(tense);
                learningHistory.setTimestamp(LocalDateTime.now());
                learningHistoryService.saveLearningHistory(learningHistory);
            }
        }
        return ResponseEntity.ok().build();
    }

    // ✅ New endpoint để tổng hợp theo tense
    @GetMapping("/summary/{userId}")
public ResponseEntity<?> getSummaryByTense(@PathVariable Long userId) {
    List<LearningHistory> historyList = learningHistoryService.getLearningHistoryByUserId(userId);

    Map<String, List<LearningHistory>> groupedByTense = historyList.stream()
            .collect(Collectors.groupingBy(LearningHistory::getTense));

    List<Map<String, Object>> result = new ArrayList<>();

    for (Map.Entry<String, List<LearningHistory>> entry : groupedByTense.entrySet()) {
        String tense = entry.getKey();
        List<LearningHistory> records = entry.getValue();

        int totalAttempts = records.size();
        int totalCorrect = records.stream().mapToInt(LearningHistory::getScore).sum();
        int totalTimes = (int) records.stream().map(LearningHistory::getTimestamp).distinct().count();

        LocalDateTime lastAttemptTime = records.stream()
                .map(LearningHistory::getTimestamp)
                .max(LocalDateTime::compareTo)
                .orElse(null);

        Map<String, Object> summaryItem = new HashMap<>();
        summaryItem.put("tense", tense);
        summaryItem.put("totalAttempts", totalAttempts);
        summaryItem.put("totalCorrect", totalCorrect);
        summaryItem.put("totalTimes", totalTimes);
        summaryItem.put("lastAttemptTime", lastAttemptTime != null ? lastAttemptTime.toString() : "");

        result.add(summaryItem);
    }

    return ResponseEntity.ok(result);
}


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningHistory>> getLearningHistoryByUserId(@PathVariable Long userId) {
        List<LearningHistory> historyList = learningHistoryService.getLearningHistoryByUserId(userId);
        return ResponseEntity.ok(historyList);
    }
}