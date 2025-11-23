// src/pages/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Login: React.FC = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('superadmin@khgc.vn');
    const [password, setPassword] = useState('SuperAdmin@KHGC99');
    const [error, setError] = useState<string | null>(null);

    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login({ email, password });
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err?.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="container" style={{ maxWidth: 520, margin: '36px auto' }}>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit} className="card" style={{ padding: 20 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>
                    Email
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ width: '100%', padding: 8, marginTop: 6 }} />
                </label>
                <label style={{ display: 'block', marginBottom: 8 }}>
                    Mật khẩu
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ width: '100%', padding: 8, marginTop: 6 }} />
                </label>

                {error && <div style={{ color: '#c53030', marginBottom: 8 }}>{error}</div>}

                <button disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>

                <p style={{ marginTop: 12, color: '#666' }}>
                    Quay lại <Link to="/">Trang chủ</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
