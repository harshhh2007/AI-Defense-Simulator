import {
  generateQuestion,
  evaluateAnswer,
  chatWithProject,
} from "../services/geminiService.js";

/* =========================================================
   GENERATE VIVA QUESTION
========================================================= */

export const askQuestion = async (req, res) => {
  try {
    const {
      projectContext = "",
      difficulty = "easy",
    } = req.body || {};

    console.log("Generating viva question...");
    console.log("Difficulty:", difficulty);

    const question = await generateQuestion(
      projectContext,
      difficulty
    );

    if (!question || !String(question).trim()) {
      throw new Error(
        "VivaAI did not return a question."
      );
    }

    return res.status(200).json({
      success: true,
      question: String(question).trim(),
    });

  } catch (error) {
    console.error(
      "Question Generation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate viva question.",
      errorType:
        error.name ||
        "QuestionGenerationError",
    });
  }
};


/* =========================================================
   EVALUATE VIVA ANSWER
========================================================= */

export const checkAnswer = async (req, res) => {
  try {
    const {
      question = "",
      answer = "",
      projectContext = "",
    } = req.body || {};

    console.log("Evaluating viva answer...");

    const evaluation = await evaluateAnswer({
      question,
      answer,
      projectContext,
    });

    if (
      !evaluation ||
      !String(evaluation).trim()
    ) {
      throw new Error(
        "VivaAI did not return an evaluation."
      );
    }

    return res.status(200).json({
      success: true,
      evaluation: String(evaluation).trim(),
    });

  } catch (error) {
    console.error(
      "Answer Evaluation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to evaluate answer.",
      errorType:
        error.name ||
        "AnswerEvaluationError",
    });
  }
};


/* =========================================================
   PROJECT AI CHAT
========================================================= */

export const projectChat = async (req, res) => {
  try {
    const {
      projectContext = "",
      conversation = [],
      userMessage = "",
      message = "",
    } = req.body || {};

    const finalMessage =
      userMessage || message;

    if (
      !finalMessage ||
      !String(finalMessage).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a message.",
      });
    }

    console.log(
      "Project AI message:",
      finalMessage
    );

    const response = await chatWithProject(
      projectContext,
      conversation,
      finalMessage
    );

    if (
      !response ||
      !String(response).trim()
    ) {
      throw new Error(
        "VivaAI returned an empty response."
      );
    }

    return res.status(200).json({
      success: true,
      response: String(response).trim(),
      message: String(response).trim(),
    });

  } catch (error) {
    console.error(
      "Project Chat Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Project AI request failed.",
      errorType:
        error.name ||
        "ProjectChatError",
    });
  }
};


/* =========================================================
   ALIASES
   Keeps compatibility with older frontend/backend code
========================================================= */

export const generateVivaQuestion =
  askQuestion;

export const evaluateVivaAnswer =
  checkAnswer;

export const chatWithProjectAI =
  projectChat;


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  askQuestion,
  checkAnswer,
  projectChat,
  generateVivaQuestion,
  evaluateVivaAnswer,
  chatWithProjectAI,
};