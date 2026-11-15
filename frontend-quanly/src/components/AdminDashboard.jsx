import React, { useState } from 'react';
import AdminOverview from './AdminOverview';
import AdminCustomers from './AdminCustomers';
import AdminInvoices from './AdminInvoices';
import AdminPayments from './AdminPayments';

export default function AdminDashboard({ customers = [], invoices = [], payments = [], user, onLogout, onAddInvoice, onAddPayment, onSendReminder }) {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", width: '100%' }}>
            {/* TOP HEADER */}
            <header style={{ background: '#fff', height: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 25px', borderBottom: '1px solid #ebedf2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: '#3699ff', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>CRM</span>
                    <h2 style={{ margin: 0, color: '#181c32', fontSize: '18px', fontWeight: '800' }}>FIN-05 Management</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '13px', color: '#3f4254', fontWeight: '600' }}>👤 Quản trị: {user?.username || 'admin'}</span>
                    <button onClick={onLogout} style={{ background: '#f64e60', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        Đăng Xuất
                    </button>
                </div>
            </header>

            {/* SUB NAVIGATION BAR */}
            <nav style={{ background: '#fff', display: 'flex', gap: '25px', padding: '0 25px', borderBottom: '1px solid #ebedf2', fontSize: '13px', fontWeight: '600' }}>
                {[
                    { key: 'overview', label: '📊 Bản làm việc' },
                    { key: 'customers', label: `👥 Khách hàng (${customers.length})` },
                    { key: 'invoices', label: `📄 Hóa đơn (${invoices.length})` },
                    { key: 'payments', label: `💵 Phiếu thu (${payments.length})` }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{ padding: '15px 0', background: 'none', border: 'none', borderBottom: activeTab === tab.key ? '3px solid #3699ff' : '3px solid transparent', color: activeTab === tab ? '#3699ff' : '#7e8299', cursor: 'pointer' }}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* MAIN CONTENT CONTAINER */}
            <div style={{ padding: '25px', flex: 1, overflowY: 'auto' }}>
                {activeTab === 'overview' && (
                    <AdminOverview
                        invoices={invoices}
                        customers={customers}
                        onSendReminder={onSendReminder}
                        setActiveTab={setActiveTab}
                    />
                )}
                {activeTab === 'customers' && (
                    <AdminCustomers customers={customers} />
                )}
                {activeTab === 'invoices' && (
                    <AdminInvoices
                        invoices={invoices}
                        customers={customers}
                        onAddInvoice={onAddInvoice}
                        onSendReminder={onSendReminder}
                    />
                )}
                {activeTab === 'payments' && (
                    <AdminPayments
                        payments={payments}
                        customers={customers}
                        onAddPayment={onAddPayment}
                    />
                )}
            </div>
        </div>
    );
}