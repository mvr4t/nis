import { Request, Response } from "express";
import { Familysignup } from "../../entity/Familysingup";
import { Famgoal } from "../../entity/Famgoal";
import { bool } from "yup";
export default async (req: Request, res: Response) => {
  const login = req.query.Login as string;
  const user= await Familysignup.findOne({
    where: {Login: login},
  });
  let isfirst = false;
  if (user?.firstuser) {
    isfirst = true;
    return res.send({isfirst});
  } else {
    isfirst = false;
    return res.send({isfirst});
  };
};
