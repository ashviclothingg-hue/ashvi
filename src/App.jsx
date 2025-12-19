import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AuthModal from './components/AuthModal';

import AdminPage from './pages/AdminPage';
import BabiesPage from './pages/BabiesPage';
import CollectionPage from './pages/CollectionPage';
import BabyFitsPage from './pages/BabyFitsPage';
import OfferBanner from './components/OfferBanner';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status on load
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If not logged in, show modal after a slight delay for better UX
        setTimeout(() => setShowAuthModal(true), 1500);
      } else {
        setShowAuthModal(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <OfferBanner />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/babies/:subCategory" element={<BabiesPage />} />
        <Route path="/baby-fits" element={<BabyFitsPage />} />
        <Route path="/collection" element={<CollectionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
