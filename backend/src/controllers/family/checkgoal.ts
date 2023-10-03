import { Request, Response } from "express";
import { Famgoal } from "../../entity/Famgoal";

export default async (req: Request, res: Response) => {
  const login = req.query.Login as string;
  const goals = await Famgoal.find({ where: { Login: login } });
  const goalExists = goals.length > 0; 

  console.log(goalExists, "its reached");
  return res.send({ goalExists });
};

