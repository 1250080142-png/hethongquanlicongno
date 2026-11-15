import React, { useState } from 'react';

export default function CustomerDashboard({ invoices = [], payments = [], reminders = [], user, onUpdateUser, onLogout }) {
    const [activeTab, setActiveTab] = useState('overview');

    // State chỉnh sửa thông tin tài khoản
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || 'Nhan Phi Phố',
        email: user?.email || 'Pho@gmail.com',
        phone: user?.phone || '0900000000'
    });

    // Tính toán số liệu tổng quan cá nhân
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + Number(inv.paidAmount || 0), 0);
    const totalRemaining = totalAmount - totalPaid;

    const handleSaveProfile = (e) => {
        e.preventDefault();
        if (onUpdateUser) {
            onUpdateUser(formData);
        }
        setIsEditing(false);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: '#f0f2f5', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

            {/* SIDEBAR BÊN TRÁI */}
            <aside style={{ width: '260px', background: '#1e1e2d', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
                <div>
                    <div style={{ paddingBottom: '20px', borderBottom: '1px solid #3f4254', marginBottom: '20px' }}>
                        <h3 style={{ margin: '0 0 5px', fontSize: '16px', color: '#3699ff' }}>Customer Portal</h3>
                        <p style={{ margin: 0, fontSize: '12px', color: '#7e8299' }}>Tài khoản: @{user?.username}</p>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                            { key: 'overview', label: '📊 Tổng Quan Công Nợ' },
                            { key: 'invoices', label: `📄 Danh Sách Hóa Đơn (${invoices.length})` },
                            { key: 'payments', label: `💵 Lịch Sử Thanh Toán (${payments.length})` },
                            { key: 'reminders', label: `🔔 Thông Báo Nhắc Nợ (${reminders.length})` },
                            { key: 'profile', label: '⚙️ Quản Lý Tài Khoản' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    textAlign: 'left',
                                    padding: '12px 15px',
                                    background: activeTab === tab.key ? '#3699ff' : 'transparent',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '13px'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <button onClick={onLogout} style={{ background: '#f64e60', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Đăng Xuất
                </button>
            </aside>

            {/* MAIN CONTENT BÊN PHẢI */}
            <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: '#181c32' }}>Cổng Thông Tin Tra Cứu Công Nợ & Hạch Toán</h2>
                    <span style={{ background: '#1bc5bd', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Trạng thái: Hoạt động ổn định</span>
                </header>

                {/* TAB 1: TỔNG QUAN */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #6993FF 0%, #3699FF 100%)', padding: '20px', borderRadius: '10px', color: '#fff' }}>
                                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 'bold' }}>TỔNG HÓA ĐƠN</p>
                                <h2 style={{ margin: 0, fontSize: '24px' }}>{totalInvoices} Hóa Đơn</h2>
                            </div>
                            <div style={{ background: 'linear-gradient(135deg, #1BC5BD 0%, #0bb7af 100%)', padding: '20px', borderRadius: '10px', color: '#fff' }}>
                                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 'bold' }}>ĐÃ THANH TOÁN</p>
                                <h2 style={{ margin: 0, fontSize: '24px' }}>{totalPaid.toLocaleString()} VNĐ</h2>
                            </div>
                            <div style={{ background: 'linear-gradient(135deg, #FFA800 0%, #f69300 100%)', padding: '20px', borderRadius: '10px', color: '#fff' }}>
                                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 'bold' }}>DƯ NỢ CÒN LẠI (PHẢI THU)</p>
                                <h2 style={{ margin: 0, fontSize: '24px' }}>{totalRemaining.toLocaleString()} VNĐ</h2>
                            </div>
                        </div>

                        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.03)' }}>
                            <h4 style={{ margin: '0 0 15px', color: '#181c32' }}>📄 Danh Sách Hóa Đơn Gần Nhất</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                <tr style={{ background: '#f3f6f9', color: '#7e8299', fontSize: '12px' }}>
                                    <th style={{ padding: '10px' }}>Mã Hóa Đơn</th>
                                    <th style={{ padding: '10px' }}>Tổng Tiền</th>
                                    <th style={{ padding: '10px' }}>Đã Trả</th>
                                    <th style={{ padding: '10px' }}>Hạn Trả</th>
                                    <th style={{ padding: '10px' }}>Trạng Thái</th>
                                </tr>
                                </thead>
                                <tbody>
                                {invoices.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#7e8299' }}>Chưa có hóa đơn nào ghi nhận.</td></tr>
                                ) : (
                                    invoices.map(inv => (
                                        <tr key={inv.id} style={{ borderBottom: '1px solid #ebedf2' }}>
                                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{inv.invoiceNumber}</td>
                                            <td style={{ padding: '10px' }}>{Number(inv.totalAmount).toLocaleString()} VNĐ</td>
                                            <td style={{ padding: '10px' }}>{Number(inv.paidAmount).toLocaleString()} VNĐ</td>
                                            <td style={{ padding: '10px' }}>{inv.dueDate}</td>
                                            <td style={{ padding: '10px' }}>
                                                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', background: inv.status === 'DA_THANH_TOAN' ? '#e8fff3' : '#fff4de', color: inv.status === 'DA_THANH_TOAN' ? '#1bc5bd' : '#ffa800' }}>
                                                        {inv.status}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 2: DANH SÁCH HÓA ĐƠN */}
                {activeTab === 'invoices' && (
                    <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ margin: '0 0 20px', color: '#181c32' }}>Toàn Bộ Hóa Đơn Cá Nhân</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                            <tr style={{ background: '#f3f6f9', color: '#7e8299', fontSize: '12px' }}>
                                <th style={{ padding: '12px' }}>Mã Hóa Đơn</th>
                                <th style={{ padding: '12px' }}>Tổng Tiền</th>
                                <th style={{ padding: '12px' }}>Đã Trả</th>
                                <th style={{ padding: '12px' }}>Hạn Trả</th>
                                <th style={{ padding: '12px' }}>Trạng Thái</th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoices.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#7e8299' }}>Chưa có hóa đơn nào được ghi nhận cho tài khoản này.</td></tr>
                            ) : (
                                invoices.map(inv => (
                                    <tr key={inv.id} style={{ borderBottom: '1px solid #ebedf2' }}>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{inv.invoiceNumber}</td>
                                        <td style={{ padding: '12px' }}>{Number(inv.totalAmount).toLocaleString()} VNĐ</td>
                                        <td style={{ padding: '12px' }}>{Number(inv.paidAmount).toLocaleString()} VNĐ</td>
                                        <td style={{ padding: '12px' }}>{inv.dueDate}</td>
                                        <td style={{ padding: '12px' }}>
                                                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', background: inv.status === 'DA_THANH_TOAN' ? '#e8fff3' : '#fff4de', color: inv.status === 'DA_THANH_TOAN' ? '#1bc5bd' : '#ffa800' }}>
                                                    {inv.status}
                                                </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB 3: LỊCH SỬ THANH TOÁN */}
                {activeTab === 'payments' && (
                    <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ margin: '0 0 20px', color: '#181c32' }}>Lịch Sử Thanh Toán & Nộp Tiền</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                            <tr style={{ background: '#f3f6f9', color: '#7e8299', fontSize: '12px' }}>
                                <th style={{ padding: '12px' }}>Số Phiếu Thu</th>
                                <th style={{ padding: '12px' }}>Số Tiền Đã Nộp</th>
                                <th style={{ padding: '12px' }}>Chưa Phân Bổ (FIFO)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {payments.length === 0 ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#7e8299' }}>Chưa có lịch sử thanh toán nào.</td></tr>
                            ) : (
                                payments.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #ebedf2' }}>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.receiptNumber}</td>
                                        <td style={{ padding: '12px' }}>{Number(p.amount).toLocaleString()} VNĐ</td>
                                        <td style={{ padding: '12px', color: '#1bc5bd', fontWeight: 'bold' }}>{Number(p.unallocatedAmount || 0).toLocaleString()} VNĐ</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB 4: THÔNG BÁO NHẮC NỢ TỪ ADMIN */}
                {activeTab === 'reminders' && (
                    <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ margin: '0 0 20px', color: '#181c32' }}> Thông Báo Nhắc Nợ Từ Hệ Thống</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {reminders.length === 0 ? (
                                <p style={{ fontSize: '13px', color: '#7e8299', textAlign: 'center', padding: '30px' }}>Không có thông báo nhắc nợ nào.</p>
                            ) : (
                                reminders.map(r => (
                                    <div key={r.id} style={{ background: '#fff4de', borderLeft: '4px solid #ffa800', padding: '15px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px', color: '#3f4254', fontWeight: '500' }}>{r.message}</span>
                                        <span style={{ fontSize: '12px', color: '#7e8299', fontWeight: 'bold' }}>{r.createdAt}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 5: QUẢN LÝ & CHỈNH SỬA TÀI KHOẢN */}
                {activeTab === 'profile' && (
                    <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.03)', maxWidth: '600px' }}>
                        <h3 style={{ margin: '0 0 20px', color: '#181c32' }}>Thông Tin Tài Khoản Cá Nhân</h3>

                        {!isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px' }}>
                                <div><b>Tên tài khoản:</b> {user?.username}</div>
                                <div><b>Họ và tên:</b> {formData.name}</div>
                                <div><b>Gmail liên hệ:</b> {formData.email}</div>
                                <div><b>Số điện thoại:</b> {formData.phone}</div>
                                <div><b>Vai trò hệ thống:</b> <span style={{ color: '#3699ff', fontWeight: 'bold' }}>{user?.role || 'USER'}</span></div>
                                <button onClick={() => setIsEditing(true)} style={{ marginTop: '10px', padding: '10px 20px', background: '#3699ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: 'fit-content' }}>
                                    ✏️ Chỉnh Sửa Thông Tin
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Họ và tên:</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        required
                                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Gmail liên hệ:</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        required
                                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Số điện thoại:</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        required
                                        style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '8px 15px', background: '#e4e6ef', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                                    <button type="submit" style={{ padding: '8px 15px', background: '#1bc5bd', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Thay Đổi</button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}