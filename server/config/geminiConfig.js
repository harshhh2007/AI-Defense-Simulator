import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
 * server/config/geminiConfig.js
 *
 * Explicitly load:
 * server/.env
 */

const envPath = path.resolve(
  __dirname,
  "..",
  ".env"
);

dotenv.config({
  path: envPath,
});

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY?.trim();

if (!GEMINI_API_KEY) {
  console.error(
    "❌ Gemini API key was not found."
  );

  console.error(
    "Expected .env at:",
    envPath
  );

  throw new Error(
    "GEMINI_API_KEY is missing from server/.env"
  );
}

console.log(
  "✅ Gemini configuration loaded"
);

console.log(
  "✅ Gemini API key available:",
  true
);

console.log(
  "✅ Gemini API key length:",
  GEMINI_API_KEY.length
);

export default GEMINI_API_KEY;