package com.bibliotheque.backend.service;

import com.bibliotheque.backend.entity.*;
import com.bibliotheque.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowingService {

    private final BorrowingRepository borrowingRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public Borrowing borrow(Long userId, Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Livre introuvable."));

        if (book.getStock() <= 0)
            throw new RuntimeException("Livre non disponible (stock épuisé).");

        if (borrowingRepository.existsByUserIdAndBookIdAndReturnedAtIsNull(userId, bookId))
            throw new RuntimeException("Vous avez déjà emprunté ce livre.");

        book.setStock(book.getStock() - 1);
        bookRepository.save(book);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable."));

        // ← Construire sans @Builder pour éviter les nulls
        Borrowing borrowing = new Borrowing();
        borrowing.setUser(user);
        borrowing.setBook(book);
        borrowing.setBorrowedAt(LocalDateTime.now());

        return borrowingRepository.save(borrowing);
    }

    @Transactional
    public Borrowing returnBook(Long userId, Long bookId) {
        Borrowing borrowing = borrowingRepository
                .findByUserIdAndReturnedAtIsNull(userId).stream()
                .filter(b -> b.getBook().getId().equals(bookId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Aucun emprunt actif trouvé."));

        borrowing.setReturnedAt(LocalDateTime.now());

        Book book = borrowing.getBook();
        book.setStock(book.getStock() + 1);
        bookRepository.save(book);

        return borrowingRepository.save(borrowing);
    }

    @Transactional
    public Borrowing returnBookByBorrowingId(Long borrowingId) {
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new RuntimeException("Emprunt introuvable."));

        if (borrowing.getReturnedAt() != null)
            throw new RuntimeException("Ce livre a déjà été retourné.");

        borrowing.setReturnedAt(LocalDateTime.now());

        Book book = borrowing.getBook();
        book.setStock(book.getStock() + 1);
        bookRepository.save(book);

        return borrowingRepository.save(borrowing);
    }

    public List<Borrowing> getUserBorrowings(Long userId) {
        return borrowingRepository.findByUserId(userId);
    }

    public List<Borrowing> getAll() {
        return borrowingRepository.findAll();
    }
}
