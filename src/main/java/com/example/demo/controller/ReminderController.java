package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.DebtReminder;
import com.example.demo.entity.ReminderRule;
import com.example.demo.repository.DebtReminderRepository;
import com.example.demo.repository.ReminderRuleRepository;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "*")
public class ReminderController {

    @Autowired
    private DebtReminderRepository debtReminderRepository;

    @Autowired
    private ReminderRuleRepository reminderRuleRepository;

    // Lấy danh sách quy tắc nhắc nợ
    @GetMapping("/rules")
    public ResponseEntity<List<ReminderRule>> getReminderRules() {
        return ResponseEntity.ok(reminderRuleRepository.findAll());
    }

    // Lấy lịch sử nhắc nợ khách hàng
    @GetMapping("/history")
    public ResponseEntity<List<DebtReminder>> getDebtReminders() {
        return ResponseEntity.ok(debtReminderRepository.findAll());
    }
}