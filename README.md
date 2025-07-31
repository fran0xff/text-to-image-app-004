# AI Image Generator

A modern, feature-rich AI image generation application built with Next.js, React, TypeScript, and Tailwind CSS. Generate stunning images using Stable Diffusion through the Replicate API.

## Features

### 🎨 Image Generation
- **Text-to-Image**: Generate images from detailed text prompts
- **Negative Prompts**: Specify what you don't want in your images
- **Multiple Resolutions**: Choose from 512x512, 768x768, 1024x1024, and more
- **Advanced Controls**: Fine-tune generation with guidance scale, inference steps, and scheduler options

### 🖼️ Image Management
- **Local Storage**: All generated images are saved locally in your browser
- **Gallery View**: Browse all your generated images with pagination
- **Search & Filter**: Find images by prompt or negative prompt
- **Sort Options**: Sort by date or prompt alphabetically

### 📱 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Progress**: See generation progress with loading indicators
- **Error Handling**: Comprehensive error messages and troubleshooting tips
- **Quick Actions**: Download, view full-size, and copy prompts with one click

### 🎯 Advanced Features
- **Prompt Suggestions**: Quick-start with pre-written prompts
- **Metadata Display**: View all generation parameters and settings
- **Image Details Modal**: Full-screen view with complete image information
- **Bulk Management**: Delete images from gallery or detail view

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Replicate API (Stable Diffusion)
- **Storage**: Browser localStorage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Replicate API token

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd text-to-image-app-004
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REPLICATE_API_TOKEN` | Your Replicate API token for image generation | Yes |

## Usage

### Generating Images

1. **Enter a Prompt**: Describe the image you want to generate in detail
2. **Add Negative Prompt** (optional): Specify what you don't want in the image
3. **Adjust Settings** (optional): Use advanced options to fine-tune generation
4. **Click Generate**: Wait for the AI to create your image
5. **Download or Share**: Save your generated image or view it full-size

### Advanced Options

- **Resolution**: Choose from square, portrait, or landscape formats
- **Guidance Scale**: Control how closely the image follows your prompt (1-20)
- **Inference Steps**: Balance between speed and quality (10-100)
- **Scheduler**: Different algorithms for image generation

### Gallery Features

- **Search**: Find images by prompt content
- **Sort**: Order by date or prompt alphabetically
- **Pagination**: Browse through large collections
- **Quick Actions**: Download, view details, or delete images

## API Endpoints

### POST `/api/replicate/generate-image`

Generates an image using Stable Diffusion.

**Request Body:**
```json
{
  "prompt": "A majestic dragon flying over a medieval castle",
  "negative_prompt": "blurry, low quality",
  "width": 512,
  "height": 512,
  "guidance_scale": 7.5,
  "num_inference_steps": 50,
  "scheduler": "DPMSolverMultistep"
}
```

**Response:**
```json
{
  "output": ["https://replicate.delivery/pbxt/..."]
}
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── replicate/
│   │       └── generate-image/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ImageDisplay.tsx
│   ├── ImageGallery.tsx
│   └── ImageGenerationForm.tsx
└── lib/
    └── types.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section in the app
- Review the error messages for specific guidance
- Ensure your Replicate API token is valid and has sufficient credits

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Replicate](https://replicate.com/) and Stable Diffusion
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)