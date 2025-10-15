import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useTheme } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Landing from './pages/Landing';
import Generator from './pages/Generator';
import ContentHistory from './pages/ContentHistory';
import Calendar from './pages/Calendar';
import Suggestions from './pages/Suggestions';
import Templates from './pages/Templates';
import ContentInsights from './pages/ContentInsights';
import Export from './pages/Export';
import NotFound404 from "./pages/NotFound404";
import { sendVisitorLog } from './utils/visitorTracker';

const AppContent = () => {
  const location = useLocation();
  const { colors } = useTheme();
  const isLandingPage = location.pathname === '/';

  return (
    <div className={`min-h-screen ${colors.background}`}>
      {!isLandingPage && <Navigation />}
      <main className={`${!isLandingPage ? 'min-h-[calc(100vh-4rem)]' : 'min-h-screen'} w-full`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/history" element={<ContentHistory />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/insights" element={<ContentInsights />} />
          <Route path="/export" element={<Export />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  // Track visitor on app mount (client-side only)
  useEffect(() => {
    sendVisitorLog();
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
