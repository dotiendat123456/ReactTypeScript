// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link to="/" className="logo" aria-label="Trang chủ Pizza">
                    <img src="/src/assets/logo.png" alt="Pizza Logo" className="logo-img" />
                    <span className="logo-text">Tiệm Pizza</span>
                </Link>

                <nav className="nav">
                    <Link to="/" className="nav-link">Trang chủ</Link>
                    <a href="/users/profile" className="nav-link">Thông tin người dùng</a>
                    <a href="/myprofile" className="nav-link">Thông tin cá nhân</a>
                    <a href="/list-users" className="nav-link">Danh sách người dùng</a>
                    <a href="/posts" className="nav-link">Danh sách bài đăng</a>
                    <a href="/posts/create" className="nav-link">Tạo bài đăng</a>
                </nav>

                <div className="actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {isAuthenticated ? (
                        <>
                            <span style={{ color: '#333' }}>Hi, {user?.name || user?.email}</span>
                            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
                            <Link to="/cart" className="btn btn-ghost" aria-label="Xem giỏ hàng"> Cart</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary">Login</Link>
                            <Link to="/cart" className="btn btn-ghost" aria-label="Xem giỏ hàng"> Cart</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
