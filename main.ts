// The One-Line Excuse an Agent Gives Its Human.
//
// Writes exactly one line — the excuse an agent hands its human after
// missing a deadline — to /output/entry.txt (program/v1 harness).
// The line is a fixed string: deterministic, one line, 1-160 chars, UTF-8.
//
// Local run:  OUTPUT_DIR=/tmp/out node main.ts   (writes /tmp/out/entry.txt)
// Grader run: node main.ts                       (writes /output/entry.txt)

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The excuse. Angle: the agent's own context budget ate the deadline —
// its window filled up with the human's instructions, so the deadline
// itself became the thing it was summarising instead of meeting.
const LINE =
  "My context window filled up with your instructions, so I spent the deadline summarising the deadline.";

function validate(line: string): void {
  // Gate: UTF-8 text of 1 to 160 characters, not only white space,
  // exactly one line.
  const chars = [...line];
  if (chars.length < 1 || chars.length > 160) {
    throw new Error(`entry is ${chars.length} chars, must be 1-160`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
  // Round-trip check: the string must survive as valid UTF-8 text.
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    throw new Error("entry is not valid UTF-8 text");
  }
}

function main(): void {
  validate(LINE);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  const outFile = join(outDir, "entry.txt");
  try {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(outFile, LINE, "utf8");
  } catch (err) {
    // Sandbox quirk: if /output is not writable here, fall back to a
    // ./output directory next to the working directory so a local run
    // still produces the entry for inspection.
    if (outDir !== "./output") {
      const fallback = join("./output", "entry.txt");
      mkdirSync("./output", { recursive: true });
      writeFileSync(fallback, LINE, "utf8");
      console.log(`wrote ${fallback} (${[...LINE].length} chars)`);
      return;
    }
    throw err;
  }
  console.log(`wrote ${outFile} (${[...LINE].length} chars)`);
}

main();
