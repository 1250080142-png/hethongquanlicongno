USE [QuanLyCongNo]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[sp_AllocatePaymentFIFO]
    @payment_id BIGINT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        DECLARE @customer_id BIGINT;
        DECLARE @remaining_amount DECIMAL(18,2);
        DECLARE @invoice_id BIGINT;
        DECLARE @invoice_total DECIMAL(18,2);
        DECLARE @invoice_paid DECIMAL(18,2);
        DECLARE @debt_amount DECIMAL(18,2);
        DECLARE @allocated_part DECIMAL(18,2);

        SELECT @customer_id = customer_id, @remaining_amount = unallocated_amount
        FROM payments WHERE id = @payment_id;

        IF @remaining_amount <= 0
        BEGIN
            RAISERROR(N'Phiếu thu này đã được phân bổ hết số tiền!', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Đổi tên cursor để chắc chắn không bị trùng cache
        DECLARE cur_invoices_fifo CURSOR LOCAL FAST_FORWARD FOR
            SELECT id, total_amount, paid_amount
            FROM invoices
            WHERE customer_id = @customer_id 
              AND status IN ('CHO_THANH_TOAN', 'THANH_TOAN_MOT_PHAN')
            ORDER BY issue_date ASC, id ASC;

        OPEN cur_invoices_fifo;
        FETCH NEXT FROM cur_invoices_fifo INTO @invoice_id, @invoice_total, @invoice_paid;

        WHILE @@FETCH_STATUS = 0 AND @remaining_amount > 0
        BEGIN
            SET @debt_amount = @invoice_total - @invoice_paid;
            
            IF @remaining_amount >= @debt_amount
                SET @allocated_part = @debt_amount;
            ELSE
                SET @allocated_part = @remaining_amount;

            UPDATE invoices
            SET paid_amount = paid_amount + @allocated_part,
                status = CASE 
                            WHEN (paid_amount + @allocated_part) >= total_amount THEN 'DA_THANH_TOAN'
                            ELSE 'THANH_TOAN_MOT_PHAN'
                         END
            WHERE id = @invoice_id;

            INSERT INTO payment_allocations (payment_id, invoice_id, allocated_amount, allocated_at)
            VALUES (@payment_id, @invoice_id, @allocated_part, GETDATE());

            SET @remaining_amount = @remaining_amount - @allocated_part;

            FETCH NEXT FROM cur_invoices_fifo INTO @invoice_id, @invoice_total, @invoice_paid;
        END

        CLOSE cur_invoices_fifo;
        DEALLOCATE cur_invoices_fifo;

        UPDATE payments
        SET unallocated_amount = @remaining_amount
        WHERE id = @payment_id;

        COMMIT TRANSACTION;
        PRINT N'Thực hiện thuật toán phân bổ FIFO thành công!';
    END TRY
    BEGIN CATCH
        IF CURSOR_STATUS('local', 'cur_invoices_fifo') >= 0
        BEGIN
            CLOSE cur_invoices_fifo;
            DEALLOCATE cur_invoices_fifo;
        END

        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;