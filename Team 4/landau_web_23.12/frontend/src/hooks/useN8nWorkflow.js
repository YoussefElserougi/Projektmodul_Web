import { useState, useCallback } from 'react';
import { generateContent } from '../services/api';

export const useN8nWorkflow = (formData) => {
  // Store content for each platform separately
  const [generatedContent, setGeneratedContent] = useState({
    instagram: null,
    linkedin: null,
    facebook: null
  });
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Manual content generation - triggered by button click
  const handleGenerateContent = useCallback(async () => {
    if (!formData.theme || formData.theme.length < 3) {
      setError('Bitte geben Sie ein Thema mit mindestens 3 Zeichen ein');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('formData.generateImage value:', formData.generateImage);
      const response = await generateContent({
        theme: formData.theme,
        platforms: formData.platforms,
        generateImage: formData.generateImage === true
      });

      if (response.success) {
        // Store content for each platform
        console.log('Setting generatedContent:', response.data);
        setGeneratedContent({
          instagram: response.data.instagram || null,
          linkedin: response.data.linkedin || null,
          facebook: response.data.facebook || null
        });
        
        // Store generated image URL if available
        if (response.imageUrl) {
          setGeneratedImageUrl(response.imageUrl);
        }
      } else {
        console.log('Response not successful:', response);
      }
    } catch (err) {
      setError(err.message);
      console.error('Content generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return {
    generatedContent,
    generatedImageUrl,
    isLoading,
    error,
    handleGenerateContent
  };
};
