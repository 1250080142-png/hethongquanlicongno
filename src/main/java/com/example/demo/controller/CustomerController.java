package com.example.demo.controller;

import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // API Đăng ký tài khoản mới (Mặc định phân quyền là USER)
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody Customer newCustomer) {
        if (newCustomer.getUsername() != null && customerRepository.existsByUsername(newCustomer.getUsername())) {
            return ResponseEntity.badRequest().body("❌ Tên tài khoản đã tồn tại!");
        }

        // Cố định phân quyền chỉ còn USER
        newCustomer.setRole("USER");
        if (newCustomer.getCode() == null || newCustomer.getCode().isEmpty()) {
            newCustomer.setCode("KH" + System.currentTimeMillis() % 10000);
        }
        if (newCustomer.getName() == null || newCustomer.getName().isEmpty()) {
            newCustomer.setName(newCustomer.getUsername());
        }
        newCustomer.setCreatedAt(java.time.LocalDateTime.now());

        Customer saved = customerRepository.save(newCustomer);
        return ResponseEntity.ok(saved);
    }

    // API Đăng nhập chung cho cả ADMIN và USER
    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(@RequestBody Customer loginData) {
        // Cho phép tài khoản cứng admin đăng nhập nhanh
        if ("admin".equalsIgnoreCase(loginData.getUsername()) && "admin123".equals(loginData.getPassword())) {
            Customer adminUser = new Customer();
            adminUser.setId(0L);
            adminUser.setUsername("admin");
            adminUser.setRole("ADMIN");
            adminUser.setName("Quản trị viên hệ thống");
            return ResponseEntity.ok(adminUser);
        }

        Customer customer = customerRepository.findByUsername(loginData.getUsername());
        if (customer == null || (customer.getPassword() != null && !customer.getPassword().equals(loginData.getPassword()))) {
            return ResponseEntity.badRequest().body("❌ Sai tên đăng nhập hoặc mật khẩu!");
        }

        return ResponseEntity.ok(customer);
    }
}