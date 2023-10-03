import { Request, Response } from "express";
import { Familysignup } from "../../entity/Familysingup";
export default async (req: Request, res: Response) => {
  const login = req.query.Login as string;
  const userp = await Familysignup.findOne({
    select: ["password"],
    where: {Login: login},
  });
    return res.send(userp);
  
};
