'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Info, X, ExternalLink, Copy, Check } from 'lucide-react';
import { GeneratedImage } from '../lib/types';

interface ImageDisplayProps {
  image: GeneratedImage | null;
  isGenerating: boolean;
  error: string | null;
  onClearError: () => void;
}

export default function ImageDisplay({
  image,
  isGenerating,
  error,
  onClearError,
}: ImageDisplayProps) {
  const [showMetadata, setShowMetadata] = useState(false);
  const [copied, setCopied] = useState(false);

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying prompt:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isGenerating) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900">Generating Image</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
            <div className="w-64 h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            This may take 10-30 seconds depending on the complexity of your prompt
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <button
            onClick={onClearError}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Common solutions:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Check your internet connection</li>
            <li>Try a different prompt</li>
            <li>Reduce the complexity of your description</li>
            <li>Wait a few minutes and try again</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-6 h-6 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Generated Image</h2>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">No image generated yet</h3>
              <p className="text-gray-500">Enter a prompt and click "Generate Image" to create your first AI-generated image.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Generated Image</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Show metadata"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative group">
        <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={image.url}
            alt={image.prompt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => downloadImage(image.url, `ai-generated-${image.id}.png`)}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open</span>
            </a>
          </div>
        </div>
      </div>

      {/* Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Prompt</label>
          <button
            onClick={() => copyPrompt(image.prompt)}
            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">{image.prompt}</p>
        </div>
      </div>

      {/* Metadata */}
      {showMetadata && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-gray-900">Generation Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Resolution:</span>
              <span className="ml-2 text-gray-900">{image.width} × {image.height}</span>
            </div>
            <div>
              <span className="text-gray-500">Model:</span>
              <span className="ml-2 text-gray-900">{image.model}</span>
            </div>
            <div>
              <span className="text-gray-500">Guidance Scale:</span>
              <span className="ml-2 text-gray-900">{image.metadata.guidanceScale}</span>
            </div>
            <div>
              <span className="text-gray-500">Inference Steps:</span>
              <span className="ml-2 text-gray-900">{image.metadata.numInferenceSteps}</span>
            </div>
            <div>
              <span className="text-gray-500">Scheduler:</span>
              <span className="ml-2 text-gray-900">{image.metadata.scheduler}</span>
            </div>
            <div>
              <span className="text-gray-500">Generated:</span>
              <span className="ml-2 text-gray-900">{formatDate(image.createdAt)}</span>
            </div>
          </div>
          {image.negativePrompt && (
            <div>
              <span className="text-gray-500 text-sm">Negative Prompt:</span>
              <p className="text-sm text-gray-700 mt-1">{image.negativePrompt}</p>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => downloadImage(image.url, `ai-generated-${image.id}.png`)}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Image</span>
        </button>
        <a
          href={image.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open Full Size</span>
        </a>
      </div>
    </div>
  );
} 