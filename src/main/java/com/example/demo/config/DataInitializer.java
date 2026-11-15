package com.example.demo.config;

import com.example.demo.entity.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Kiểm tra tài khoản admin, nếu chưa có thì tự động tạo
        if (!customerRepository.existsByUsername("admin")) {
            Customer admin = new Customer();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            admin.setName("Quản Trị Viên Hệ Thống");
            admin.setEmail("admin@fin05.com");
            admin.setPhone("0901234567");
            admin.setCode("ADM001");
            admin.setCreatedAt(LocalDateTime.now());
            customerRepository.save(admin);
            System.out.println("✅ Đã khởi tạo tài khoản ADMIN mặc định: admin / admin123");
        }

        // 2. Tạo sẵn các Khách hàng mẫu
        if (customerRepository.count() <= 1) { // Chỉ có mỗi admin
            createCustomer("khachhang1", "Abc@123", "Công ty TNHH Hoa Sen", "hoasen@gmail.com", "0987654321", "KH001");
            createCustomer("khachhang2", "Abc@123", "Doanh Nghiệp Minh An", "minhan@gmail.com", "0912345678", "KH002");
            createCustomer("khachhang3", "Abc@123", "Công ty Cổ phần Nam Long", "namlong@gmail.com", "0933445566", "KH003");
            System.out.println("✅ Đã nạp dữ liệu khách hàng mẫu thành công!");
        }
    }

    private void createCustomer(String username, String password, String name, String email, String phone, String code) {
        Customer c = new Customer();
        c.setUsername(username);
        c.setPassword(password);
        c.setRole("USER");
        c.setName(name);
        c.setEmail(email);
        c.setPhone(phone);
        c.setCode(code);
        c.setCreatedAt(LocalDateTime.now());
        customerRepository.save(c);
    }
}