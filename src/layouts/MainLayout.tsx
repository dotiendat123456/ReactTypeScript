import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout: React.FC = () => (
  <div>
    <Header />
    <main style={{ minHeight: '70vh' }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
