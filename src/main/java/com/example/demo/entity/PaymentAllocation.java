package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_allocations")
@Data
public class PaymentAllocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "invoice_id")
    private Long invoiceId;

    @Column(name = "allocated_amount")
    private Double allocatedAmount;

    @Column(name = "allocated_at")
    private LocalDateTime allocatedAt;
}