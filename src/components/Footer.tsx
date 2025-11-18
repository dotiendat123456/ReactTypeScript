// src/components/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="container">
                <p>© {new Date().getFullYear()} Tiệm Pizza. Giao hàng tận nơi.</p>
                <p>Địa chỉ: 123 Đường Pizza, Thành phố • Hotline: 0123 456 789</p>
            </div>
        </footer>
    );
};
export default Footer;
