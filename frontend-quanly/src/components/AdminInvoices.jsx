import React, { useState } from 'react';

export default function AdminInvoices({ invoices = [], customers = [], onAddInvoice, onSendReminder }) {
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [newInvoice, setNewInvoice] = useState({ customerId: '', invoiceNumber: '', totalAmount: '', dueDate: '' });

    const today = new Date().toISOString().split('T')[0];
    const invoicesWithStatus = invoices.map(inv => {
        const dueDate = inv.dueDate || '2026-11-05';
        const isOverdue = dueDate < today && inv.status !== 'DA_THANH_TOAN';
        return { ...inv, dueDate, isOverdue };
    });

    const handleCreateInvoice = (e) => {
        e.preventDefault();
        if (onAddInvoice) {
            onAddInvoice({
                id: Date.now(),
                customerId: Number(newInvoice.customerId),
                invoiceNumber: newInvoice.invoiceNumber || `HD${Date.now().toString().slice(-6)}`,
                totalAmount: Number(newInvoice.totalAmount),
                paidAmount: 0,
                status: 'CHUA_THANH_TOAN',
                dueDate: newInvoice.dueDate || '2026-11-10'
            });
        }
        setShowInvoiceModal(false);
        setNewInvoice({ customerId: '', invoiceNumber: '', totalAmount: '', dueDate: '' });
        alert("✅ Lập hóa đơn mới thành công!");
    };

    return (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#181c32' }}>Quản Lý Hóa Đơn</h3>
                <button onClick={() => setShowInvoiceModal(true)} style={{ background: '#3699ff', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                    ➕ Lập Hóa Đơn Mới
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                <tr style={{ background: '#f3f6f9', color: '#7e8299', fontSize: '13px' }}>
                    <th style={{ padding: '12px' }}>Mã Hóa Đơn</th>
                    <th style={{ padding: '12px' }}>Khách Hàng</th>
                    <th style={{ padding: '12px' }}>Tổng Tiền</th>
                    <th style={{ padding: '12px' }}>Đã Trả</th>
                    <th style={{ padding: '12px' }}>Hạn Trả</th>
                    <th style={{ padding: '12px' }}>Trạng Thái</th>
                    <th style={{ padding: '12px' }}>Hành Động</th>
                </tr>
                </thead>
                <tbody>
                {invoicesWithStatus.map(inv => {
                    const customer = customers.find(c => Number(c.id) === Number(inv.customerId));
                    const cName = inv.customerName || (customer ? customer.name : `Khách hàng #${inv.customerId}`);
                    const cUser = inv.customerUsername || (customer ? customer.username : 'Pho123');
                    return (
                        <tr key={inv.id} style={{ borderBottom: '1px solid #ebedf2' }}>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{inv.invoiceNumber}</td>
                            <td style={{ padding: '12px' }}>
                                <span style={{ fontWeight: '600', color: '#3699ff' }}>{cName}</span>
                                <span style={{ display: 'block', fontSize: '11px', color: '#7e8299' }}>@{cUser}</span>
                            </td>
                            <td style={{ padding: '12px' }}>{Number(inv.totalAmount).toLocaleString()} VNĐ</td>
                            <td style={{ padding: '12px' }}>{Number(inv.paidAmount).toLocaleString()} VNĐ</td>
                            <td style={{ padding: '12px', color: inv.isOverdue ? '#f64e60' : 'inherit' }}>{inv.dueDate}</td>
                            <td style={{ padding: '12px' }}>
                                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', background: inv.status === 'DA_THANH_TOAN' ? '#e8fff3' : '#fff4de', color: inv.status === 'DA_THANH_TOAN' ? '#1bc5bd' : '#ffa800' }}>
                                        {inv.status}
                                    </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                                <button onClick={() => onSendReminder && onSendReminder(inv, cUser)} style={{ background: '#ffa800', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                    🔔 Nhắc Nợ
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* MODAL LẬP HÓA ĐƠN */}
            {showInvoiceModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <form onSubmit={handleCreateInvoice} style={{ background: '#fff', padding: '30px', borderRadius: '10px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <h3>➕ Lập Hóa Đơn Mới</h3>
                        <select value={newInvoice.customerId} onChange={e => setNewInvoice({...newInvoice, customerId: e.target.value})} required style={{ padding: '8px' }}>
                            <option value="">-- Chọn khách hàng --</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name} (@{c.username})</option>)}
                        </select>
                        <input type="text" placeholder="Mã hóa đơn (VD: HD2026005)" value={newInvoice.invoiceNumber} onChange={e => setNewInvoice({...newInvoice, invoiceNumber: e.target.value})} required style={{ padding: '8px' }} />
                        <input type="number" placeholder="Tổng tiền (VNĐ)" value={newInvoice.totalAmount} onChange={e => setNewInvoice({...newInvoice, totalAmount: e.target.value})} required style={{ padding: '8px' }} />
                        <input type="date" value={newInvoice.dueDate} onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})} required style={{ padding: '8px' }} />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button type="button" onClick={() => setShowInvoiceModal(false)} style={{ padding: '8px 15px' }}>Hủy</button>
                            <button type="submit" style={{ padding: '8px 15px', background: '#3699ff', color: '#fff', border: 'none', borderRadius: '4px' }}>Lưu</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}