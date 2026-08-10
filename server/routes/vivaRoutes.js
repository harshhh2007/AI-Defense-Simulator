import express from "express";

import {
  askQuestion,
  checkAnswer,
  projectChat,
} from "../controllers/vivaController.js";

const router = express.Router();


/* =========================================================
   GENERATE QUESTION
========================================================= */

router.post(
  "/question",
  askQuestion
);


/* =========================================================
   EVALUATE ANSWER
========================================================= */

router.post(
  "/answer",
  checkAnswer
);


/* =========================================================
   PROJECT AI CHAT
========================================================= */

router.post(
  "/chat",
  projectChat
);


export default router;