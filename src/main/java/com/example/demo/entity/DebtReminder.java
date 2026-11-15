package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "debt_reminders")
@Data
public class DebtReminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "invoice_id")
    private Long invoiceId;

    @Column(name = "reminder_date")
    private LocalDateTime reminderDate;

    private String channel; // EMAIL, SMS

    private String status;  // SENT, PENDING
}