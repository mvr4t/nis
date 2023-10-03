import { Request, Response } from "express";
import { getRepository } from "typeorm";
import {Information} from "../../entity/Information"; 
import fs from 'fs';
import path from 'path';


export default async (_: Request, res: Response) => {


  const informationRepository = getRepository(Information);
  await informationRepository.clear();

  const uploadFolderPath = path.join(__dirname, "..", "..", "upload");
  fs.readdir(uploadFolderPath, (err, files) => {
    if (err) {
      console.error("Error reading upload folder:", err);
      return res.status(500).send("Error deleting images");
    }

    files.forEach((file) => {
      fs.unlink(path.join(uploadFolderPath, file), (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    });
  });


  return res.send("successful");
};
