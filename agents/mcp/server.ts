import { createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { geminiVideoTool, geminiImageTool, geminiAudioTool } from "./gemini-tools.js";
import { wan21VideoTool, fluxImageTool, musicgenAudioTool } from "./opensource-tools.js";
import { vercelBlobUploadTool } from "./vercel-blob.js";

export const assetToolsServer = createSdkMcpServer({
  name: "asset-tools",
  version: "1.0.0",
  tools: [
    geminiVideoTool,
    geminiImageTool,
    geminiAudioTool,
    wan21VideoTool,
    fluxImageTool,
    musicgenAudioTool,
    vercelBlobUploadTool,
  ],
});
