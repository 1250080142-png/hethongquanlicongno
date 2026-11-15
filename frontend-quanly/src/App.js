import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './components/Auth';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';

const initialInvoices = [
  { id: 1, customerId: 2, customerName: 'Nhan Phi Phố', customerUsername: 'Pho123', invoiceNumber: 'HD2026001', totalAmount: 15000000, paidAmount: 10000000, status: 'MOT_PHAN', dueDate: '2026-11-05' },
  { id: 2, customerId: 2, customerName: 'Nhan Phi Phố', customerUsername: 'Pho123', invoiceNumber: 'HD2026002', totalAmount: 25000000, paidAmount: 25000000, status: 'DA_THANH_TOAN', dueDate: '2026-11-05' },
  { id: 5, customerId: 12, customerName: 'Khách hàng quen', customerUsername: 'Pho123', invoiceNumber: 'HD2026005', totalAmount: 10000000, paidAmount: 0, status: 'CHUA_THANH_TOAN', dueDate: '2026-10-31' },
];

const initialPayments = [
  { id: 1, customerId: 2, customerUsername: 'Pho123', receiptNumber: 'PT2026001', amount: 35000000, unallocatedAmount: 0 },
];

function App() {
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([
    { id: 12, username: 'Pho123', name: 'Khách hàng quen', email: 'Pho@gmail.com', phone: '0900000000' },
    { id: 10, username: 'Admin123', name: 'Nhan Phi Phố', email: 'nhanphipho@gmail.com', phone: '0900000000' }
  ]);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [payments, setPayments] = useState(initialPayments);
  const [reminders, setReminders] = useState([
    { id: 1, customerUsername: 'Pho123', message: '🔔 [Nhắc nợ] Hóa đơn HD2026005 trị giá 10,000,000 VNĐ sắp đến hạn thanh toán.', createdAt: '2026-10-28' }
  ]);

  const handleAddInvoice = (newInv) => {
    const selectedCustomer = customers.find(c => Number(c.id) === Number(newInv.customerId));
    const invoiceWithCustomerInfo = {
      ...newInv,
      customerName: selectedCustomer ? selectedCustomer.name : 'Khách hàng',
      customerUsername: selectedCustomer ? selectedCustomer.username : 'Pho123'
    };
    setInvoices(prev => [invoiceWithCustomerInfo, ...prev]);
  };

  const handleAddPayment = (newPay) => {
    const selectedCustomer = customers.find(c => Number(c.id) === Number(newPay.customerId));
    const payWithInfo = {
      ...newPay,
      customerUsername: selectedCustomer ? selectedCustomer.username : 'Pho123'
    };
    setPayments(prev => [payWithInfo, ...prev]);
  };

  const handleSendReminder = (invoice, customerUsername) => {
    const targetUser = customerUsername || 'Pho123';
    const newReminder = {
      id: Date.now(),
      customerUsername: targetUser,
      message: `🔔 [Nhắc nợ công nợ] Hóa đơn ${invoice.invoiceNumber} số tiền ${Number(invoice.totalAmount).toLocaleString()} VNĐ cần được thanh toán trước hạn ${invoice.dueDate}.`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReminders(prev => [newReminder, ...prev]);
    alert(`✅ Đã gửi thông báo nhắc nợ thành công đến tài khoản @${targetUser}!`);
  };

  // 🔥 Hàm cập nhật thông tin khách hàng và đồng bộ ngay sang danh sách Admin
  const handleUpdateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));

    // Cập nhật luôn trong danh sách customers tổng để Admin thấy số điện thoại/email mới
    setCustomers(prevCustomers =>
        prevCustomers.map(c =>
            c.username === user?.username ? { ...c, ...updatedData } : c
        )
    );

    alert("✅ Cập nhật thông tin thành công và đã đồng bộ sang hệ thống Quản lý!");
  };

  const handleLogout = () => setUser(null);

  if (!user) {
    return <Auth onLoginSuccess={(userData) => setUser(userData)} />;
  }

  const currentUsername = user?.username;

  return (
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        {user.role === 'ADMIN' ? (
            <AdminDashboard
                customers={customers}
                invoices={invoices}
                payments={payments}
                user={user}
                onLogout={handleLogout}
                onAddInvoice={handleAddInvoice}
                onAddPayment={handleAddPayment}
                onSendReminder={handleSendReminder}
            />
        ) : (
            <CustomerDashboard
                invoices={invoices.filter(inv => inv.customerUsername === currentUsername || Number(inv.customerId) === Number(user?.id))}
                payments={payments.filter(p => p.customerUsername === currentUsername || Number(p.customerId) === Number(user?.id))}
                reminders={reminders.filter(r => r.customerUsername === currentUsername)}
                user={user}
                onUpdateUser={handleUpdateUser}
                onLogout={handleLogout}
            />
        )}
      </div>
  );
}

export default App;