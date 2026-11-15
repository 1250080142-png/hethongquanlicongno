import React from 'react';

export default function AdminCustomers({ customers = [] }) {
    return (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 20px', color: '#181c32' }}>Danh Sách Khách Hàng ({customers.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                <tr style={{ background: '#f3f6f9', color: '#7e8299', fontSize: '13px' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Tên tài khoản</th>
                    <th style={{ padding: '12px' }}>Họ Tên</th>
                    <th style={{ padding: '12px' }}>Gmail</th>
                    <th style={{ padding: '12px' }}>Số Điện Thoại</th>
                </tr>
                </thead>
                <tbody>
                {customers.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #ebedf2' }}>
                        <td style={{ padding: '12px' }}>{c.id}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>
                            {c.username || <span style={{ color: '#a5a5a5', fontStyle: 'italic' }}>user_{c.id}</span>}
                        </td>
                        <td style={{ padding: '12px' }}>{c.name}</td>
                        <td style={{ padding: '12px', color: '#009ef7' }}>{c.email}</td>
                        <td style={{ padding: '12px' }}>{c.phone}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}