package com.example.webapphkh.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.json.JSONArray;
import org.json.JSONObject;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String generateReply(String prompt) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey; 

      
            JSONObject part = new JSONObject();
            part.put("text", prompt);

            JSONArray parts = new JSONArray();
            parts.put(part);

            JSONObject userMessage = new JSONObject();
            userMessage.put("role", "user");
            userMessage.put("parts", parts);

            JSONArray contents = new JSONArray();
            contents.put(userMessage);

            JSONObject requestBody = new JSONObject();
            requestBody.put("contents", contents);

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            // Gửi request và nhận phản hồi từ Gemini API
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            // Trích xuất nội dung trả lời
            JSONObject jsonResponse = new JSONObject(response.getBody());

            // Kiểm tra xem có kết quả không
            if (jsonResponse.has("candidates")) {
                return jsonResponse
                        .getJSONArray("candidates")
                        .getJSONObject(0)
                        .getJSONObject("content")
                        .getJSONArray("parts")
                        .getJSONObject(0)
                        .getString("text");
            } else {
                return "❌ Không có phản hồi từ AI.";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Lỗi khi gọi Gemini API: " + e.getMessage();
        }
    }
}
