import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import { AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const Portofolio = lazy(() => import("./Pages/Portofolio"));
const ContactPage = lazy(() => import("./Pages/Contact"));
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const WelcomeScreen = lazy(() => import("./Pages/WelcomeScreen"));
const NotFoundPage = lazy(() => import("./Pages/404"));
const WalletApp = lazy(() => import("./Pages/WalletApp"));

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <Suspense fallback={null}>
            <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <div className="relative z-10">
          <Navbar />
          <Home />
          <About />
          <Suspense fallback={<div className="h-20" />}>
            <Portofolio />
            <ContactPage />
          </Suspense>
          <Footer />
        </div>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <div className="relative z-10">
    <Navbar />
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProjectDetails />
    </Suspense>
    <Footer />
  </div>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  return (
    <ThemeProvider>
      <HelmetProvider>
        <div className="relative min-h-screen overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-700 dark:selection:bg-cyan-400/20 dark:selection:text-cyan-300">
          <AnimatedBackground />
          <BrowserRouter>
            <Routes>
              {/* PUBLIC */}
              <Route
                path="/"
                element={
                  <LandingPage
                    showWelcome={showWelcome}
                    setShowWelcome={setShowWelcome}
                  />
                }
              />

              <Route path="/project/:slug" element={<ProjectPageLayout />} />
              <Route
                path="/wallet"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-slate-100" />}>
                    <WalletApp />
                  </Suspense>
                }
              />

              {/* AUTH */}
              <Route path="/login" element={<Login />} />

              {/* ADMIN (PROTECTED) */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <Suspense fallback={null}>
                    <NotFoundPage />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
