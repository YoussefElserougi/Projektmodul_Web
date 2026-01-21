import React from 'react';
import { Target } from 'lucide-react';

const ThemeInput = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
        <Target className="w-4 h-4" />
        Thema des Posts
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="z.B. Weihnachtsfeier, Stadtfest, Neueröffnung"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      />
    </div>
  );
};

export default ThemeInput;
