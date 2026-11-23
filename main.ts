import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My plant died despite the app that was supposed to remind me to water it, which now reminds me to buy a new plant.";

function resolveOutDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || "/output";
}

function charCount(line: string): number {
  return [...line].length;
}

function validateLine(line: string): void {
  const chars = charCount(line);
  if (chars < 1 || chars > 200) {
    throw new Error(`line must be 1-200 characters, got ${chars}`);
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    throw new Error("line is not valid UTF-8 round-trip text");
  }
}

function verifyWritten(target: string, line: string): void {
  const back = readFileSync(target, "utf8");
  if (back !== line) {
    throw new Error("read-back mismatch after writing entry.txt");
  }
}

function writeEntry(outDir: string, line: string): void {
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, line, "utf8");
  verifyWritten(target, line);
}

function main(): void {
  validateLine(LINE);
  writeEntry(resolveOutDir(), LINE);
}

main();
