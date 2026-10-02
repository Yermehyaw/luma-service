import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Institutions } from './pages/Institutions';
import { Book } from './pages/Book';
import { Track } from './pages/Track';
import { Verify } from './pages/Verify';
import { Company } from './pages/Company';
import { Auth } from './pages/Auth';
import { Console } from './pages/Console';
import { NotFound } from './pages/NotFound';
import { handleGoogleRedirect } from './lib/googleAuth';

// Call Google Auth Redirect handler on startup
handleGoogleRedirect();

// Scroll to top on route change helper
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
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
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/console" element={
                <ProtectedRoute>
                  <Console />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
