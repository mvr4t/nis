import { Request, Response } from "express";
import { getRepository } from "typeorm";
import multer from "multer";
import path from "path"; // Add this import

import { Information } from "../../entity/Information";
const uploadImage = path.join(__dirname, "..", "..", "upload");
const storage = multer.diskStorage({
  destination: uploadImage, // Specify the upload folder path
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage }).single("candidateImage");

export default async (req: Request, res: Response) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error handling candidate image:", err);
        return res.status(500).json({ error: "An error occurred while handling candidate image" });
      }

      const { candidateName, info } = req.body;
      const candidateImage = req.file?.filename || "";

      const informationRepository = getRepository(Information);
      const newInformation = new Information();
      newInformation.candidateName = candidateName;
      newInformation.description = info;
      newInformation.candidateImage = candidateImage;

      await informationRepository.save(newInformation);

      res.status(201).json({ message: "Candidate info saved successfully" });
    });
  } catch (error) {
    console.error("Error handling candidate info:", error);
    res.status(500).json({ error: "An error occurred while saving candidate info" });
  }
};
