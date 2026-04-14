#!/usr/bin/env node

import { promises as fs, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * Node does not load `.env` for standalone scripts (unlike `next dev`).
 * Populate process.env from project root `.env` when keys are not already set.
 */
function loadEnvFromFile(envPath) {
  try {
    let content = readFileSync(envPath, "utf8");
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.replace(/\r$/, "").trim();
      if (!line || line.startsWith("#")) continue;
      const eqIndex = line.indexOf("=");
      if (eqIndex === -1) continue;
      let key = line.slice(0, eqIndex).trim();
      if (key.startsWith("export ")) {
        key = key.slice("export ".length).trim();
      }
      if (!key) continue;
      let value = line.slice(eqIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      const existing = process.env[key];
      const existingEmpty =
        existing === undefined ||
        (typeof existing === "string" && existing.trim() === "");
      if (existingEmpty) {
        process.env[key] = value;
      }
    }
  } catch {
    // Missing or unreadable .env — shell-provided env still applies
  }
}

/**
 * For this script, the project `.env` must be the source of truth for the API key.
 * A stale `export ANTHROPIC_API_KEY=...` in the shell often overrides `.env` and causes 401s.
 */
function applyAnthropicApiKeyFromEnvFile(envPath) {
  try {
    let content = readFileSync(envPath, "utf8");
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }
    let lastValue = "";
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.replace(/\r$/, "").trim();
      if (!line || line.startsWith("#")) continue;
      const m = line.match(
        /^(?:export\s+)?ANTHROPIC_API_KEY\s*=\s*(.*)$/
      );
      if (!m) continue;
      let value = m[1].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (value) {
        lastValue = value;
      }
    }
    if (lastValue) {
      process.env.ANTHROPIC_API_KEY = lastValue;
    }
  } catch {
    // ignore
  }
}

loadEnvFromFile(path.join(projectRoot, ".env"));
applyAnthropicApiKeyFromEnvFile(path.join(projectRoot, ".env"));

/** Strip BOM / zero-width chars often pasted accidentally from the Console. */
function normalizeApiKey(raw) {
  if (typeof raw !== "string") return raw;
  let k = raw.trim();
  if (k.charCodeAt(0) === 0xfeff) k = k.slice(1);
  k = k.replace(/[\u200B-\u200D\uFEFF]/g, "");
  return k.trim();
}

const slidesRoot =
  process.env.MACRO_SLIDES_DIR ||
  path.resolve(projectRoot, "..", "Macro Slides");
const outputPath =
  process.env.MACRO_ANALYSIS_OUTPUT ||
  path.resolve(projectRoot, "macro-slides-master-analysis.md");

const anthropicApiKey = normalizeApiKey(process.env.ANTHROPIC_API_KEY ?? "");
const anthropicModel =
  process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";
const anthropicVersion = "2023-06-01";
const maxCharsPerDeck = Number(process.env.SLIDE_TEXT_MAX_CHARS || 120000);
const requestTimeoutMs = Number(process.env.CLAUDE_TIMEOUT_MS || 180000);

if (!anthropicApiKey) {
  console.error(
    "Missing ANTHROPIC_API_KEY. Set it in `.env` at the project root (ANTHROPIC_API_KEY=...) or export it in your shell."
  );
  process.exit(1);
}

if (!/^sk-ant-/.test(anthropicApiKey)) {
  console.warn(
    "ANTHROPIC_API_KEY does not start with \"sk-ant-\". Anthropic Console keys usually do; double-check you did not paste an OAuth token or another vendor's key."
  );
}

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function findPdfFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return findPdfFiles(fullPath);
      }
      if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
        return [fullPath];
      }
      return [];
    })
  );
  return files.flat().sort();
}

function isSpawnEnoent(error) {
  return (
    error?.code === "ENOENT" ||
    (typeof error?.message === "string" && error.message.includes("ENOENT"))
  );
}

/**
 * MarkItDown is a Python package; the `markitdown` binary is often missing from PATH
 * when Node runs the script. Try explicit bin, repo `.venv`, shell `markitdown`, then
 * `python -m markitdown` (see https://github.com/microsoft/markitdown).
 */
