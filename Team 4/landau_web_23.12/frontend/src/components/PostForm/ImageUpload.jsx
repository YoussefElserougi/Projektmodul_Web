import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import Button from '../common/Button';

const ImageUpload = ({ onImageSelect, onGenerateImage, isGenerating, currentImage }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validierung
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Bitte wählen Sie ein gültiges Bildformat (JPG, PNG, WebP)');
      return;
    }

    if (file.size > maxSize) {
      alert('Die Datei ist zu groß. Maximal 10MB erlaubt.');
      return;
    }

    // Preview erstellen
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // An Parent weitergeben
    onImageSelect(file);
  };

  // Update preview wenn currentImage sich ändert
  React.useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
        <ImageIcon className="w-4 h-4" />
        Bildauswahl
      </label>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
          type="button"
        >
          <Upload className="w-4 h-4" />
          Hochladen
        </Button>
        <Button
          variant="secondary"
          onClick={onGenerateImage}
          loading={isGenerating}
          className="flex-1"
          type="button"
        >
          <Sparkles className="w-4 h-4" />
          KI generieren
        </Button>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${dragActive 
            ? 'border-primary bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
        `}
      >
        {preview ? (
          <div className="space-y-2">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-48 mx-auto rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                onImageSelect(null);
              }}
              className="text-sm text-primary hover:underline"
            >
              Bild entfernen
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-gray-600">
              Bild hochladen<br />oder per Drag & Drop
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
