import React from 'react';
import Card from '../common/Card';
import ThemeInput from './ThemeInput';
import PlatformSelector from './PlatformSelector';
import Button from '../common/Button';
import { Sparkles, ImageIcon } from 'lucide-react';

const PostForm = ({ 
  formData, 
  setFormData, 
  onGenerateContent,
  isLoadingContent
}) => {
  const handleThemeChange = (theme) => {
    setFormData({ ...formData, theme });
  };

  const handlePlatformChange = (platforms) => {
    setFormData({ ...formData, platforms });
  };

  const handleImageToggle = () => {
    const newValue = !formData.generateImage;
    console.log('Toggle clicked! Current:', formData.generateImage, '-> New:', newValue);
    setFormData({ ...formData, generateImage: newValue });
  };

  const canGenerate = formData.theme && formData.theme.length >= 3;

  return (
    <div className="space-y-6">
      <Card>
        <ThemeInput 
          value={formData.theme}
          onChange={handleThemeChange}
        />
      </Card>

      <Card>
        <PlatformSelector
          selected={formData.platforms}
          onChange={handlePlatformChange}
        />
      </Card>

      {/* Image Generation Toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-medium text-text-primary">KI-Bild generieren</h3>
              <p className="text-sm text-gray-500">Automatisch ein passendes Bild erstellen</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleImageToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.generateImage ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.generateImage ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {formData.generateImage && (
          <p className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Die Bildgenerierung kann einige Sekunden dauern
          </p>
        )}
      </Card>

      {/* Generate Content Button */}
      <Button
        variant="primary"
        onClick={onGenerateContent}
        disabled={!canGenerate}
        loading={isLoadingContent}
        className="w-full py-4 text-lg font-semibold"
      >
        <Sparkles className="w-5 h-5" />
        {formData.generateImage ? 'Content & Bild generieren' : 'Content generieren'}
      </Button>

      {!canGenerate && (
        <p className="text-sm text-gray-500 text-center">
          Bitte geben Sie ein Thema ein (mind. 3 Zeichen)
        </p>
      )}
    </div>
  );
};

export default PostForm;
