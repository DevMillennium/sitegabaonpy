/**
 * Extrai FAQ e trecho de privacidade do index.html e gera api/knowledge-bundle.js
 * Execute: npm run extract:knowledge
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "index.html");
const outPath = path.join(root, "api", "knowledge-bundle.js");

const html = fs.readFileSync(htmlPath, "utf8");

const faqBlocks = [];
const detailRe =
  /<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g;
let m;
while ((m = detailRe.exec(html)) !== null) {
  const q = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const a = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  faqBlocks.push(`P: ${q}\nR: ${a}`);
}

let privacyChunk = "";
const privSection = html.match(/<section id="privacidad"[^>]*>[\s\S]*?<\/section>/i);
if (privSection) {
  privacyChunk = privSection[0]
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
}

const bundle = [
  "/* Gerado por scripts/extract-knowledge.mjs — ejecutá npm run extract:knowledge tras cambiar el FAQ o privacidad */",
  "export const EXTRACTED_KNOWLEDGE = " +
  JSON.stringify(
    "=== Contenido del sitio (FAQ) ===\n\n" +
    faqBlocks.join("\n\n") +
    (privacyChunk
      ? "\n\n=== Política de privacidad (resumen del sitio) ===\n\n" + privacyChunk
      : "")
  ) +
  ";"
].join("\n");

fs.writeFileSync(outPath, bundle, "utf8");
console.log("Generado:", outPath, "| FAQ items:", faqBlocks.length);
