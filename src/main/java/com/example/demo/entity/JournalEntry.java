package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "journal_entries")
@Data
public class JournalEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entry_date")
    private LocalDateTime entryDate;

    private String description;

    @Column(name = "debit_account")
    private String debitAccount;

    @Column(name = "credit_account")
    private String creditAccount;

    private Double amount;

    @Column(name = "reference_id")
    private Long referenceId;
}