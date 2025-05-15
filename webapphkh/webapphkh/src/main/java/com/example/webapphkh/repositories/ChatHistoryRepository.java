package com.example.webapphkh.repositories;

import com.example.webapphkh.models.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {

    List<ChatHistory> findByUserIdOrderByCreatedAtDesc(Long userId);

    // ✅ THÊM MỚI: Xoá tất cả chat theo userId
    @Modifying
    @Transactional
    @Query("DELETE FROM ChatHistory c WHERE c.user.id = :userId")
    void deleteByUserId(Long userId);
}
