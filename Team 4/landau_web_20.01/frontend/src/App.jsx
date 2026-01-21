import { useState } from 'react';
import Header from './components/Header/Header';
import PostForm from './components/PostForm/PostForm';
import LivePreview from './components/LivePreview/LivePreview';
import ErrorMessage from './components/common/ErrorMessage';
import { CrisisFlowChart } from './components/CrisisFlow';
import { useN8nWorkflow } from './hooks/useN8nWorkflow';

function App() {
  const [mode, setMode] = useState('social'); // 'social' or 'krisenmanagement'
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  
  const [formData, setFormData] = useState({
    theme: '',
    platforms: ['instagram', 'linkedin', 'facebook'],
    generateImage: false,
    addKiHinweis: false
  });

  const {
    generatedContent,
    generatedImageUrl,
    isLoading,
    error,
    handleGenerateContent
  } = useN8nWorkflow(formData, mode);

  const isKrisenmanagement = mode === 'krisenmanagement';

  // Handle navigation from flowchart to content generator
  const handleNavigateToContent = (nodeId) => {
    // Pre-select platforms based on the node clicked
    if (nodeId === 'socialMedia') {
      setFormData(prev => ({
        ...prev,
        platforms: ['instagram', 'linkedin', 'facebook']
      }));
    } else if (nodeId === 'presse') {
      setFormData(prev => ({
        ...prev,
        platforms: ['pressemitteilung']
      }));
    } else if (nodeId === 'internet') {
      // For internet/website, we could add a website option or use pressemitteilung
      setFormData(prev => ({
        ...prev,
        platforms: ['pressemitteilung']
      }));
    }
    setShowContentGenerator(true);
  };

  // Reset to flowchart view
  const handleBackToFlowchart = () => {
    setShowContentGenerator(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header mode={mode} onModeChange={(newMode) => {
        setMode(newMode);
        setShowContentGenerator(false); // Reset to flowchart when switching modes
      }} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Krisenmanagement Mode - Show Flowchart or Content Generator */}
        {isKrisenmanagement && !showContentGenerator ? (
          <div className="space-y-6">
            <CrisisFlowChart onNavigateToContent={handleNavigateToContent} />
          </div>
        ) : (
          <>
            {/* Back button for Krisenmanagement mode */}
            {isKrisenmanagement && showContentGenerator && (
              <button
                onClick={handleBackToFlowchart}
                className="mb-6 flex items-center gap-2 text-[#c26d70] hover:text-[#a85a5d] transition-colors"
              >
                ← Zurück zum Ablaufdiagramm
              </button>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Column: Form */}
              <div className="space-y-6">
                <PostForm 
                  formData={formData}
                  setFormData={setFormData}
                  onGenerateContent={handleGenerateContent}
                  isLoadingContent={isLoading}
                  isKrisenmanagement={isKrisenmanagement}
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
                  isKrisenmanagement={isKrisenmanagement}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
