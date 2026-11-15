package com.example.demo.controller;

import com.example.demo.service.DatabaseService;
import com.example.demo.entity.Payment;
import com.example.demo.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DatabaseService databaseService; // Chứa hàm gọi Stored Procedure phân bổ FIFO

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Chức năng mới cho Role 1: Lập phiếu thu tiền mới
    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody Payment payment) {
        payment.setUnallocatedAmount(payment.getAmount());
        payment.setPaymentDate(LocalDateTime.now()); // Sử dụng LocalDateTime đúng kiểu của entity
        Payment savedPayment = paymentRepository.save(payment);
        return ResponseEntity.ok(savedPayment);
    }

    // Role 1: Chạy Phân Bổ FIFO
    @PostMapping("/allocate")
    public ResponseEntity<?> allocatePayment(@RequestBody Map<String, Long> request) {
        Long paymentId = request.get("paymentId");
        try {
            databaseService.executeFIFOAllocation(paymentId);
            return ResponseEntity.ok("Thực hiện thuật toán phân bổ FIFO thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}