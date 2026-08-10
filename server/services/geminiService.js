import { GoogleGenerativeAI } from "@google/generative-ai";
import GEMINI_API_KEY from "../config/geminiConfig.js";

/* =========================================================
   GEMINI CONFIGURATION
========================================================= */

const MODEL_NAME = "gemini-3.5-flash";

if (!GEMINI_API_KEY) {
  console.error("❌ Gemini API key is missing.");
} else {
  console.log("✅ Gemini API key loaded.");
  console.log("✅ Gemini model:", MODEL_NAME);
}

/* =========================================================
   GEMINI CLIENT
========================================================= */

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/* =========================================================
   GET MODEL
========================================================= */

function getModel() {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key is missing. Check server/config/geminiConfig.js and server/.env."
    );
  }

  return genAI.getGenerativeModel({
    model: MODEL_NAME,
  });
}

/* =========================================================
   ERROR FORMATTER
========================================================= */

function formatGeminiError(error) {
  const message =
    error?.message ||
    error?.errorDetails?.[0]?.message ||
    "Unknown Gemini API error.";

  const status =
    error?.status ||
    error?.response?.status ||
    null;

  if (status === 429 || message.includes("429")) {
    return new Error(
      "Gemini quota exceeded. Your Google API project currently has no available quota for this model."
    );
  }

  if (
    status === 401 ||
    status === 403 ||
    message.toLowerCase().includes("api key")
  ) {
    return new Error(
      "Gemini authentication failed. Check the Gemini API key and Google API project."
    );
  }

  if (
    status === 400 &&
    message.toLowerCase().includes("model")
  ) {
    return new Error(
      `Gemini model "${MODEL_NAME}" was rejected by the API.`
    );
  }

  return new Error(message);
}

/* =========================================================
   GENERIC GEMINI REQUEST
========================================================= */

export async function callGemini(prompt) {
  if (!prompt || !String(prompt).trim()) {
    throw new Error("Gemini prompt is empty.");
  }

  try {
    console.log("🤖 Gemini request started.");
    console.log("Model:", MODEL_NAME);

    const model = getModel();

    const result = await model.generateContent(
      String(prompt)
    );

    const response = result?.response;

    if (!response) {
      throw new Error(
        "Gemini returned no response object."
      );
    }

    const text = response.text();

    if (!text || !text.trim()) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    console.log("✅ Gemini response received.");

    return text.trim();

  } catch (error) {
    const formattedError =
      formatGeminiError(error);

    console.error(
      "❌ Gemini API Error:"
    );

    console.error(
      formattedError.message
    );

    console.error(
      "Original error:",
      error
    );

    throw formattedError;
  }
}

/* =========================================================
   GENERATE VIVA QUESTION
========================================================= */

export async function generateQuestion(
  projectContext = ""
) {
  const prompt = `
You are VivaAI, an academic project defense assistant.

Generate ONE technical viva question based on the student's project.

PROJECT CONTEXT:
${
  projectContext ||
  "No project context provided."
}

Rules:

- Ask exactly one question.
- Make it suitable for a student viva.
- Make it directly related to the project.
- Prefer technical questions.
- Test understanding rather than memorization.
- Do not provide the answer.
- Do not include multiple questions.
- Do not include explanations before the question.

Return only the question.
`;

  return callGemini(prompt);
}

/* =========================================================
   VIVA QUESTION ALIAS
========================================================= */

export async function generateVivaQuestion(
  projectContext = ""
) {
  return generateQuestion(
    projectContext
  );
}

/* =========================================================
   EVALUATE VIVA ANSWER
========================================================= */

export async function evaluateAnswer(
  questionOrData = "",
  answer = "",
  projectContext = ""
) {
  let question = questionOrData;

  /* Support object argument */

  if (
    questionOrData &&
    typeof questionOrData === "object"
  ) {
    question =
      questionOrData.question ||
      questionOrData.questionText ||
      "";

    answer =
      questionOrData.answer ||
      questionOrData.userAnswer ||
      "";

    projectContext =
      questionOrData.projectContext ||
      questionOrData.project ||
      "";
  }

  const prompt = `
You are VivaAI, an academic viva evaluator.

Evaluate the student's answer to the viva question.

PROJECT CONTEXT:
${
  projectContext ||
  "No project context provided."
}

QUESTION:
${question || "No question provided."}

STUDENT ANSWER:
${answer || "No answer provided."}

Evaluate the answer fairly.

Return exactly this structure:

SCORE: X/10

VERDICT:
[short verdict]

STRENGTHS:
- [strength]
- [strength]

WEAKNESSES:
- [weakness]
- [weakness]

IMPROVEMENT:
[how the student can improve]

IDEAL ANSWER:
[ideal technical answer]

Rules:

- Score from 0 to 10.
- Be constructive.
- Do not be unnecessarily harsh.
- Focus on technical correctness.
- Focus on understanding.
- Focus on clarity.
- Do not invent project information.
`;

  return callGemini(prompt);
}

/* =========================================================
   ASK GEMINI
========================================================= */

export async function askGemini(
  prompt
) {
  return callGemini(prompt);
}

/* =========================================================
   PROJECT CHAT
========================================================= */

export async function chatWithProject(
  projectContext = "",
  conversation = [],
  userMessage = ""
) {
  const history =
    Array.isArray(conversation)
      ? conversation
          .map((message) => {
            const role =
              message?.role === "assistant"
                ? "AI"
                : "Student";

            return `${role}: ${
              message?.content || ""
            }`;
          })
          .join("\n")
      : "";

  const prompt = `
You are VivaAI, an education-focused AI assistant.

Help the student understand and defend their academic project.

PROJECT CONTEXT:
${
  projectContext ||
  "No project context provided."
}

PREVIOUS CONVERSATION:
${
  history ||
  "No previous conversation."
}

STUDENT MESSAGE:
${userMessage || "No message provided."}

Instructions:

- Answer clearly.
- Stay focused on the student's project.
- Explain technical concepts simply when useful.
- Help the student prepare for their viva.
- Do not invent project information.
- If information is missing, clearly say that it is not available.
`;

  return callGemini(prompt);
}

/* =========================================================
   TEST GEMINI CONNECTION
========================================================= */

export async function testGeminiConnection() {
  try {
    const result = await callGemini(
      "Reply with exactly: Gemini connection successful."
    );

    return {
      success: true,
      message: result,
      model: MODEL_NAME,
    };

  } catch (error) {
    return {
      success: false,
      message:
        error?.message ||
        "Gemini connection failed.",
      model: MODEL_NAME,
    };
  }
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  callGemini,
  askGemini,
  generateQuestion,
  generateVivaQuestion,
  evaluateAnswer,
  chatWithProject,
  testGeminiConnection,
};