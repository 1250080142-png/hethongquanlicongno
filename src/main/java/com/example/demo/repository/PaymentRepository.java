package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Gọi Stored Procedure phân bổ FIFO trực tiếp trên SQL Server
    @Procedure(procedureName = "sp_AllocatePaymentFIFO")
    void executeAllocationFIFO(@Param("payment_id") Long paymentId);
}