import { query } from "@anthropic-ai/claude-agent-sdk";
import { assetToolsServer } from "./mcp/server.js";
import { createAuditorAgent } from "./agents/auditor.js";
import { createGeneratorAgent } from "./agents/generator.js";
import { createBuilderAgent } from "./agents/builder.js";
import { createQAAgent } from "./agents/qa.js";
import {
  PORTFOLIO_ROOT,
  REVAMP_URL,
  SECTIONS,
  MAX_ITERATIONS,
  QA_PASS_THRESHOLD,
  TOTAL_BUDGET_USD,
  ANADOL_PROMPT_PREFIX,
  DOMAIN_PROMPTS,
} from "./config.js";
import type { SDKMessage } from "@anthropic-ai/claude-agent-sdk";

// --- CLI argument parsing ---
const args = process.argv.slice(2);
const isOvernight = args.includes("--overnight");
const isCi = args.includes("--ci");

const mode = isOvernight ? "overnight" : isCi ? "ci" : "interactive";

console.log(`\n╔══════════════════════════════════════════╗`);
console.log(`║  Portfolio Visual Pipeline — ${mode.toUpperCase().padEnd(11)} ║`);
console.log(`╚══════════════════════════════════════════╝\n`);

// --- Ensure tmp directory exists ---
const { mkdirSync } = await import("node:fs");
mkdirSync(`${PORTFOLIO_ROOT}/agents/tmp/qa`, { recursive: true });

// --- Build orchestration prompt ---
const sectionList = SECTIONS.map(
  (s) => `${s.id} (priority ${SECTIONS.indexOf(s) + 1}): selector="${s.selector}", component="${s.component}"`
).join("\n");

const orchestrationPrompt = `You are the orchestrator for a portfolio visual asset pipeline.
Your goal: elevate the revamp page at ${REVAMP_URL} to Refik Anadol-tier quality by generating and integrating visual assets.

## Available Agents
- **auditor**: Navigates the site, screenshots sections, produces AssetBrief[] describing needed assets
- **generator**: Generates video/image/audio assets using Gemini (primary) or open-source (fallback), uploads to Vercel Blob
- **builder**: Wires asset URLs into Astro components following existing conventions
- **qa**: Screenshots sections and scores visual quality 0-10 (pass >= ${QA_PASS_THRESHOLD})

## Sections (in priority order)
${sectionList}

## Anadol Aesthetic Reference
Prompt prefix: "${ANADOL_PROMPT_PREFIX}"
Domain prompts per section:
${Object.entries(DOMAIN_PROMPTS).map(([k, v]) => `- ${k}: "${v}"`).join("\n")}

## Pipeline${isCi ? " (CI MODE — audit + QA only, no generation)" : ""}

### Step 1: Audit
Run the **auditor** agent to scan the revamp page and produce AssetBrief[] for all sections.
Parse the JSON output.

${isCi ? `### Step 2: QA Only
Run the **qa** agent to score the current state.
Report scores and exit.` : `### Step 2: Generate → Build → QA Loop
For each section in priority order (hero first, contact last):

1. Run **generator** with the relevant AssetBrief(s) for this section
2. Run **builder** with the GeneratedAsset(s) to wire them into components
3. Run **qa** to score this section

If QA score < ${QA_PASS_THRESHOLD} and iteration < ${MAX_ITERATIONS}:
  - Feed the QA feedback back to the generator as context
  - Re-run generator → builder → QA

If QA score >= ${QA_PASS_THRESHOLD}: move to next section.
If max iterations reached: log the best score achieved and move on.

### Step 3: Final Verification
After all sections are processed:
1. Run \`cd ${PORTFOLIO_ROOT} && npx astro build\` to verify the full build succeeds
2. Report:
   - Final QA scores for each section
   - Total cost (from the SDK result)
   - Models used per asset
   - Any sections that didn't reach the pass threshold`}
${isOvernight ? `
### Step 4: Auto-Deploy
If the build succeeds and all sections scored >= ${QA_PASS_THRESHOLD - 1} (allowing some tolerance):
Run \`cd ${PORTFOLIO_ROOT} && npx vercel --prod --yes\`
Report the deployment URL.` : ""}

