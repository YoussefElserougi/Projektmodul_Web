import React from 'react';
import { Target } from 'lucide-react';

const ThemeInput = ({ value, onChange, isKrisenmanagement = false }) => {
  const focusBorderColor = isKrisenmanagement ? 'focus:border-[#c26d70]' : 'focus:border-primary';
  const focusRingColor = isKrisenmanagement ? 'focus:ring-[#c26d70]/20' : 'focus:ring-primary/20';
  
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
        <Target className="w-4 h-4" />
        {isKrisenmanagement ? 'Krisensituation beschreiben' : 'Thema des Posts'}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isKrisenmanagement 
          ? "z.B. Wasserrohrbruch, Stromausfall, Verkehrsunfall" 
          : "z.B. Weihnachtsfeier, Stadtfest, Neueröffnung"
        }
        className={`w-full px-4 py-3 rounded-lg border border-gray-300 ${focusBorderColor} focus:ring-2 ${focusRingColor} outline-none transition-all`}
      />
    </div>
  );
};

export default ThemeInput;
