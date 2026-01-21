import React from 'react';
import { FileText } from 'lucide-react';

const PressemitteilungPreview = ({ content, imageUrl }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg">
        <FileText className="w-5 h-5" />
        <span className="font-semibold">Pressemitteilung</span>
        <span className="ml-auto text-sm bg-white/20 px-2 py-1 rounded">📰 Presse</span>
      </div>

      {/* Caption */}
      {content.caption && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm whitespace-pre-wrap">{content.caption}</p>
        </div>
      )}

      {/* Image Preview */}
      {imageUrl && (
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Generated Press Release"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default PressemitteilungPreview;
