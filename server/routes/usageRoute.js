import express from "express";

import {
  getUsageSummary,
  resetUsage,
} from "../services/usageService.js";

const router = express.Router();

/*
=========================================================
GET TOKEN USAGE
=========================================================
*/

router.get("/", (req, res) => {
  try {
    const usage = getUsageSummary();

    res.status(200).json({
      success: true,
      usage,
    });
  } catch (error) {
    console.error(
      "Get usage error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get token usage.",
    });
  }
});


/*
=========================================================
RESET TOKEN USAGE
=========================================================
*/

router.post("/reset", (req, res) => {
  try {
    const usage = resetUsage();

    res.status(200).json({
      success: true,
      message:
        "Token usage reset successfully.",
      usage,
    });
  } catch (error) {
    console.error(
      "Reset usage error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to reset token usage.",
    });
  }
});


/*
=========================================================
HEALTH / SUMMARY
=========================================================
*/

router.get("/summary", (req, res) => {
  try {
    const usage = getUsageSummary();

    res.status(200).json({
      success: true,
      usage,
    });
  } catch (error) {
    console.error(
      "Usage summary error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get usage summary.",
    });
  }
});


export default router;