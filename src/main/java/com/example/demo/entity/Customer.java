package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String name;
    private String email;
    private String phone;
    private String address;

    // 🌟 Bổ sung thêm các trường tài khoản để đăng nhập & phân quyền trực tiếp vào bảng customers
    private String username;
    private String password;
    private String role; // 'CUSTOMER', 'STAFF', 'ADMIN'

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}