import { Request, Response } from "express";
import { Information } from "../../entity/Information";

export default async (req: Request, res: Response) => {
 
    const candidates = await Information.find();

    const candidateBlocks = candidates.map(candidate => ({
      name: candidate.candidateName,
      description: candidate.description,
      image: candidate.candidateImage,
    }));

    return res.json({candidateBlocks});
 
};
