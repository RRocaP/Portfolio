import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

async function runCommand(
  cmd: string[],
  outputPath: string
): Promise<{ success: boolean; output: string }> {
  const proc = Bun.spawn(cmd, {
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env },
  });

  const stdout = await new Response(proc.stdout).text();
  const stderr = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    return { success: false, output: `Exit ${exitCode}: ${stderr || stdout}` };
  }

  const file = Bun.file(outputPath);
  if (await file.exists()) {
    return { success: true, output: `Generated: ${outputPath} (${file.size} bytes)` };
  }

  return { success: false, output: `Process returned 0 but file not found: ${outputPath}` };
}

export const wan21VideoTool = tool(
  "wan21_video",
  "Generate a video using Wan2.1-T2V-14B (open-source). Fallback when Gemini Veo is unavailable.",
  {
    prompt: z.string().describe("Detailed visual prompt for video generation"),
    outputPath: z.string().describe("Local file path for the output video"),
    steps: z.number().optional().describe("Diffusion steps (default: 50)"),
  },
  async (args) => {
    const steps = args.steps ?? 50;
    const result = await runCommand(
      ["python", "generate.py", "--prompt", args.prompt, "--steps", String(steps), "--output", args.outputPath],
      args.outputPath
    );
    return {
      content: [{ type: "text", text: result.output }],
      isError: !result.success,
    };
  }
);

export const fluxImageTool = tool(
  "flux_image",
  "Generate an image using FLUX.1-dev (open-source). Fallback when Gemini Imagen is unavailable.",
  {
    prompt: z.string().describe("Detailed visual prompt for image generation"),
    outputPath: z.string().describe("Local file path for the output image"),
    width: z.number().optional().describe("Image width in pixels (default: 1920)"),
    height: z.number().optional().describe("Image height in pixels (default: 1080)"),
  },
  async (args) => {
    const cmd = [
      "python", "flux_generate.py",
      "--prompt", args.prompt,
      "--output", args.outputPath,
    ];
    if (args.width) cmd.push("--width", String(args.width));
    if (args.height) cmd.push("--height", String(args.height));

    const result = await runCommand(cmd, args.outputPath);
    return {
      content: [{ type: "text", text: result.output }],
      isError: !result.success,
    };
  }
);

export const musicgenAudioTool = tool(
  "musicgen_audio",
  "Generate ambient audio using MusicGen (open-source). Fallback when Gemini Lyria is unavailable.",
  {
    prompt: z.string().describe("Descriptive prompt for ambient audio generation"),
    outputPath: z.string().describe("Local file path for the output audio"),
    duration: z.number().optional().describe("Duration in seconds (default: 30)"),
  },
  async (args) => {
    const cmd = [
      "python", "-m", "audiocraft.demos.musicgen_cli",
      "--prompt", args.prompt,
      "--output", args.outputPath,
    ];
    if (args.duration) cmd.push("--duration", String(args.duration));

    const result = await runCommand(cmd, args.outputPath);
    return {
      content: [{ type: "text", text: result.output }],
      isError: !result.success,
    };
  }
);
