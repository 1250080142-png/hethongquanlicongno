import React from 'react';

export default function AdminOverview({ invoices = [], customers = [], onSendReminder, setActiveTab }) {
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + Number(inv.paidAmount || 0), 0);
    const totalRemaining = totalAmount - totalPaid;

    const paidPercent = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
    const remainingPercent = 100 - paidPercent;

    const today = new Date().toISOString().split('T')[0];
    const invoicesWithStatus = invoices.map(inv => {
        const dueDate = inv.dueDate || '2026-11-05';
        const isUpcoming = dueDate >= today && inv.status !== 'DA_THANH_TOAN';
        return { ...inv, dueDate, isUpcoming };
    });

    const upcomingInvoices = invoicesWithStatus.filter(inv => inv.isUpcoming);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* 4 CARDS TỔNG QUAN */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div style={{ background: 'linear-gradient(135deg, #6993FF 0%, #3699FF 100%)', padding: '20px', borderRadius: '10px', color: '#fff' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 'bold' }}>TỔNG SỐ HÓA ĐƠN</p>
                    <h2 style={{ margin: 0, fontSize: '26px' }}>{totalInvoices} Hóa đơn</h2>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #3699FF 0%, #187de4 100%)', padding: '20px', borderRadius: '10px', color: '#fff' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 'bold' }}>TỔNG GIÁ TRỊ</p>
                    <h2 style={{ margin: 0, fontSize: '22px' }}>{totalAmount.toLocaleString()} VNĐ</h2>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #1BC5BD 0%, #0bb7af 100%)', padding: '20px', borderRadius: '10px', color: '#fff' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 'bold' }}>ĐÃ THỰC THU</p>
                    <h2 style={{ margin: 0, fontSize: '22px' }}>{totalPaid.toLocaleString()} VNĐ</h2>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #FFA800 0%, #f69300 100%)', padding: '20px', borderRadius: '10px', color: '#fff' }}>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 'bold' }}>CÔNG NỢ CÒN LẠI</p>
                    <h2 style={{ margin: 0, fontSize: '22px' }}>{totalRemaining.toLocaleString()} VNĐ</h2>
                </div>
            </div>

            {/* BỐ CỤC 2 CỘT */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ margin: '0 0 5px', color: '#181c32', fontSize: '16px' }}>📊 Biểu Đồ Trực Quan Tỷ Lệ Thu Hồi Công Nợ</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                                <span>Đã Thanh Toán ({paidPercent}%)</span>
                                <span style={{ color: '#1bc5bd' }}>{totalPaid.toLocaleString()} VNĐ</span>
                            </div>
                            <div style={{ width: '100%', height: '20px', background: '#ebedf2', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ width: `${paidPercent}%`, height: '100%', background: '#1bc5bd' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                                <span>Công Nợ Còn Lại ({remainingPercent}%)</span>
                                <span style={{ color: '#ffa800' }}>{totalRemaining.toLocaleString()} VNĐ</span>
                            </div>
                            <div style={{ width: '100%', height: '20px', background: '#ebedf2', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ width: `${remainingPercent}%`, height: '100%', background: '#ffa800' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#181c32' }}>Đơn hàng tới hạn thanh toán ({upcomingInvoices.length})</h4>
                        <span style={{ fontSize: '12px', color: '#3699ff', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setActiveTab('invoices')}>Xem tất cả</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '220px', overflowY: 'auto' }}>
                        {upcomingInvoices.map(inv => {
                            const cUser = inv.customerUsername || 'Pho123';
                            return (
                                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f4f6f9', paddingBottom: '10px', fontSize: '13px' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#3699ff' }}>{inv.invoiceNumber}</div>
                                        <div style={{ color: '#7e8299', fontSize: '12px' }}>@{cUser}</div>
                                    </div>
                                    <button onClick={() => onSendReminder && onSendReminder(inv, cUser)} style={{ background: '#fff4de', color: '#ffa800', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                                        🔔 Nhắc Nợ
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}