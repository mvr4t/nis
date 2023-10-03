import { Request, Response } from "express";
import { User } from "../../entity/User";

export default async (req: Request, res: Response) => {
  const users = await User.find({
    select: ["id", "FirstName","LastName", "citizenshipNumber", "email"],
    where: { verified: false },
  });

  return res.send({ users });
};
