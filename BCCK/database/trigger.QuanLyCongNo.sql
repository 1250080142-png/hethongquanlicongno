-- ====================================================================
-- FILE 2: HỆ THỐNG TRIGGERS CHO HỆ THỐNG CÔNG NỢ
-- ====================================================================


-- Xóa các Trigger cũ nếu tồn tại
IF OBJECT_ID('trg_CheckAllocationLimit', 'TR') IS NOT NULL DROP TRIGGER trg_CheckAllocationLimit;
IF OBJECT_ID('trg_AutoJournalInvoice', 'TR') IS NOT NULL DROP TRIGGER trg_AutoJournalInvoice;
IF OBJECT_ID('trg_AutoGenerateJournalEntry', 'TR') IS NOT NULL DROP TRIGGER trg_AutoGenerateJournalEntry;
IF OBJECT_ID('trg_AutoReverseJournalOnDelete', 'TR') IS NOT NULL DROP TRIGGER trg_AutoReverseJournalOnDelete;
IF OBJECT_ID('trg_PreventInvalidInvoiceUpdate', 'TR') IS NOT NULL DROP TRIGGER trg_PreventInvalidInvoiceUpdate;
GO

-- 1. Trigger kiểm soát hạn mức: Không cho phép phân bổ vượt quá số tiền của phiếu thu
CREATE TRIGGER trg_CheckAllocationLimit
ON payment_allocations
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT p.id
        FROM payments p
        INNER JOIN (
            SELECT payment_id, SUM(allocated_amount) AS total_allocated
            FROM payment_allocations
            GROUP BY payment_id
        ) a ON p.id = a.payment_id
        WHERE a.total_allocated > p.amount
    )
    BEGIN
        RAISERROR(N'Lỗi toàn vẹn: Tổng số tiền phân bổ vượt quá giá trị thực tế của phiếu thu!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO

-- 2. Trigger tự động sinh bút toán doanh thu khi phát hành Hóa đơn (Nợ TK 131 / Có TK 511)
CREATE TRIGGER trg_AutoJournalInvoice
ON invoices
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO journal_entries (entry_date, invoice_id, payment_id, debit_account, credit_account, amount, description)
    SELECT 
        GETDATE(),
        i.id,
        NULL,
        '131' AS debit_account,  -- Nợ Phải thu khách hàng
        '511' AS credit_account, -- Có Doanh thu bán hàng
        i.total_amount,
        N'Tự động sinh bút toán doanh thu cho Hóa đơn số: ' + i.invoice_number
    FROM inserted i;
END;
GO

-- 3. Trigger tự động sinh bút toán thu nợ khi phân bổ thành công (Nợ TK 112 / Có TK 131)
CREATE TRIGGER trg_AutoGenerateJournalEntry
ON payment_allocations
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO journal_entries (entry_date, invoice_id, payment_id, debit_account, credit_account, amount, description)
    SELECT 
        GETDATE(),
        i.invoice_id,
        i.payment_id,
        '112' AS debit_account,  -- Nợ Tiền gửi ngân hàng
        '131' AS credit_account, -- Có Phải thu khách hàng
        i.allocated_amount,
        N'Tự động hạch toán thu nợ cho Hóa đơn ID: ' + CAST(i.invoice_id AS NVARCHAR(20))
    FROM inserted i;
END;
GO

-- 4. Trigger tự động xóa bút toán sổ cái khi hủy/xóa phân bổ thanh toán
CREATE TRIGGER trg_AutoReverseJournalOnDelete
ON payment_allocations
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DELETE je
    FROM journal_entries je
    INNER JOIN deleted d ON je.payment_id = d.payment_id AND je.invoice_id = d.invoice_id
    WHERE je.debit_account = '112' AND je.credit_account = '131';
END;
GO

-- 5. Trigger ngăn chặn sửa đổi hóa đơn đã thanh toán đủ làm sai lệch công nợ
CREATE TRIGGER trg_PreventInvalidInvoiceUpdate
ON invoices
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 
        FROM inserted i
        INNER JOIN deleted d ON i.id = d.id
        WHERE d.status = 'DA_THANH_TOAN' AND i.total_amount < d.total_amount
    )
    BEGIN
        RAISERROR(N'Lỗi: Không được phép giảm tổng tiền của hóa đơn đã thanh toán hoàn tất!', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END;
GO