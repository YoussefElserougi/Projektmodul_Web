import React from 'react';
import { Mail } from 'lucide-react';

const InterneEmailPreview = ({ content, imageUrl }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg">
        <Mail className="w-5 h-5" />
        <span className="font-semibold">Interne E-Mail</span>
        <span className="ml-auto text-sm bg-white/20 px-2 py-1 rounded">📧 Intern</span>
      </div>

      {/* Caption */}
      {content.caption && (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <p className="text-sm whitespace-pre-wrap">{content.caption}</p>
        </div>
      )}

      {/* Image Preview */}
      {imageUrl && (
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Generated Internal Email"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default InterneEmailPreview;
