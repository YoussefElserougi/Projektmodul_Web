import React from 'react';
import { Instagram, Linkedin, Facebook, Zap } from 'lucide-react';

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-500' },
];

const PlatformSelector = ({ selected, onChange }) => {
  const togglePlatform = (platformId) => {
    if (selected.includes(platformId)) {
      // Mindestens eine Plattform muss ausgewählt sein
      if (selected.length > 1) {
        onChange(selected.filter(id => id !== platformId));
      }
    } else {
      onChange([...selected, platformId]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
        <Zap className="w-4 h-4" />
        Plattformen
      </label>
      <div className="grid grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isSelected = selected.includes(platform.id);
          
          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => togglePlatform(platform.id)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-primary bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`${platform.color} p-2 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium">{platform.name}</span>
                {isSelected && <span className="text-primary">✓</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformSelector;
