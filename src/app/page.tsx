'use client';

import { useState, useEffect } from 'react';
import ImageGenerationForm from '../components/ImageGenerationForm';
import ImageDisplay from '../components/ImageDisplay';
import ImageGallery from '../components/ImageGallery';
import { GeneratedImage } from '../lib/types';

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery'>('generate');

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">AI Image Generator</h1>
            </div>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'generate'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Generate
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'gallery'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Gallery
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generate' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generation Form */}
            <div className="space-y-6">
              <ImageGenerationForm
                onGenerate={setGeneratedImage}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                setError={setError}
              />
            </div>

            {/* Image Display */}
            <div className="space-y-6">
              <ImageDisplay
                image={generatedImage}
                isGenerating={isGenerating}
                error={error}
                onClearError={() => setError(null)}
              />
            </div>
          </div>
        ) : (
          <ImageGallery />
        )}
      </div>
    </main>
  );
}
