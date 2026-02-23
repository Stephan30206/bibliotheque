package com.bibliotheque.backend.service;

import com.bibliotheque.backend.repository.BorrowingRepository;
import com.bibliotheque.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service @RequiredArgsConstructor
public class StatsService {
    private final BorrowingRepository borrowingRepository;
    private final BookRepository bookRepository;

    public Map<String, Long> getGeneralStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalBooks", bookRepository.count());
        stats.put("availableBooks", bookRepository.countByStockGreaterThan(0));
        stats.put("unavailableBooks", bookRepository.countByStockEquals(0));
        stats.put("totalBorrowings", borrowingRepository.count());
        stats.put("activeBorrowings", borrowingRepository.countByReturnedAtIsNull());
        return stats;
    }

    public List<Map<String, Object>> getTopBooks() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : borrowingRepository.findTopBooks()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", row[0]); m.put("title", row[1]);
            m.put("author", row[2]); m.put("count", row[3]);
            result.add(m);
        }
        return result;
    }

    public List<Map<String, Object>> getTopUsers() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : borrowingRepository.findTopUsers()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", row[0]); m.put("username", row[1]); m.put("count", row[2]);
            result.add(m);
        }
        return result;
    }
}
