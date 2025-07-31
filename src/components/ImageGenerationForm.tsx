'use client';

import { useState } from 'react';
import { Wand2, Settings, Sparkles } from 'lucide-react';
import { GenerationFormData, GeneratedImage } from '../lib/types';

interface ImageGenerationFormProps {
  onGenerate: (image: GeneratedImage) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
}

const defaultFormData: GenerationFormData = {
  prompt: '',
  negativePrompt: '',
  width: 512,
  height: 512,
  guidanceScale: 7.5,
  numInferenceSteps: 50,
  scheduler: 'DPMSolverMultistep',
};

const schedulerOptions = [
  { value: 'DPMSolverMultistep', label: 'DPM++ 2M' },
  { value: 'Euler', label: 'Euler' },
  { value: 'EulerA', label: 'Euler Ancestral' },
  { value: 'Heun', label: 'Heun' },
  { value: 'DPM2', label: 'DPM2' },
  { value: 'DPM2A', label: 'DPM2 Ancestral' },
  { value: 'LMS', label: 'LMS' },
];

const resolutionOptions = [
  { width: 512, height: 512, label: '512x512' },
  { width: 768, height: 768, label: '768x768' },
  { width: 1024, height: 1024, label: '1024x1024' },
  { width: 512, height: 768, label: '512x768 (Portrait)' },
  { width: 768, height: 512, label: '768x512 (Landscape)' },
];

export default function ImageGenerationForm({
  onGenerate,
  isGenerating,
  setIsGenerating,
  setError,
}: ImageGenerationFormProps) {
  const [formData, setFormData] = useState<GenerationFormData>(defaultFormData);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [promptSuggestions] = useState([
    'A majestic dragon flying over a medieval castle at sunset',
    'A futuristic city with flying cars and neon lights',
    'A serene forest with magical creatures and glowing mushrooms',
    'A steampunk airship soaring through clouds',
    'A cyberpunk street scene with holographic advertisements',
  ]);

  const handleInputChange = (field: keyof GenerationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/replicate/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: formData.prompt,
          negative_prompt: formData.negativePrompt,
          width: formData.width,
          height: formData.height,
          guidance_scale: formData.guidanceScale,
          num_inference_steps: formData.numInferenceSteps,
          scheduler: formData.scheduler,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      
      if (data.output && data.output.length > 0) {
        const generatedImage: GeneratedImage = {
          id: Date.now().toString(),
          url: data.output[0],
          prompt: formData.prompt,
          negativePrompt: formData.negativePrompt,
          width: formData.width,
          height: formData.height,
          model: 'stable-diffusion',
          createdAt: new Date(),
          metadata: {
            guidanceScale: formData.guidanceScale,
            numInferenceSteps: formData.numInferenceSteps,
            scheduler: formData.scheduler,
          },
        };

        onGenerate(generatedImage);
        
        // Save to localStorage
        const savedImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');
        savedImages.unshift(generatedImage);
        localStorage.setItem('generatedImages', JSON.stringify(savedImages.slice(0, 50)));
      } else {
        throw new Error('No image was generated');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const insertSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, prompt: suggestion }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Wand2 className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900">Generate Image</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt Input */}
        <div className="space-y-2">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Prompt *
          </label>
          <textarea
            id="prompt"
            value={formData.prompt}
            onChange={(e) => handleInputChange('prompt', e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            disabled={isGenerating}
          />
        </div>

        {/* Prompt Suggestions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Quick Suggestions
          </label>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => insertSuggestion(suggestion)}
                disabled={isGenerating}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors disabled:opacity-50"
              >
                {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Negative Prompt */}
        <div className="space-y-2">
          <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-700">
            Negative Prompt
          </label>
          <input
            type="text"
            id="negativePrompt"
            value={formData.negativePrompt}
            onChange={(e) => handleInputChange('negativePrompt', e.target.value)}
            placeholder="What you don't want in the image..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isGenerating}
          />
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          disabled={isGenerating}
        >
          <Settings className="w-4 h-4" />
          <span>Advanced Options</span>
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {/* Resolution */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Resolution
              </label>
              <div className="grid grid-cols-2 gap-2">
                {resolutionOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => {
                      handleInputChange('width', option.width);
                      handleInputChange('height', option.height);
                    }}
                    disabled={isGenerating}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      formData.width === option.width && formData.height === option.height
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guidance Scale */}
            <div className="space-y-2">
              <label htmlFor="guidanceScale" className="block text-sm font-medium text-gray-700">
                Guidance Scale: {formData.guidanceScale}
              </label>
              <input
                type="range"
                id="guidanceScale"
                min="1"
                max="20"
                step="0.5"
                value={formData.guidanceScale}
                onChange={(e) => handleInputChange('guidanceScale', parseFloat(e.target.value))}
                className="w-full"
                disabled={isGenerating}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Creative</span>
                <span>Precise</span>
              </div>
            </div>

            {/* Inference Steps */}
            <div className="space-y-2">
              <label htmlFor="numInferenceSteps" className="block text-sm font-medium text-gray-700">
                Inference Steps: {formData.numInferenceSteps}
              </label>
              <input
                type="range"
                id="numInferenceSteps"
                min="10"
                max="100"
                step="5"
                value={formData.numInferenceSteps}
                onChange={(e) => handleInputChange('numInferenceSteps', parseInt(e.target.value))}
                className="w-full"
                disabled={isGenerating}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Fast</span>
                <span>Quality</span>
              </div>
            </div>

            {/* Scheduler */}
            <div className="space-y-2">
              <label htmlFor="scheduler" className="block text-sm font-medium text-gray-700">
                Scheduler
              </label>
              <select
                id="scheduler"
                value={formData.scheduler}
                onChange={(e) => handleInputChange('scheduler', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating}
              >
                {schedulerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating || !formData.prompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Image</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
} 