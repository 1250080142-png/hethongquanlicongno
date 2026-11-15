package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class DatabaseService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Hàm gọi Stored Procedure phân bổ FIFO trong SQL Server
    public void executeFIFOAllocation(Long paymentId) {
        jdbcTemplate.execute("EXEC sp_AllocatePaymentFIFO " + paymentId);
    }
}