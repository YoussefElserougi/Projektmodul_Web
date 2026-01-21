import React from 'react';
import { Crown, AlertTriangle } from 'lucide-react';

const Header = ({ mode, onModeChange }) => {
  const isKrisenmanagement = mode === 'krisenmanagement';
  
  return (
    <header className={`py-8 px-4 transition-colors duration-300 ${
      isKrisenmanagement 
        ? 'bg-gradient-to-r from-red-50 to-red-100' 
        : 'bg-gradient-to-r from-blue-50 to-blue-100'
    }`}>
      <div className="max-w-7xl mx-auto text-center">
        {/* Mode Toggle Switch */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md">
            <span className={`text-sm font-medium transition-colors ${!isKrisenmanagement ? 'text-primary font-semibold' : 'text-gray-400'}`}>
              Social Media
            </span>
            <button
              onClick={() => onModeChange(isKrisenmanagement ? 'social' : 'krisenmanagement')}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                isKrisenmanagement ? 'bg-[#c26d70]' : 'bg-gray-300'
              }`}
              aria-label="Toggle between Social Media and Krisenmanagement"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  isKrisenmanagement ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isKrisenmanagement ? 'text-[#c26d70] font-semibold' : 'text-gray-400'}`}>
              Krisenmanagement
            </span>
          </div>
        </div>

        <div className={`inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4 transition-all duration-300`}>
          {isKrisenmanagement ? (
            <AlertTriangle className="text-[#c26d70] w-8 h-8" />
          ) : (
            <Crown className="text-primary w-8 h-8" />
          )}
          <div className="text-left">
            <h1 className="text-2xl font-bold text-text-primary">
              {isKrisenmanagement ? 'Krisenmanagement' : 'Social Media Generator'}
            </h1>
            <p className="text-sm text-gray-600">Stadtholding Landau in der Pfalz GmbH</p>
          </div>
        </div>
        <p className="text-gray-700 mt-4">
          {isKrisenmanagement 
            ? 'KI-gestützte Krisenkommunikation für schnelle Reaktionen'
            : 'KI-gestützte Content-Erstellung für Ihre Kommunikation'
          }
        </p>
      </div>
    </header>
  );
};

export default Header;
