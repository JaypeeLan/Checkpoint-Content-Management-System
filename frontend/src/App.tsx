import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import StudentLayout from './components/StudentLayout';
import DashboardPage from './pages/DashboardPage';
import PostsPage from './pages/PostsPage';
import MediaPage from './pages/MediaPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import RequireRole from './components/RequireRole';
import HomeRedirect from './components/HomeRedirect';
import { loadStoredToken } from './api/auth';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0b5fff' },
    secondary: { main: '#00897b' }
  }
});

export default function App() {
  useEffect(() => {
    loadStoredToken();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomeRedirect />} />

            <Route element={<RequireRole allowedRoles={['admin', 'editor', 'author']} />}>
              <Route path="/admin" element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="posts" element={<PostsPage />} />
                <Route path="media" element={<MediaPage />} />
              </Route>
            </Route>

            <Route element={<RequireRole allowedRoles={['subscriber']} />}>
              <Route path="/student" element={<StudentLayout />}>
                <Route index element={<StudentDashboardPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
