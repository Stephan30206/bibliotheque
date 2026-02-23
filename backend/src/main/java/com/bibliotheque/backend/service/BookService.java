package com.bibliotheque.backend.service;

import com.bibliotheque.backend.entity.Book;
import com.bibliotheque.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service @RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public List<Book> getAll() { return bookRepository.findAll(); }
    public Book getById(Long id) { return bookRepository.findById(id).orElseThrow(); }
    public List<Book> search(String q) { return bookRepository.search(q); }
    public Book create(Book book) {
        if (book.getCreatedAt() == null) book.setCreatedAt(LocalDateTime.now());
        return bookRepository.save(book);
    }
    public Book update(Long id, Book updated) {
        Book book = getById(id);
        book.setTitle(updated.getTitle());
        book.setAuthor(updated.getAuthor());
        book.setIsbn(updated.getIsbn());
        book.setStock(updated.getStock());
        return bookRepository.save(book);
    }
    public void delete(Long id) { bookRepository.deleteById(id); }
}
