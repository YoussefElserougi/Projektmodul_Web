import React from 'react';

const Card = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-4">
          {icon && <span className="text-xl">{icon}</span>}
          {title && <h3 className="text-lg font-semibold text-text-primary">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
