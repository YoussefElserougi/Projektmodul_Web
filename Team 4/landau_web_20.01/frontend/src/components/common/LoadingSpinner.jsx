import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ message = 'Lädt...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader className="w-8 h-8 animate-spin text-primary mb-2" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
