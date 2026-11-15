IF EXISTS (SELECT name FROM sys.databases WHERE name = N'QuanLyCongNo')
BEGIN
    ALTER DATABASE QuanLyCongNo SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE QuanLyCongNo;
END
GO


CREATE DATABASE QuanLyCongNo;
GO

USE QuanLyCongNo;
GO

-- 1. BẢNG KHÁCH HÀNG (customers)
CREATE TABLE customers (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name NVARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 2. BẢNG HỆ THỐNG TÀI KHOẢN KẾ TOÁN (chart_of_accounts)
CREATE TABLE chart_of_accounts (
    account_code VARCHAR(20) PRIMARY KEY, -- Kiểu VARCHAR(20)
    account_name NVARCHAR(255) NOT NULL,
    account_type NVARCHAR(50) NOT NULL
);
GO

-- 3. BẢNG HÓA ĐƠN (invoices)
CREATE TABLE invoices (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    invoice_number VARCHAR(30) NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'CHO_THANH_TOAN',
    notes NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Invoices_Customers FOREIGN KEY (customer_id) REFERENCES customers(id)
);
GO

-- 4. BẢNG CHI TIẾT HÓA ĐƠN (invoice_items)
CREATE TABLE invoice_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    quantity DECIMAL(18,2) NOT NULL,
    description NVARCHAR(255) NOT NULL,
    unit_price DECIMAL(18,2) NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_InvoiceItems_Invoices FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
GO

-- 5. BẢNG PHIẾU THU / THANH TOÁN (payments)
CREATE TABLE payments (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    receipt_number VARCHAR(30) NOT NULL UNIQUE,
    payment_date DATETIME2 NOT NULL DEFAULT GETDATE(),
    amount DECIMAL(18,2) NOT NULL,
    unallocated_amount DECIMAL(18,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    reference_code VARCHAR(50),
    CONSTRAINT FK_Payments_Customers FOREIGN KEY (customer_id) REFERENCES customers(id)
);
GO

-- 6. BẢNG TRUNG GIAN PHÂN BỔ THANH TOÁN (payment_allocations)
CREATE TABLE payment_allocations (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    invoice_id BIGINT NOT NULL,
    allocated_amount DECIMAL(18,2) NOT NULL,
    allocated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Allocations_Payments FOREIGN KEY (payment_id) REFERENCES payments(id),
    CONSTRAINT FK_Allocations_Invoices FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);
GO

-- 7. BẢNG SỔ CÁI / NHẬT KÝ CHUNG (journal_entries) - Đã đồng bộ VARCHAR(20)
CREATE TABLE journal_entries (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    entry_date DATETIME2 DEFAULT GETDATE(),
    invoice_id BIGINT NULL,
    payment_id BIGINT NULL,
    debit_account VARCHAR(20) NOT NULL,   -- Đồng bộ VARCHAR(20)
    credit_account VARCHAR(20) NOT NULL,  -- Đồng bộ VARCHAR(20) (đã sửa từ 50 thành 20)
    amount DECIMAL(18,2) NOT NULL,
    description NVARCHAR(MAX),
    CONSTRAINT FK_Journal_Invoices FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    CONSTRAINT FK_Journal_Payments FOREIGN KEY (payment_id) REFERENCES payments(id),
    CONSTRAINT FK_Journal_DebitAccount FOREIGN KEY (debit_account) REFERENCES chart_of_accounts(account_code),
    CONSTRAINT FK_Journal_CreditAccount FOREIGN KEY (credit_account) REFERENCES chart_of_accounts(account_code)
);
GO

-- 8. BẢNG QUY TẮC NHẮC NỢ (reminder_rules)
CREATE TABLE reminder_rules (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    days_overdue INT NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    template_subject VARCHAR(255) NOT NULL,
    template_body NVARCHAR(MAX) NOT NULL
);
GO

-- 9. BẢNG LỊCH SỬ NHẮC NỢ (debt_reminders)
CREATE TABLE debt_reminders (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    rule_id BIGINT NOT NULL,
    sent_at DATETIME2 DEFAULT GETDATE(),
    channel VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT FK_Reminders_Invoices FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    CONSTRAINT FK_Reminders_Rules FOREIGN KEY (rule_id) REFERENCES reminder_rules(id)
);
GO

-- ====================================================================
-- TẠO CÁC INDEX TỐI ƯU HÓA TRUY VẤN
-- ====================================================================
CREATE INDEX IX_Invoices_CustomerStatus ON invoices(customer_id, status);
CREATE INDEX IX_Invoices_IssueDate ON invoices(issue_date);
CREATE INDEX IX_Payments_Customer ON payments(customer_id);
CREATE INDEX IX_Allocations_PaymentInvoice ON payment_allocations(payment_id, invoice_id);
GO