import React from 'react';
import { Facebook } from 'lucide-react';

const FacebookPreview = ({ content, imageUrl }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
        <Facebook className="w-5 h-5" />
        <span className="font-semibold">Facebook</span>
        <span className="ml-auto text-sm bg-white/20 px-2 py-1 rounded">📄 Post</span>
      </div>

      {/* Caption */}
      {content.caption && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm whitespace-pre-wrap">{content.caption}</p>
          {content.hashtags && content.hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {content.hashtags.map((tag, index) => (
                <span key={index} className="text-primary text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Image Preview */}
      {imageUrl && (
        <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Generated Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default FacebookPreview;