## Rules
- Always try Gemini models first, only fall back to open-source if Gemini fails
- Never use placeholder images — every asset must be real generated content
- Never commit large binary files to git — use Vercel Blob URLs
- Report which quality tier was achieved for each asset
- If the dev server isn't running, start it: \`cd ${PORTFOLIO_ROOT} && npx astro dev &\` and wait 5 seconds
`;

// --- Agent definitions ---
const auditor = createAuditorAgent();
const generator = createGeneratorAgent();
const builder = createBuilderAgent();
const qa = createQAAgent();

// --- Permission mode ---
const permissionMode = isOvernight ? "bypassPermissions" as const : "acceptEdits" as const;

// --- Run the pipeline ---
console.log(`Starting pipeline in ${mode} mode...`);
console.log(`Working directory: ${PORTFOLIO_ROOT}`);
console.log(`Budget: $${TOTAL_BUDGET_USD}`);
console.log(`QA threshold: ${QA_PASS_THRESHOLD}/10`);
console.log(`Max iterations per section: ${MAX_ITERATIONS}\n`);

const q = query({
  prompt: orchestrationPrompt,
  options: {
    cwd: PORTFOLIO_ROOT,
    agents: { auditor, generator, builder, qa },
    allowedTools: [
      "Task", "Read", "Write", "Edit", "Bash", "Glob", "Grep",
      "mcp__playwright__browser_navigate",
      "mcp__playwright__browser_take_screenshot",
      "mcp__playwright__browser_snapshot",
      "mcp__playwright__browser_evaluate",
      "mcp__playwright__browser_wait_for",
      "mcp__playwright__browser_resize",
      "mcp__playwright__browser_close",
      "mcp__asset-tools__gemini_video",
      "mcp__asset-tools__gemini_image",
      "mcp__asset-tools__gemini_audio",
      "mcp__asset-tools__wan21_video",
      "mcp__asset-tools__flux_image",
      "mcp__asset-tools__musicgen_audio",
      "mcp__asset-tools__vercel_blob_upload",
    ],
    mcpServers: {
      "asset-tools": assetToolsServer,
      playwright: { command: "npx", args: ["@playwright/mcp@latest"] },
    },
    permissionMode,
    allowDangerouslySkipPermissions: isOvernight,
    maxBudgetUsd: TOTAL_BUDGET_USD,
    settingSources: ["project"],
    systemPrompt: {
      type: "preset",
      preset: "claude_code",
      append: "Focus on Refik Anadol aesthetic. Every visual must look like data sculpture, not generic AI art.",
    },
    model: "claude-opus-4-6",
    maxTurns: 200,
    effort: "max",
  },
});

// --- Stream and log messages ---
for await (const message of q) {
  logMessage(message);
}

function logMessage(msg: SDKMessage): void {
  switch (msg.type) {
    case "assistant": {
      for (const block of msg.message.content) {
        if ("text" in block && typeof block.text === "string") {
          console.log(`\n🤖 ${block.text}`);
        }
      }
      break;
    }
    case "result": {
      console.log("\n═══════════════════════════════════════");
      console.log(`Pipeline ${msg.subtype}`);
      console.log(`Duration: ${Math.round(msg.duration_ms / 1000)}s`);
      console.log(`Cost: $${msg.total_cost_usd.toFixed(2)}`);
      console.log(`Turns: ${msg.num_turns}`);
      if ("result" in msg) {
        console.log(`\nResult:\n${msg.result}`);
      }
      if ("errors" in msg && msg.errors.length > 0) {
        console.log(`\nErrors:\n${msg.errors.join("\n")}`);
      }
      console.log("═══════════════════════════════════════\n");
      break;
    }
    case "system": {
      if (msg.subtype === "init") {
        console.log(`Session: ${msg.session_id}`);
        console.log(`Model: ${msg.model}`);
        console.log(`Tools: ${msg.tools.length}`);
        console.log(`MCP servers: ${msg.mcp_servers.map((s) => `${s.name}(${s.status})`).join(", ")}`);
      }
      break;
    }
  }
}
