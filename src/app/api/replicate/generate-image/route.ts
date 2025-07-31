import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const { 
    prompt, 
    negative_prompt, 
    width = 512, 
    height = 512, 
    guidance_scale = 7.5, 
    num_inference_steps = 50, 
    scheduler = "DPMSolverMultistep" 
  } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: prompt,
          negative_prompt: negative_prompt || "",
          width: width,
          height: height,
          num_outputs: 1,
          num_inference_steps: num_inference_steps,
          guidance_scale: guidance_scale,
          scheduler: scheduler,
        },
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error) {
    console.error("Error from Replicate API:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to generate image";
    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        errorMessage = "Rate limit exceeded. Please try again in a few minutes.";
      } else if (error.message.includes("invalid")) {
        errorMessage = "Invalid parameters. Please check your prompt and settings.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
