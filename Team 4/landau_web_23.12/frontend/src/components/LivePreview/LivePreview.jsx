import React from 'react';
import { Sparkles, Loader } from 'lucide-react';
import Card from '../common/Card';
import InstagramPreview from './InstagramPreview';
import LinkedInPreview from './LinkedInPreview';
import FacebookPreview from './FacebookPreview';

const LivePreview = ({ formData, generatedContent, generatedImageUrl, isLoading }) => {
  const hasContent = generatedContent.instagram?.caption || 
                     generatedContent.linkedin?.caption || 
                     generatedContent.facebook?.caption;

  // Get imageUrl from either the generatedImageUrl prop or from individual content
  const imageUrl = generatedImageUrl || 
                   generatedContent.instagram?.imageUrl || 
                   generatedContent.linkedin?.imageUrl || 
                   generatedContent.facebook?.imageUrl;

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-bold text-text-primary">Live Vorschau</h2>
        </div>
        <div className="text-center py-12">
          <Loader className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-gray-600">
            {formData.generateImage ? 'Generiere Content & Bild...' : 'Generiere Content...'}
          </p>
        </div>
      </Card>
    );
  }

  if (!hasContent) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-bold text-text-primary">Live Vorschau</h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          <p>Klicken Sie auf "Content generieren" um eine Vorschau zu sehen</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Instagram Preview */}
      {formData.platforms.includes('instagram') && generatedContent.instagram && (
        <Card>
          <InstagramPreview 
            content={generatedContent.instagram}
            imageUrl={imageUrl}
          />
        </Card>
      )}

      {/* LinkedIn Preview */}
      {formData.platforms.includes('linkedin') && generatedContent.linkedin && (
        <Card>
          <LinkedInPreview 
            content={generatedContent.linkedin}
            imageUrl={imageUrl}
          />
        </Card>
      )}

      {/* Facebook Preview */}
      {formData.platforms.includes('facebook') && generatedContent.facebook && (
        <Card>
          <FacebookPreview 
            content={generatedContent.facebook}
            imageUrl={imageUrl}
          />
        </Card>
      )}
    </div>
  );
};

export default LivePreview;
