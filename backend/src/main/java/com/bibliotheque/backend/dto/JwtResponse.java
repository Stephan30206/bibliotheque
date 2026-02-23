package com.bibliotheque.backend.dto;

import lombok.*;
@Data @AllArgsConstructor public class JwtResponse {
    private String token;
    private String role;
    private String username;
    private String email;
    private Long id;
    private java.time.LocalDateTime createdAt;
}
