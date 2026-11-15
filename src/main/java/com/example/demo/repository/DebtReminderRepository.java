package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.DebtReminder;
import java.util.List;

@Repository
public interface DebtReminderRepository extends JpaRepository<DebtReminder, Long> {
    List<DebtReminder> findByCustomerId(Long customerId);
}