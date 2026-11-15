package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.JournalEntry;
import com.example.demo.repository.JournalEntryRepository;

import java.util.List;

@RestController
@RequestMapping("/api/accounting")
@CrossOrigin(origins = "*")
public class AccountingController {

    @Autowired
    private JournalEntryRepository journalEntryRepository;

    @GetMapping("/journal-entries")
    public ResponseEntity<List<JournalEntry>> getAllJournalEntries() {
        return ResponseEntity.ok(journalEntryRepository.findAll());
    }
}