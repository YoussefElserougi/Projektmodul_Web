import React from 'react';
import { Palette } from 'lucide-react';

const styles = [
  { id: 'locker', name: 'Locker', description: 'Freundlich und ungezwungen' },
  { id: 'marketing', name: 'Marketing', description: 'Überzeugend und ansprechend' },
  { id: 'professionell', name: 'Professionell', description: 'Seriös und sachlich' },
];

const StyleSelector = ({ selected, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
        <Palette className="w-4 h-4" />
        Stil & Tonalität
      </label>
      <div className="space-y-2">
        {styles.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={`
              w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
              ${selected === style.id 
                ? 'border-primary bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-text-primary">{style.name}</div>
                <div className="text-sm text-gray-600">{style.description}</div>
              </div>
              {selected === style.id && <span className="text-primary text-xl">✓</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
