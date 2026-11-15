import React, { useState } from 'react';

export default function AdminPayments({ payments = [], customers = [], onAddPayment }) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [newPayment, setNewPayment] = useState({ customerId: '', receiptNumber: '', amount: '' });

    const handleCreatePayment = (e) => {
        e.preventDefault();
        if (onAddPayment) {
            onAddPayment({
                id: Date.now(),
                customerId: Number(newPayment.customerId),
                receiptNumber: newPayment.receiptNumber || `PT${Date.now().toString().slice(-6)}`,
                amount: Number(newPayment.amount),
                unallocatedAmount: 0
            });
        }
        setShowPaymentModal(false);
        setNewPayment({ customerId: '', receiptNumber: '', amount: '' });
        alert("✅ Lập phiếu thu và phân bổ FIFO thành công!");
    };

    return (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#181c32' }}>Lịch Sử Phiếu Thu & Hạch Toán FIFO</h3>
                <button onClick={() => setShowPaymentModal(true)} style={{ background: '#1bc5bd', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                    💵 Lập Phiếu Thu & Phân Bổ
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                <tr style={{ background: '#f3f6f9', color: '#7e8299', fontSize: '13px' }}>
                    <th style={{ padding: '12px' }}>Số Phiếu Thu</th>
                    <th style={{ padding: '12px' }}>Tài Khoản</th>
                    <th style={{ padding: '12px' }}>Số Tiền Đã Nộp</th>
                    <th style={{ padding: '12px' }}>Chưa Phân Bổ</th>
                </tr>
                </thead>
                <tbody>
                {payments.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #ebedf2' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.receiptNumber}</td>
                        <td style={{ padding: '12px', color: '#1bc5bd', fontWeight: '600' }}>@{p.customerUsername || 'Pho123'}</td>
                        <td style={{ padding: '12px' }}>{Number(p.amount).toLocaleString()} VNĐ</td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{Number(p.unallocatedAmount || 0).toLocaleString()} VNĐ</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* MODAL LẬP PHIẾU THU */}
            {showPaymentModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <form onSubmit={handleCreatePayment} style={{ background: '#fff', padding: '30px', borderRadius: '10px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <h3>💵 Lập Phiếu Thu & Phân Bổ FIFO</h3>
                        <select value={newPayment.customerId} onChange={e => setNewPayment({...newPayment, customerId: e.target.value})} required style={{ padding: '8px' }}>
                            <option value="">-- Chọn khách hàng --</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name} (@{c.username})</option>)}
                        </select>
                        <input type="text" placeholder="Số phiếu thu" value={newPayment.receiptNumber} onChange={e => setNewPayment({...newPayment, receiptNumber: e.target.value})} required style={{ padding: '8px' }} />
                        <input type="number" placeholder="Số tiền nộp" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} required style={{ padding: '8px' }} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button type="button" onClick={() => setShowPaymentModal(false)} style={{ padding: '8px 15px' }}>Hủy</button>
                            <button type="submit" style={{ padding: '8px 15px', background: '#1bc5bd', color: '#fff', border: 'none', borderRadius: '4px' }}>Xác Nhận</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}