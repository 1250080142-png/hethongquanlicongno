import React, { useState } from 'react';
import axios from 'axios';

export default function Auth({ onLoginSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '', // Thêm trường email
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePassword = (pwd) => {
        if (!/^[A-Z]/.test(pwd)) return "❌ Mật khẩu phải bắt đầu bằng chữ cái viết hoa!";
        if (!/\d/.test(pwd)) return "❌ Mật khẩu phải chứa ít nhất một chữ số!";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "❌ Mật khẩu phải chứa ít nhất một ký tự đặc biệt!";
        if (pwd.length < 6) return "❌ Mật khẩu phải có độ dài ít nhất 6 ký tự!";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin) {
            const pwdErr = validatePassword(formData.password);
            if (pwdErr) {
                setError(pwdErr);
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("❌ Mật khẩu xác nhận không khớp!");
                return;
            }
            if (!formData.email || !formData.email.endsWith('@gmail.com')) {
                setError("❌ Vui lòng nhập đúng địa chỉ Gmail hợp lệ (kết thúc bằng @gmail.com)!");
                return;
            }
        }

        setLoading(true);

        try {
            if (isLogin) {
                const res = await axios.post('http://localhost:8080/api/customers/login', {
                    username: formData.username,
                    password: formData.password
                });
                alert("✅ Đăng nhập thành công!");
                onLoginSuccess(res.data);
            } else {
                // Đăng ký mới với Gmail
                await axios.post('http://localhost:8080/api/customers/register', {
                    username: formData.username,
                    password: formData.password,
                    name: formData.name || formData.username,
                    email: formData.email, // Gửi Gmail người dùng nhập
                    phone: formData.phone || '0900000000',
                    role: 'USER'
                });

                alert("🎉 Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
                setIsLogin(true);
                setFormData({ username: '', password: '', confirmPassword: '', name: '', email: '', phone: '' });
            }
        } catch (err) {
            setError("❌ " + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div style={{ background: '#fff', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px', boxSizing: 'border-box' }}>

                <h2 style={{ margin: '0 0 5px', color: '#181c32', textAlign: 'center', fontSize: '22px' }}>
                    {isLogin ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Tài Khoản'}
                </h2>
                <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#7e8299', textAlign: 'center' }}>FIN-05 Quản Lý Công Nợ & Hạch Toán Tự Động</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#3f4254' }}>Tên tài khoản:</label>
                        <input
                            type="text"
                            placeholder="Nhập tên tài khoản..."
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e4e6ef', boxSizing: 'border-box', fontSize: '14px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#3f4254' }}>Mật khẩu:</label>
                        <input
                            type="password"
                            placeholder="VD: Abc@123"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e4e6ef', boxSizing: 'border-box', fontSize: '14px' }}
                        />
                        {!isLogin && (
                            <span style={{ fontSize: '11px', color: '#7e8299', display: 'block', marginTop: '2px' }}>
                                💡 Chữ cái đầu viết hoa, có số và ký tự đặc biệt.
                            </span>
                        )}
                    </div>

                    {!isLogin && (
                        <>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#3f4254' }}>Xác nhận mật khẩu:</label>
                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu..."
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e4e6ef', boxSizing: 'border-box', fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#3f4254' }}>Gmail cá nhân:</label>
                                <input
                                    type="email"
                                    placeholder="VD: nhanphipho@gmail.com"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e4e6ef', boxSizing: 'border-box', fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#3f4254' }}>Họ tên hiển thị:</label>
                                <input
                                    type="text"
                                    placeholder="Nhập họ tên..."
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e4e6ef', boxSizing: 'border-box', fontSize: '14px' }}
                                />
                            </div>
                        </>
                    )}

                    {error && <div style={{ color: '#f64e60', fontSize: '12px', fontWeight: 'bold', background: '#ffe2e5', padding: '8px', borderRadius: '4px' }}>{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ background: '#3699ff', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '14px' }}
                    >
                        {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản')}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px' }}>
                    {isLogin ? (
                        <span>Chưa có tài khoản? <button onClick={() => { setIsLogin(false); setError(''); }} style={{ background: 'none', border: 'none', color: '#3699ff', fontWeight: 'bold', cursor: 'pointer' }}>Đăng ký ngay</button></span>
                    ) : (
                        <span>Đã có tài khoản? <button onClick={() => { setIsLogin(true); setError(''); }} style={{ background: 'none', border: 'none', color: '#3699ff', fontWeight: 'bold', cursor: 'pointer' }}>Đăng nhập</button></span>
                    )}
                </div>
            </div>
        </div>
    );
}