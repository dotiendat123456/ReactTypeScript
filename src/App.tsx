// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import './App.css';
import Login from './pages/Login';
import UserProfile from '@/pages/UserProfile';
import MyProfile from '@/pages/MyProfile';
import UsersListPage from '@/pages/UsersListPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import PostsListPage from '@/pages/PostsListPage';
import CreatePostPage from '@/pages/CreatePostPage';
import PostDetailPage from '@/pages/PostDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mọi trang đều dùng chung MainLayout (Header + Outlet) */}
        <Route path="/" element={<MainLayout />}>
          {/* / */}
          <Route index element={<Home />} />

          {/* /login – public */}
          <Route path="login" element={<Login />} />

          {/* /users/profile – cần đăng nhập */}
          <Route
            path="users/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* /myprofile – cần đăng nhập */}
          <Route
            path="myprofile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          {/* /list-users – cần đăng nhập */}
          <Route
            path="list-users"
            element={
              <ProtectedRoute>
                <UsersListPage />
              </ProtectedRoute>
            }
          />

          {/* /posts – danh sách bài đăng */}
          <Route
            path="posts"
            element={
              <ProtectedRoute>
                <PostsListPage />
              </ProtectedRoute>
            }
          />

          {/* /posts/create – tạo bài đăng mới */}
          <Route
            path="posts/create"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />

          {/* /posts/:id – xem chi tiết bài đăng */}
          <Route
            path="posts/:id"
            element={
              <ProtectedRoute>
                <PostDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
