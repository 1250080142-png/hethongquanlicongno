-- ====================================================================
-- SCRIPT TẠO HỆ THỐNG VIEWS CHO PHẦN MỀM QUẢN LÝ CÔNG NỢ
-- ====================================================================

USE QuanLyCongNoDB;
GO

-- 1. VIEW: Tổng hợp công nợ khách hàng (Dùng cho Dashboard & Danh sách khách hàng)
CREATE VIEW v_customer_debt_summary AS
SELECT 
    c.id AS customer_id,
    c.code AS customer_code,
    c.name AS customer_name,
    c.phone,
    c.email,
    ISNULL(SUM(i.total_amount), 0) AS total_invoiced, -- Tổng tiền hàng đã mua
    ISNULL(SUM(i.paid_amount), 0) AS total_paid,       -- Tổng tiền đã thanh toán
    ISNULL(SUM(i.total_amount - i.paid_amount), 0) AS total_remaining_debt, -- Tổng nợ còn lại
    COUNT(CASE WHEN i.status != 'DA_THANH_TOAN' AND i.due_date < GETDATE() THEN 1 END) AS overdue_invoice_count -- Số hóa đơn quá hạn
FROM customers c
LEFT JOIN invoices i ON c.id = i.customer_id
GROUP BY c.id, c.code, c.name, c.phone, c.email;
GO

-- 2. VIEW: Chi tiết hóa đơn và số tiền còn thiếu (Dùng cho màn hình Quản lý hóa đơn)
CREATE VIEW v_invoice_details AS
SELECT 
    i.id AS invoice_id,
    i.invoice_number,
    c.id AS customer_id,
    c.code AS customer_code,
    c.name AS customer_name,
    i.issue_date,
    i.due_date,
    i.total_amount,
    i.paid_amount,
    (i.total_amount - i.paid_amount) AS remaining_amount, -- Số tiền còn nợ lại của riêng hóa đơn này
    i.status,
    i.notes
FROM invoices i
INNER JOIN customers c ON i.customer_id = c.id;
GO

-- 3. VIEW: Lịch sử phân bổ thanh toán / gạch nợ (Dùng cho màn hình chi tiết phiếu thu)
CREATE VIEW v_payment_allocation_history AS
SELECT 
    pa.id AS allocation_id,
    p.receipt_number,
    p.payment_date,
    c.id AS customer_id,
    c.name AS customer_name,
    i.id AS invoice_id,
    i.invoice_number,
    pa.allocated_amount,
    pa.allocated_at,
    p.payment_method
FROM payment_allocations pa
INNER JOIN payments p ON pa.payment_id = p.id
INNER JOIN invoices i ON pa.invoice_id = i.id
INNER JOIN customers c ON p.customer_id = c.id;
GO

-- 4. VIEW: Sổ cái / Nhật ký chung kế toán (Hiển thị bút toán Nợ / Có kèm tên tài khoản)
CREATE VIEW v_journal_ledger AS
SELECT 
    je.id AS entry_id,
    je.entry_date,
    je.debit_account,
    acc_dr.account_name AS debit_account_name,
    je.credit_account,
    acc_cr.account_name AS credit_account_name,
    je.amount,
    je.description,
    je.invoice_id,
    je.payment_id
FROM journal_entries je
LEFT JOIN chart_of_accounts acc_dr ON je.debit_account = acc_dr.account_code
LEFT JOIN chart_of_accounts acc_cr ON je.credit_account = acc_cr.account_code;
GO

-- 5. VIEW: Trạng thái nhắc nợ tự động (Thống kê hóa đơn quá hạn và lịch sử nhắc nợ)
CREATE VIEW v_debt_reminder_status AS
SELECT 
    dr.id AS reminder_id,
    i.id AS invoice_id,
    i.invoice_number,
    c.name AS customer_name,
    c.phone,
    c.email,
    i.due_date,
    DATEDIFF(day, i.due_date, GETDATE()) AS days_overdue, -- Số ngày quá hạn tính đến hiện tại
    rr.template_subject,
    dr.channel,
    dr.status AS reminder_status,
    dr.sent_at
FROM debt_reminders dr
INNER JOIN invoices i ON dr.invoice_id = i.id
INNER JOIN customers c ON i.customer_id = c.id
INNER JOIN reminder_rules rr ON dr.rule_id = rr.id;
GO