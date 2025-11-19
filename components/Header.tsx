import React from 'react';
import { Lock, Shield, LogOut } from 'lucide-react';
import { ViewState } from '../types';
import { Button } from './Button';
import { clearToken, verifyToken, verifyAdmin, logoutAdmin } from '../services/authService';

interface HeaderProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onChangeView }) => {
  const isAuthenticated = verifyToken();
  const isAdmin = verifyAdmin();

  const handleLogout = () => {
    clearToken();
    onChangeView(ViewState.LANDING);
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    onChangeView(ViewState.LANDING);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onChangeView(ViewState.LANDING)}
          >
            <img 
              src="https://i.ibb.co/wrmZnWm/Screenshot-2025-03-06-at-1-17-57-AM.png" 
              alt="RevenueNomad" 
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Nav */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => onChangeView(ViewState.LANDING)}
              className={`text-sm font-medium transition-colors ${currentView === ViewState.LANDING ? 'text-[#70A25B]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Product
            </button>
            <button 
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Documentation
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Admin Section */}
            {isAdmin ? (
              <div className="flex items-center mr-4 pl-4 border-l border-gray-200">
                <button 
                  onClick={() => onChangeView(ViewState.ADMIN_DASHBOARD)}
                  className={`text-sm font-medium mr-4 flex items-center ${currentView === ViewState.ADMIN_DASHBOARD ? 'text-[#70A25B]' : 'text-gray-600 hover:text-[#70A25B]'}`}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Admin
                </button>
                <button onClick={handleAdminLogout} className="text-gray-400 hover:text-red-500">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
               <button 
                onClick={() => onChangeView(ViewState.ADMIN_LOGIN)}
                className="text-xs font-medium text-gray-400 hover:text-[#70A25B] mr-4 transition-colors"
              >
                Admin Login
              </button>
            )}

            {/* User Section */}
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => onChangeView(ViewState.PROTECTED)}
                  className="text-sm font-medium text-gray-700 hover:text-[#70A25B] flex items-center mr-2"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  Protected Area
                </button>
                <Button variant="outline" onClick={handleLogout} className="py-2 px-4 text-sm h-9">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                variant="primary" 
                onClick={() => onChangeView(ViewState.DEMO_FORM)}
                className="py-2 px-4 text-sm h-9"
              >
                Try Demo
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};