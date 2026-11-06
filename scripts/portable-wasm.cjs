#!/usr/bin/env node
"use strict";

// Rebase OpenNext absolute Wasm imports so a CI-built Worker can deploy on Windows.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const root = path.resolve(__dirname, "..", ".open-next");
const mode = process.argv.includes("--verify") ? "verify" : "patch";
if (!fs.existsSync(path.join(root, "worker.js"))) {
  console.error("Missing .open-next/worker.js; build first.");
  process.exit(1);
}
const extensions = new Set([".js", ".mjs", ".cjs"]);
const generatedAbsolute = /(["'])(\/(?:home|opt|tmp|workspace|build|Users|mnt|var)\/[^"'\r\n]+?\.wasm(?:\?module)?)\1/g;
let scanned = 0;
let rebased = 0;
const unresolved = [];

function examine(file) {
  scanned++;
  const original = fs.readFileSync(file, "utf8");
  let updated = original;
  if (mode === "patch") {
    updated = original.replace(generatedAbsolute, (full, quote, absoluteFile) => {
      const source = absoluteFile.replace(/\?module$/, "");
      if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
        unresolved.push({ file, source, error: "Missing source Wasm" });
        return full;
      }
      let target = source;
      const inside = path.relative(root, source);
      if (inside.startsWith(".." + path.sep) || path.isAbsolute(inside)) {
        const digest = crypto.createHash("sha256").update(source).digest("hex").slice(0, 16);
        target = path.join(root, "portable-wasm", digest + "-" + path.basename(source));
        fs.mkdirSync(path.dirname(target), { recursive: true });
        if (!fs.existsSync(target)) fs.copyFileSync(source, target);
      }
      let rel = path.relative(path.dirname(file), target).split(path.sep).join("/");
      if (!rel.startsWith(".")) rel = "./" + rel;
      rebased++;
      return quote + rel + (absoluteFile.endsWith("?module") ? "?module" : "") + quote;
    });
    if (updated !== original) fs.writeFileSync(file, updated, "utf8");
  }
  for (const match of updated.matchAll(generatedAbsolute)) {
    unresolved.push({ file, source: match[2], error: "Absolute Wasm import remains" });
  }
}
function visit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) visit(full);
    else if (entry.isFile() && extensions.has(path.extname(entry.name))) examine(full);
  }
}
visit(root);
if (unresolved.length) {
  for (const bad of unresolved.slice(0, 12)) {
    console.error(bad.error + ": " + path.relative(root, bad.file) + " -> " + bad.source);
  }
  console.error(unresolved.length + " unresolved Wasm paths; refusing to deploy.");
  process.exit(1);
}
console.log(mode + ": scanned " + scanned + " modules; rebased " + rebased + " Wasm imports; no absolute paths remain.");
