
import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import { verifyToken, verifyAdmin } from './services/authService';
import { Header } from './components/Header';
import { Landing } from './views/Landing';
import { DemoForm } from './views/DemoForm';
import { ProtectedResource } from './views/ProtectedResource';
import { AdminLogin } from './views/AdminLogin';
import { AdminDashboard } from './views/AdminDashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);

  // Simple routing logic
  const handleViewChange = (view: ViewState) => {
    // Protected User Route Protection
    if (view === ViewState.PROTECTED && !verifyToken()) {
      setCurrentView(ViewState.DEMO_FORM);
      return;
    }

    // Protected Admin Route Protection
    if (view === ViewState.ADMIN_DASHBOARD && !verifyAdmin()) {
      setCurrentView(ViewState.ADMIN_LOGIN);
      return;
    }

    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // Initial check on load
  useEffect(() => {
    // We don't auto-redirect here to keep the UX simple, 
    // but this serves as a placeholder for session restoration.
  }, []);

  const renderView = () => {
    switch (currentView) {
      case ViewState.LANDING:
        return <Landing onChangeView={handleViewChange} />;
      case ViewState.DEMO_FORM:
        return <DemoForm onChangeView={handleViewChange} />;
      case ViewState.PROTECTED:
        return <ProtectedResource onChangeView={handleViewChange} />;
      case ViewState.ADMIN_LOGIN:
        return <AdminLogin onChangeView={handleViewChange} />;
      case ViewState.ADMIN_DASHBOARD:
        return <AdminDashboard onChangeView={handleViewChange} />;
      default:
        return <Landing onChangeView={handleViewChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header currentView={currentView} onChangeView={handleViewChange} />
      <main>
        {renderView()}
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-gray-900 text-lg">RevenueNomad</span>
              <p className="text-sm text-gray-500 mt-1">© 2024 RevenueNomad. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-gray-500">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
