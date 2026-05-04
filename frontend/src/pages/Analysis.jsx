import { useState } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import PhotoUploader from '../components/analysis/PhotoUploader';
import AnalysisResult from '../components/analysis/AnalysisResult';
import Loading from '../components/common/Loading';

export default function Analysis() {
  const { result, loading, analyzePhoto, saveMeal, reset } = useAnalysis();
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async (file) => {
    await analyzePhoto(file);
  };

  const handleSave = async (mealData) => {
    setSaving(true);
    try {
      await saveMeal(mealData);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {result ? 'Analysis Result' : 'Upload a Meal Photo'}
          </h1>
          <p className="text-gray-600">
            {result
              ? 'Review the nutrition facts and save to your log'
              : 'Upload a photo of a Turkish dish'}
          </p>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <Loading
            fullScreen
            size="lg"
            text="Analyzing your meal..."
          />
        )}

        {/* Content */}
        {result ? (
          <AnalysisResult
            result={result}
            onSave={handleSave}
            onReset={handleReset}
            saving={saving}
          />
        ) : (
          <PhotoUploader
            onAnalyze={handleAnalyze}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
