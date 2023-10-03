import { Request, Response } from "express";
import { StudentsCurator } from "../../entity/StudentsCurator";

export default async (req: Request, res: Response) => {
  const citizennumber = await StudentsCurator.find({
    select: ["citizenshipNumber"],
  });

  return res.send({ citizennumber });
};
