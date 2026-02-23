package com.bibliotheque.backend.repository;

import com.bibliotheque.backend.entity.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
    List<Borrowing> findByUserId(Long userId);
    List<Borrowing> findByUserIdAndReturnedAtIsNull(Long userId);

    @Query("SELECT b.book.id, b.book.title, b.book.author, COUNT(b) AS cnt " +
            "FROM Borrowing b GROUP BY b.book.id, b.book.title, b.book.author ORDER BY cnt DESC")
    List<Object[]> findTopBooks();

    @Query("SELECT b.user.id, b.user.username, COUNT(b) AS cnt " +
            "FROM Borrowing b GROUP BY b.user.id, b.user.username ORDER BY cnt DESC")
    List<Object[]> findTopUsers();

    boolean existsByUserIdAndBookIdAndReturnedAtIsNull(Long userId, Long bookId);

    long countByReturnedAtIsNull();
    List<Borrowing> findByReturnedAtIsNull();
}