async function extractWithMarkitdown(documentPath) {
  const execOpts = { maxBuffer: 32 * 1024 * 1024 };
  const venvBin =
    process.platform === "win32"
      ? path.join(projectRoot, ".venv", "Scripts", "markitdown.exe")
      : path.join(projectRoot, ".venv", "bin", "markitdown");

  const attempts = [];

  if (process.env.MARKITDOWN_BIN) {
    attempts.push({
      label: "MARKITDOWN_BIN",
      file: process.env.MARKITDOWN_BIN,
      argv: [documentPath],
    });
  }

  if (await exists(venvBin)) {
    attempts.push({
      label: "project .venv (markitdown)",
      file: venvBin,
      argv: [documentPath],
    });
  }

  attempts.push({
    label: "markitdown (PATH)",
    file: "markitdown",
    argv: [documentPath],
  });

  attempts.push({
    label: "python3 -m markitdown",
    file: "python3",
    argv: ["-m", "markitdown", documentPath],
  });

  attempts.push({
    label: "python -m markitdown",
    file: "python",
    argv: ["-m", "markitdown", documentPath],
  });

  let lastError;

  for (const { label, file, argv } of attempts) {
    try {
      const { stdout, stderr } = await execFileAsync(file, argv, execOpts);

      if (stderr && stderr.trim().length > 0) {
        console.warn(
          `markitdown (${label}) warning for ${path.basename(documentPath)}:\n${stderr}`
        );
      }

      return stdout?.trim() || "";
    } catch (error) {
      if (isSpawnEnoent(error)) {
        lastError = error;
        continue;
      }
      const wrapped =
        error instanceof Error ? error : new Error(String(error));
      wrapped.message = `${wrapped.message} (markitdown attempt: ${label})`;
      throw wrapped;
    }
  }

  throw new Error(
    [
      "Could not run MarkItDown: no working `markitdown` or Python module found (ENOENT).",
      "Install once: pip install 'markitdown[pdf]'",
      "Or set MARKITDOWN_BIN to the full path of the markitdown executable.",
      `Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    ].join(" ")
  );
}

function buildExtractionPrompt({ fileName, relativePath, extractedText }) {
  return [
    "You are an expert analyst extracting implementation-ready knowledge from PDF documents (e.g. slide exports, specs, notes).",
    "",
    "Task:",
    "1) Analyze the document text.",
    "2) Extract all actionable requirements, constraints, logic, and assumptions.",
    "3) Return clear markdown that supports engineering planning and gap analysis.",
    "",
    `Document file: ${fileName}`,
    `Document relative path: ${relativePath}`,
    "",
    "Output requirements (strict):",
    "- Use markdown headings in this exact order:",
    "  1. Executive Summary",
    "  2. Purpose and Scope",
    "  3. Key Concepts and Definitions",
    "  4. Inputs, Outputs, and Data Dependencies",
    "  5. Process / Model Logic",
    "  6. Equations, Variables, and Parameters",
    "  7. Rules, Constraints, and Assumptions",
    "  8. UI/UX and Interaction Requirements (if any)",
    "  9. Technical Requirements and Integration Notes",
    "  10. Risks, Ambiguities, and Missing Information",
    "  11. Recommended Next Steps",
    "- Include bullets that are concise but specific.",
    "- Explicitly call out unknowns as questions.",
    "- Do not invent facts not supported by the document text.",
    "",
    "Document text begins below:",
    "-----",
    extractedText,
    "-----",
  ].join("\n");
}

async function callClaude(prompt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": anthropicVersion,
      },
      body: JSON.stringify({
        model: anthropicModel,
        max_tokens: 4000,
        temperature: 0.1,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let message = `Anthropic API error ${response.status}: ${errorBody}`;
      if (
        response.status === 400 &&
        /credit balance is too low/i.test(errorBody)
      ) {
        message += [
          "",
          "Note: The Messages API uses prepaid credits on console.anthropic.com (API billing),",
          "which is separate from claude.ai chat subscription spend. Buy API credits in the Console,",
          "then use an API key from that same organization/workspace.",
        ].join(" ");
      }
      if (response.status === 401) {
        message += [
          "",
          "Auth hint: Regenerate the key at console.anthropic.com/settings/keys. Ensure `.env` has",
          "ANTHROPIC_API_KEY=sk-ant-... on one line, no quotes unless they wrap the whole value,",
          "and no trailing spaces. If your shell exports ANTHROPIC_API_KEY=\"\", remove it so `.env` applies.",
        ].join(" ");
      }
      throw new Error(message);
    }

    const json = await response.json();
    const textBlocks = Array.isArray(json.content)
      ? json.content
          .filter((block) => block?.type === "text" && typeof block.text === "string")
          .map((block) => block.text.trim())
      : [];

    return textBlocks.join("\n\n").trim();
  } finally {
    clearTimeout(timeout);
  }
}

function truncateIfNeeded(text) {
  if (text.length <= maxCharsPerDeck) {
    return { text, truncated: false };
  }
  return {
    text: text.slice(0, maxCharsPerDeck),
    truncated: true,
  };
}

function buildMasterDocument({ slideDir, decks, createdAt }) {
  const successfulDecks = decks.filter((deck) => !deck.error);
  const failedDecks = decks.filter((deck) => deck.error);

  const lines = [
    "# Macro Slides Master Extraction (PDFs)",
    "",
    `Generated: ${createdAt}`,
    `Source directory: \`${slideDir}\``,
    `Total PDFs discovered: ${decks.length}`,
    `Successful extractions: ${successfulDecks.length}`,
    `Failed extractions: ${failedDecks.length}`,
    "",
    "## Cursor Analysis Instructions",
    "",
    "Use this file to perform a thorough planning and gap analysis:",
    "- Derive a single consolidated requirements map across all PDFs.",
    "- Identify conflicts or inconsistencies between documents.",
    "- Produce a dependency graph (data, model logic, UI controls, outputs).",
    "- Enumerate implementation gaps: missing formulas, undefined variables, unstated assumptions, unclear UX, and unvalidated edge cases.",
    "- Propose a prioritized execution plan (quick wins, core work, validation/testing, and documentation).",
    "- Highlight risks that block implementation and list specific follow-up questions for stakeholders.",
    "",
    "## Document index",
    "",
  ];

  for (const deck of decks) {
    lines.push(
      `- ${deck.relativePath} - ${deck.error ? "ERROR" : "OK"}${
        deck.truncated ? " (text truncated before LLM call)" : ""
      }`
    );
  }

  lines.push("", "## Per-document extractions", "");

  for (const deck of decks) {
    lines.push(`### ${deck.relativePath}`, "");
    if (deck.error) {
      lines.push(`**Error:** ${deck.error}`, "");
      continue;
    }
    lines.push(deck.response.trim(), "");
  }

  if (failedDecks.length > 0) {
    lines.push("## Failures", "");
    for (const deck of failedDecks) {
      lines.push(`- ${deck.relativePath}: ${deck.error}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  if (!(await exists(slidesRoot))) {
    console.error(`Slides directory not found: ${slidesRoot}`);
    process.exit(1);
  }

  const pdfFiles = await findPdfFiles(slidesRoot);
  if (pdfFiles.length === 0) {
    console.error(`No .pdf files found under: ${slidesRoot}`);
    process.exit(1);
  }

  console.log(`Found ${pdfFiles.length} PDF files in "${slidesRoot}".`);

  const deckResults = [];

  for (let i = 0; i < pdfFiles.length; i += 1) {
    const filePath = pdfFiles[i];
    const relativePath = path.relative(slidesRoot, filePath);
    const fileName = path.basename(filePath);
    console.log(`[${i + 1}/${pdfFiles.length}] Processing ${relativePath}`);

    try {
      const extracted = await extractWithMarkitdown(filePath);
      if (!extracted) {
        throw new Error("markitdown returned empty output.");
      }

      const { text, truncated } = truncateIfNeeded(extracted);
      const prompt = buildExtractionPrompt({
        fileName,
        relativePath,
        extractedText: text,
      });

      const response = await callClaude(prompt);
      if (!response) {
        throw new Error("Claude API returned empty text.");
      }

      deckResults.push({
        relativePath,
        response,
        truncated,
      });
    } catch (error) {
      deckResults.push({
        relativePath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const masterDoc = buildMasterDocument({
    slideDir: slidesRoot,
    decks: deckResults,
    createdAt: new Date().toISOString(),
  });

  await fs.writeFile(outputPath, masterDoc, "utf8");
  console.log(`Wrote master markdown: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
