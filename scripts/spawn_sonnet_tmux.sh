#!/usr/bin/env bash

# Spawn Claude Sonnet 4 agents in tmux windows for each missing task.
# This script creates a detached tmux session and launches one window per task,
# piping Opus plan + specific instructions to claude --dangerously-skip-permissions.
#
# Usage:
#   scripts/spawn_sonnet_tmux.sh                 # run with defaults
#   scripts/spawn_sonnet_tmux.sh --session s1    # custom session name
#   scripts/spawn_sonnet_tmux.sh --dry-run       # only print the commands
#
# Defaults:
#   MODEL=claude-sonnet-4-20250514
#   PLAN=OPUS_4_1_PLAN_PROMPT.md

set -euo pipefail

SESSION_NAME="sonnet_parallel"
MODEL="claude-sonnet-4-20250514"
PLAN_FILE="OPUS_4_1_PLAN_PROMPT.md"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --session|--session-name)
      SESSION_NAME="$2"; shift 2 ;;
    --model)
      MODEL="$2"; shift 2 ;;
    --plan|--plan-file)
      PLAN_FILE="$2"; shift 2 ;;
    --dry-run)
      DRY_RUN=true; shift ;;
    *)
      echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

if ! command -v tmux >/dev/null 2>&1; then
  echo "ERROR: tmux not found. Please install tmux." >&2
  exit 1
fi
if ! command -v claude >/dev/null 2>&1; then
  echo "ERROR: claude CLI not found. Please install and configure credentials." >&2
  exit 1
fi

if [[ ! -f "$PLAN_FILE" ]]; then
  echo "ERROR: Plan file not found: $PLAN_FILE" >&2
  exit 1
fi

mkdir -p prompts logs/sonnet patches

# Helper to create a prompt file combining the master plan and a targeted instruction
make_prompt() {
  local key="$1"; shift
  local instruction="$*"
  local prompt_file="prompts/${key}.txt"
  {
    cat "$PLAN_FILE"
    echo ""
    echo "INSTRUCTION: $instruction"
  } > "$prompt_file"
  echo "$prompt_file"
}

# Define tasks: key | window name | output path | instruction
declare -a TASKS=(
  "A|comp6-skills|src/components/SkillsRadar.tsx|Implement Prompt A — COMPONENT 6: SkillsRadar.tsx. Output only the complete file content for src/components/SkillsRadar.tsx with strict TypeScript React 19. No commentary."
  "B|comp7-timeline|src/components/Timeline.tsx|Implement Prompt B — COMPONENT 7: Timeline.tsx. Output only the complete file content for src/components/Timeline.tsx. No commentary."
  "C|comp8-testimonials|src/components/Testimonials.tsx|Implement Prompt C — COMPONENT 8: Testimonials.tsx. Output only the complete file content for src/components/Testimonials.tsx. No commentary."
  "D|comp9-mdx|src/utils/mdx.ts|Implement Prompt D — COMPONENT 9: MDX utility. Output only the complete file content for src/utils/mdx.ts. No commentary."
  "E|comp11-sw|public/sw.js|Implement Prompt E — COMPONENT 11: Service Worker. Output only the complete file content for public/sw.js. No commentary."
  "F|comp14-seo|src/utils/seo.tsx|Implement Prompt F — COMPONENT 14: SEO Manager. Output only the complete file content for src/utils/seo.tsx. No commentary."
  "G|comp15-analytics|src/utils/analytics.ts|Implement Prompt G — COMPONENT 15: Analytics. Output only the complete file content for src/utils/analytics.ts. No commentary."
  "H|comp16-three|src/components/ThreeBackground.tsx|Implement Prompt H — COMPONENT 16: ThreeBackground.tsx. Output only the complete file content for src/components/ThreeBackground.tsx. No commentary."
  "I|comp17-api|docs/API_STRATEGY.md|Implement Prompt I — COMPONENT 17: API strategy. Provide a short dev-only router sample (do not alter build). Output a concise strategy document to docs/API_STRATEGY.md including code snippets and feature flag instructions."
  "J|comp19-e2e|tests/e2e.spec.ts|Implement Prompt J — COMPONENT 19: E2E tests. Output only the complete file content for tests/e2e.spec.ts. No commentary."
  "K|fix-i18n|patches/i18n-fixes.diff|Implement Cross-cutting Prompt K — i18n encoding fixes. Output a unified diff patch touching only i18n strings in src/components/SmartNavigation.tsx and src/components/Search.tsx to correct Español and Català."
)

# Build commands for tmux
declare -a TMUX_CMDS=()

for entry in "${TASKS[@]}"; do
  IFS='|' read -r KEY WIN OUT INSTR <<<"$entry"
  PROMPT_FILE=$(make_prompt "$KEY" "$INSTR")
  LOG_FILE="logs/sonnet/${WIN}.log"

  # Command to execute inside tmux window
  if [[ "$OUT" == *.diff ]]; then
    CMD="claude --dangerously-skip-permissions --model $MODEL \"\$(cat $PROMPT_FILE)\" | tee $LOG_FILE > $OUT"
  else
    CMD="claude --dangerously-skip-permissions --model $MODEL \"\$(cat $PROMPT_FILE)\" | tee $LOG_FILE > $OUT"
  fi

  TMUX_CMDS+=("$WIN::$CMD")
done

echo "Session: $SESSION_NAME"
echo "Model:   $MODEL"
echo "Plan:    $PLAN_FILE"

if $DRY_RUN; then
  echo "--- DRY RUN (no tmux session created) ---"
  for pair in "${TMUX_CMDS[@]}"; do
    WIN_NAME="${pair%%::*}"
    CMD_STR="${pair#*::}"
    echo "[window $WIN_NAME] $CMD_STR"
  done
  exit 0
fi

# Create session and first window
FIRST="${TMUX_CMDS[0]}"
FIRST_WIN="${FIRST%%::*}"
FIRST_CMD="${FIRST#*::}"

tmux new-session -d -s "$SESSION_NAME" -n "$FIRST_WIN" "bash -lc '$FIRST_CMD'"

# Other windows
for ((i=1; i<${#TMUX_CMDS[@]}; i++)); do
  pair="${TMUX_CMDS[$i]}"
  WIN_NAME="${pair%%::*}"
  CMD_STR="${pair#*::}"
  tmux new-window -t "$SESSION_NAME:" -n "$WIN_NAME" "bash -lc '$CMD_STR'"
done

echo "tmux session '$SESSION_NAME' created with ${#TMUX_CMDS[@]} windows."
echo "Attach: tmux attach -t $SESSION_NAME"

