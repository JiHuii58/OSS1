package com.example.webapphkh.repositories;

import com.example.webapphkh.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
     Optional<User> findByVerificationCode(String code);
}
