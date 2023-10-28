import { Request, Response } from "express";
import { Information } from "../../entity/Information";
import { Famgoal } from "../../entity/Famgoal";
import {Like} from 'typeorm';
import { Familysignup } from "../../entity/Familysingup";
export default async (req: Request, res: Response) => {
    const prefix = req.query.Login as string;
    const candidates = await Information.find();
    const famcandidates = await Famgoal.find({ where: { Login: Like(`${prefix}%`) } });
    const famnames = await Familysignup.find({select: [ "FirstName", "LastName"], where: {Login: Like(`${prefix}%`)}});
    const candidateBlocks = candidates.map(candidate => ({
      name: candidate.candidateName,
      description: candidate.description,
      image: candidate.candidateImage,
    }));
    const famcandidateBlocks = famcandidates.map((candidate, index) => ({
      thing: candidate.name,
      reason: candidate.reason,
      amount: candidate.amount,
      name: `${famnames[index].FirstName} ${famnames[index].LastName}`,
  }));

    return res.json({candidateBlocks, famcandidateBlocks});
 
};
