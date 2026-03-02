import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

async function runGemini(
  args: string[],
  outputPath: string
): Promise<{ success: boolean; output: string }> {
  const proc = Bun.spawn(["gemini", ...args], {
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env },
  });

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    return { success: false, output: stderr || stdout };
  }

  const file = Bun.file(outputPath);
  if (await file.exists()) {
    return { success: true, output: `Generated: ${outputPath} (${file.size} bytes)` };
  }

  return { success: false, output: `gemini-cli returned 0 but file not found: ${outputPath}` };
}

export const geminiVideoTool = tool(
  "gemini_video",
  "Generate a video using Google Veo 2 via gemini-cli. Returns the local file path on success.",
  {
    prompt: z.string().describe("Detailed visual prompt for video generation"),
    outputPath: z.string().describe("Local file path for the output video (e.g. tmp/hero.mp4)"),
    duration: z.number().optional().describe("Duration in seconds (default: 5)"),
  },
  async (args) => {
    const cliArgs = [
      "generate", "video",
      "--model", "veo-2",
      "--prompt", args.prompt,
      "--output", args.outputPath,
    ];
    if (args.duration) cliArgs.push("--duration", String(args.duration));

    const result = await runGemini(cliArgs, args.outputPath);
    return {
      content: [{ type: "text", text: result.output }],
      isError: !result.success,
    };
  }
);

export const geminiImageTool = tool(
  "gemini_image",
  "Generate an image using Google Imagen 3 via gemini-cli. Returns the local file path on success.",
  {
    prompt: z.string().describe("Detailed visual prompt for image generation"),
    outputPath: z.string().describe("Local file path for the output image (e.g. tmp/hero.png)"),
  },
  async (args) => {
    const cliArgs = [
      "generate", "image",
      "--model", "imagen-3",
      "--prompt", args.prompt,
      "--output", args.outputPath,
    ];

    const result = await runGemini(cliArgs, args.outputPath);
    return {
      content: [{ type: "text", text: result.output }],
      isError: !result.success,
    };
  }
);

export const geminiAudioTool = tool(
  "gemini_audio",
  "Generate ambient audio using Google Lyria 3 via gemini-cli. Returns the local file path on success.",
  {
    prompt: z.string().describe("Descriptive prompt for ambient audio generation"),
    outputPath: z.string().describe("Local file path for the output audio (e.g. tmp/ambient.mp3)"),
    duration: z.number().optional().describe("Duration in seconds (default: 30)"),
  },
  async (args) => {
    const cliArgs = [
      "generate", "audio",
      "--model", "lyria-3",
      "--prompt", args.prompt,
      "--output", args.outputPath,
    ];
    if (args.duration) cliArgs.push("--duration", String(args.duration));

    const result = await runGemini(cliArgs, args.outputPath);
    return {
      content: [{ type: "text", text: result.output }],
      isError: !result.success,
    };
  }
);
