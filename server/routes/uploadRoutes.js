import express from "express";
import multer from "multer";
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/pdf",
  upload.single("file"),
  async (req, res) => {
    try {
      const data = new Uint8Array(
        fs.readFileSync(req.file.path)
      );

      const pdf = await pdfjsLib.getDocument({
        data,
      }).promise;

      let text = "";

      for (
        let pageNum = 1;
        pageNum <= pdf.numPages;
        pageNum++
      ) {
        const page = await pdf.getPage(pageNum);

        const content =
          await page.getTextContent();

        const pageText = content.items
          .map((item) => item.str)
          .join(" ");

        text += pageText + "\n";
      }

      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        text,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;