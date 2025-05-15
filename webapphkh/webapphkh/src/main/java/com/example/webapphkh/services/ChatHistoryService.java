package com.example.webapphkh.services;

import com.example.webapphkh.models.ChatHistory;
import com.example.webapphkh.models.User;
import com.example.webapphkh.repositories.ChatHistoryRepository;
import com.example.webapphkh.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatHistoryService {

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    public ChatHistory saveChat(Long userId, String message, String reply) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        ChatHistory chat = new ChatHistory(user, message, reply);
        return chatHistoryRepository.save(chat);
    }

    public List<ChatHistory> getUserChatHistory(Long userId) {
        return chatHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void deleteUserChatHistory(Long userId) {
        chatHistoryRepository.deleteByUserId(userId);
    }
}
