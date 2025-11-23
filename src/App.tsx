// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import './App.css';
import Login from './pages/Login';
import UserProfile from '@/pages/UserProfile';
import MyProfile from '@/pages/MyProfile';
import UsersListPage from '@/pages/UsersListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="/users/profile" element={<UserProfile />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/list-users" element={<UsersListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

