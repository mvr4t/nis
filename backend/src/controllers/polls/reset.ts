import { Request, Response } from "express";
import { getRepository, getManager } from "typeorm";
import { Information } from "../../entity/Information";
import { Famgoal } from "../../entity/Famgoal";
import fs from 'fs';
import path from 'path';

export default async (req: Request, res: Response) => {
  const login = req.query.Login as string;
  const informationRepository = getRepository(Information);
  const entityManager = getManager();

  try {
    // Delete rows in Famgoal where the Login starts with `login`
    await entityManager
    .createQueryBuilder()
    .delete()
    .from(Famgoal)
    .where("Login LIKE :loginPrefix", { loginPrefix: `${login}%` })
    .execute();

    // Clear the Information table
    await informationRepository.clear();

    const uploadFolderPath = path.join(__dirname, "..", "..", "upload");
    fs.readdir(uploadFolderPath, (err, files) => {
      if (err) {
        console.error("Error reading upload folder:", err);
        return res.status(500).send("Error deleting images");
      }

      files.forEach((file) => {
        if (file !== '.gitkeep') {
          fs.unlink(path.join(uploadFolderPath, file), (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }
      });
    });

    return res.send("successful");
  } catch (error) {
    console.error("Error deleting rows:", error);
    return res.status(500).send("Error deleting rows");
  }
};
