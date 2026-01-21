import React from 'react';
import { Crown } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
          <Crown className="text-primary w-8 h-8" />
          <div className="text-left">
            <h1 className="text-2xl font-bold text-text-primary">
              Social Media Generator
            </h1>
            <p className="text-sm text-gray-600">Stadt Landau in der Pfalz</p>
          </div>
        </div>
        <p className="text-gray-700 mt-4">
          KI-gestützte Content-Erstellung für Ihre Kommunikation
        </p>
      </div>
    </header>
  );
};

export default Header;
