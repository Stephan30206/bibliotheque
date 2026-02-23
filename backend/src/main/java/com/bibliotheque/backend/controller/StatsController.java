package com.bibliotheque.backend.controller;

import com.bibliotheque.backend.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/stats") @RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class StatsController {
    private final StatsService statsService;

    @GetMapping("/top-books")
    public List<Map<String, Object>> topBooks() { return statsService.getTopBooks(); }

    @GetMapping("/top-users")
    public List<Map<String, Object>> topUsers() { return statsService.getTopUsers(); }

    @GetMapping("/general")
    public Map<String, Long> generalStats() { return statsService.getGeneralStats(); }
}
