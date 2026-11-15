package com.example.demo.controller;

import com.example.demo.entity.Invoice;
import com.example.demo.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:3000")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // Role 1: Lập Hóa Đơn Mới
    @PostMapping
    public ResponseEntity<?> createInvoice(@RequestBody Invoice invoice) {
        if (invoice.getPaidAmount() == null) {
            invoice.setPaidAmount(0.0); // Hoặc 0.0 dựa trên kiểu Double của entity
        }
        if (invoice.getStatus() == null) {
            invoice.setStatus("CHO_THANH_TOAN");
        }
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return ResponseEntity.ok(savedInvoice);
    }
}