package com.example.webapphkh.controllers;

import com.example.webapphkh.dtos.ChatRequest;
import com.example.webapphkh.models.ChatHistory;
import com.example.webapphkh.services.ChatHistoryService;
import com.example.webapphkh.services.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat_history")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatHistoryController {

    @Autowired private ChatHistoryService chatHistoryService;
    @Autowired private GeminiService geminiService;

    @PostMapping("/ask")
    public ChatHistory askAI(@RequestBody ChatRequest request) {
        String reply = geminiService.generateReply(request.getMessage());
        return chatHistoryService.saveChat(request.getUserId(), request.getMessage(), reply);
    }

    @GetMapping("/{userId}")
    public List<ChatHistory> getChatByUser(@PathVariable Long userId) {
        return chatHistoryService.getUserChatHistory(userId);
    }

    @DeleteMapping("/delete/{userId}")
    public String deleteChatByUser(@PathVariable Long userId) {
        chatHistoryService.deleteUserChatHistory(userId);
        return "Đã xoá toàn bộ lịch sử chat của user " + userId;
    }
}
