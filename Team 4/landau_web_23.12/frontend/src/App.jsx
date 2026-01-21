import { useState } from 'react';
import Header from './components/Header/Header';
import PostForm from './components/PostForm/PostForm';
import LivePreview from './components/LivePreview/LivePreview';
import ErrorMessage from './components/common/ErrorMessage';
import { useN8nWorkflow } from './hooks/useN8nWorkflow';

function App() {
  const [formData, setFormData] = useState({
    theme: '',
    platforms: ['instagram', 'linkedin', 'facebook'],
    generateImage: false
  });

  const {
    generatedContent,
    generatedImageUrl,
    isLoading,
    error,
    handleGenerateContent
  } = useN8nWorkflow(formData);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column: Form */}
          <div className="space-y-6">
            <PostForm 
              formData={formData}
              setFormData={setFormData}
              onGenerateContent={handleGenerateContent}
              isLoadingContent={isLoading}
            />
            
            {error && (
              <ErrorMessage message={error} />
            )}
          </div>

          {/* Right Column: Preview */}
          <div className="space-y-6">
            <LivePreview 
              formData={formData}
              generatedContent={generatedContent}
              generatedImageUrl={generatedImageUrl}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
