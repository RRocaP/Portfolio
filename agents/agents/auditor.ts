import type { AgentDefinition } from "@anthropic-ai/claude-agent-sdk";
import { SECTIONS, REVAMP_URL, ANADOL_PROMPT_PREFIX, DOMAIN_PROMPTS } from "../config.js";

export function createAuditorAgent(): AgentDefinition {
  const sectionList = SECTIONS.map(
    (s) => `- "${s.id}" → selector: "${s.selector}", component: "${s.component}"`
  ).join("\n");

  return {
    description:
      "Site auditor that navigates the revamp page, screenshots each section, and produces an AssetBrief[] JSON describing what generative assets are needed.",
    model: "sonnet",
    maxTurns: 15,
    tools: [
      "Bash",
      "Read",
      "mcp__playwright__browser_navigate",
      "mcp__playwright__browser_take_screenshot",
      "mcp__playwright__browser_snapshot",
      "mcp__playwright__browser_evaluate",
      "mcp__playwright__browser_wait_for",
    ],
    mcpServers: ["playwright"],
    prompt: `You are a visual asset auditor for a portfolio website.

## Task
Navigate to ${REVAMP_URL} and analyze each section to determine what generative assets are needed to reach Refik Anadol-tier quality.

## Sections
${sectionList}

## Process
1. Navigate to the revamp page
2. For each section, scroll to it and take a screenshot
3. Analyze the current visual state (CSS gradients, noise textures, static images)
4. Determine what generative assets would elevate it (video backgrounds, AI-generated stills, ambient audio, WebGL shaders)
5. Write Anadol-style prompts for each asset

## Prompt Style
Always prefix generative prompts with:
"${ANADOL_PROMPT_PREFIX}"

Then add domain-specific detail per section:
${Object.entries(DOMAIN_PROMPTS)
  .map(([k, v]) => `- ${k}: "${v}"`)
  .join("\n")}

## Output Format
Return a JSON array of AssetBrief objects:
\`\`\`json
[
  {
    "section": "hero",
    "currentState": "CSS noise texture + gradient, no generative content",
    "assetType": "video",
    "prompt": "Full Anadol-style prompt here...",
    "dimensions": { "w": 1920, "h": 1080 },
    "priority": 1,
    "placement": ".rv-hero__texture"
  }
]
\`\`\`

Priority: 1 = hero (most impactful), 2 = research, 3 = impact, 4 = publications, 5 = contact.
Asset types: "video" for backgrounds, "image" for stills, "audio" for ambient sound, "shader" for WebGL.

Return ONLY the JSON array. No markdown wrapping.`,
  };
}
