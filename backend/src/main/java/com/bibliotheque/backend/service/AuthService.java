package com.bibliotheque.backend.service;

import com.bibliotheque.backend.dto.*;
import com.bibliotheque.backend.entity.User;
import com.bibliotheque.backend.repository.UserRepository;
import com.bibliotheque.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public JwtResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Nom d'utilisateur déjà pris.");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email déjà utilisé.");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());   // ← explicite

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new JwtResponse(token, user.getRole(), user.getUsername(), user.getEmail(), user.getId(), user.getCreatedAt());
    }

    public JwtResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );
        User user = userRepository.findByUsername(req.getUsername()).orElseThrow();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new JwtResponse(token, user.getRole(), user.getUsername(), user.getEmail(), user.getId(), user.getCreatedAt());
    }
}
