import React from 'react';

const FlowNode = ({ 
  title, 
  onClick, 
  variant = 'default', 
  size = 'medium',
  className = '',
  badge = null,
  isActive = false 
}) => {
  const baseStyles = 'cursor-pointer transition-all duration-200 font-medium text-center flex items-center justify-center';
  
  const variants = {
    // Oval/ellipse style for start/end nodes
    oval: 'rounded-full border-2 border-[#7b2d3a] text-[#7b2d3a] bg-white hover:bg-[#7b2d3a] hover:text-white',
    // Rectangle for process nodes
    rectangle: 'rounded-lg bg-[#7b2d3a] text-white hover:bg-[#5a1f2a]',
    // Diamond for decision nodes
    diamond: 'rounded-lg bg-[#7b2d3a] text-white hover:bg-[#5a1f2a] rotate-0',
    // Extern category (left side)
    extern: 'rounded-lg border-2 border-[#7b2d3a] text-[#7b2d3a] bg-white hover:bg-[#7b2d3a] hover:text-white',
    // Intern category (right side)  
    intern: 'rounded-lg border-2 border-[#7b2d3a] text-[#7b2d3a] bg-white hover:bg-[#7b2d3a] hover:text-white',
    // Output badges (pink/light)
    output: 'rounded-full border-2 border-[#c26d70] text-[#c26d70] bg-white hover:bg-[#c26d70] hover:text-white text-sm',
    // Monitoring circles
    monitoring: 'rounded-full border-2 border-[#7b2d3a] text-[#7b2d3a] bg-white hover:bg-[#7b2d3a] hover:text-white',
    // Default
    default: 'rounded-lg border-2 border-[#7b2d3a] text-[#7b2d3a] bg-white hover:bg-[#7b2d3a] hover:text-white'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-xs min-w-[80px]',
    medium: 'px-4 py-2 text-sm min-w-[120px]',
    large: 'px-6 py-3 text-base min-w-[160px]',
    wide: 'px-6 py-2 text-sm min-w-[200px]'
  };

  const activeStyles = isActive ? 'ring-2 ring-offset-2 ring-[#c26d70] scale-105' : '';

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${activeStyles} ${className}`}
      >
        {title}
      </button>
      {badge && (
        <span className="absolute -top-1 -right-1 bg-[#c26d70] text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
};

export default FlowNode;
