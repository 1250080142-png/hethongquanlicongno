package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.Invoice;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    // Lấy danh sách hóa đơn theo mã khách hàng
    List<Invoice> findByCustomerId(Long customerId);

    // Gọi Stored Procedure tạo hóa đơn dưới CSDL nếu cần
    @Procedure(procedureName = "sp_CreateInvoice")
    void executeCreateInvoice(@Param("customer_id") Long customerId, @Param("total_amount") Double totalAmount);
}