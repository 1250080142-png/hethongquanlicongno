package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "receipt_number")
    private String receiptNumber;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    private Double amount;

    @Column(name = "unallocated_amount")
    private Double unallocatedAmount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "reference_code")
    private String referenceCode;
}