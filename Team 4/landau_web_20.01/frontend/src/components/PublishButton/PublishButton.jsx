import React, { useState } from 'react';
import { Zap, Check, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

const PublishButton = ({ formData, generatedContent, error, isLoading, onPublish }) => {
  const [publishResult, setPublishResult] = useState(null);

  const isDisabled = !formData.theme || !formData.imageUrl || !generatedContent.caption;

  const handlePublish = async () => {
    const result = await onPublish();
    if (result) {
      setPublishResult(result);
      setTimeout(() => setPublishResult(null), 10000);
    }
  };

  if (publishResult) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
        <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-green-700 mb-2">
          Erfolgreich veröffentlicht!
        </h3>
        <div className="space-y-2 text-sm">
          {Object.entries(publishResult).map(([platform, data]) => (
            <a
              key={platform}
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-primary hover:underline"
            >
              Auf {platform} ansehen →
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Button
        variant="success"
        onClick={handlePublish}
        disabled={isDisabled}
        loading={isLoading}
        className="w-full py-4 text-lg font-bold"
      >
        <Zap className="w-5 h-5" />
        Posts jetzt veröffentlichen
        <Zap className="w-5 h-5" />
      </Button>

      {isDisabled && !error && (
        <p className="text-sm text-gray-500 text-center">
          Bitte füllen Sie alle Felder aus, um zu veröffentlichen
        </p>
      )}
    </div>
  );
};

export default PublishButton;
