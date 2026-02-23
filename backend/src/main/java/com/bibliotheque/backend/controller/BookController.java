package com.bibliotheque.backend.controller;

import com.bibliotheque.backend.entity.Book;
import com.bibliotheque.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<Book> getAll() { return bookService.getAll(); }

    @GetMapping("/{id}")
    public Book getById(@PathVariable Long id) { return bookService.getById(id); }

    @GetMapping("/search")
    public List<Book> search(@RequestParam String q) { return bookService.search(q); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Book book) {
        try {
            return ResponseEntity.ok(bookService.create(book));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Book book) {
        try {
            return ResponseEntity.ok(bookService.update(id, book));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}