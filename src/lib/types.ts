export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  model: string;
  createdAt: Date;
  metadata: {
    guidanceScale: number;
    numInferenceSteps: number;
    scheduler: string;
  };
}

export interface GenerationFormData {
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  guidanceScale: number;
  numInferenceSteps: number;
  scheduler: string;
}

export interface GalleryImage extends GeneratedImage {
  downloaded?: boolean;
}

export interface GenerationProgress {
  status: 'starting' | 'processing' | 'completed' | 'error';
  message: string;
  progress?: number;
} 