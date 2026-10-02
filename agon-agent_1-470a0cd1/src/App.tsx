import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Institutions from './pages/Institutions';
import Book from './pages/Book';
import Track from './pages/Track';
import Verify from './pages/Verify';
import Company from './pages/Company';
import Console from './pages/Console';
import NotFound from './pages/NotFound';
import { ForgotPassword, Login, ResetPassword, Signup } from './pages/Auth';

/* Scrolls to top on route change (but lets hash links land smoothly) */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollManager />
        <div className="flex min-h-screen flex-col bg-cream-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/institutions" element={<Institutions />} />
              <Route path="/book" element={<Book />} />
              <Route path="/track" element={<Track />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/company" element={<Company />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/console"
                element={
                  <ProtectedRoute>
                    <Console />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
