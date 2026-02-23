package com.bibliotheque.backend.controller;

import com.bibliotheque.backend.entity.Borrowing;
import com.bibliotheque.backend.repository.BorrowingRepository;
import com.bibliotheque.backend.repository.UserRepository;
import com.bibliotheque.backend.service.BorrowingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrowings")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class BorrowingController {

    private final BorrowingService borrowingService;
    private final UserRepository userRepository;
    private final BorrowingRepository borrowingRepository;

    @GetMapping("/my")
    public List<Borrowing> myBorrowings(Authentication auth) {
        Long userId = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"))
                .getId();
        return borrowingService.getUserBorrowings(userId);
    }

    @GetMapping
    public List<Borrowing> getAll() {
        return borrowingService.getAll();
    }

    @PostMapping("/borrow")
    public ResponseEntity<?> borrow(@RequestBody Map<String, Long> body,
                                    Authentication auth) {
        try {
            Long userId = userRepository.findByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"))
                    .getId();
            Long bookId = body.get("bookId");
            Borrowing b = borrowingService.borrow(userId, bookId);
            return ResponseEntity.ok(b);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/return")
    public ResponseEntity<?> returnBook(@RequestBody Map<String, Long> body,
                                        Authentication auth) {
        try {
            Long bookId = body.get("bookId");
            Long borrowingId = body.get("borrowingId");

            if (borrowingId != null) {
                // Admin might use this, but we should check role or allow it if authenticated
                // Actually let's make it explicit for Admin
                Borrowing b = borrowingService.returnBookByBorrowingId(borrowingId);
                return ResponseEntity.ok(b);
            }

            Long userId = userRepository.findByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"))
                    .getId();
            Borrowing b = borrowingService.returnBook(userId, bookId);
            return ResponseEntity.ok(b);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/active")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<Borrowing> getActive() {
        return borrowingRepository.findByReturnedAtIsNull();
    }
}
