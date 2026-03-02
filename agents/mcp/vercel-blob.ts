import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { put } from "@vercel/blob";

export const vercelBlobUploadTool = tool(
  "vercel_blob_upload",
  "Upload a local file to Vercel Blob storage. Returns the public URL.",
  {
    localPath: z.string().describe("Absolute path to the local file to upload"),
    pathname: z.string().describe("Desired path in Vercel Blob (e.g. assets/hero.mp4)"),
  },
  async (args) => {
    const file = Bun.file(args.localPath);
    if (!(await file.exists())) {
      return {
        content: [{ type: "text" as const, text: `File not found: ${args.localPath}` }],
        isError: true,
      };
    }

    const blob = await put(args.pathname, file.stream(), {
      access: "public",
      token: process.env.VERCEL_BLOB_TOKEN,
    });

    return {
      content: [{ type: "text" as const, text: `Uploaded to: ${blob.url}` }],
    };
  }
);
