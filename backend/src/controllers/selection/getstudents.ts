import { Request, Response } from "express";
import { StudentsCurator } from "../../entity/StudentsCurator";
import { User } from "../../entity/User";

export default async (req: Request, res: Response) => {
  const CuratorName = req.query.CuratorName as string;
  const authnumber = req.query.authnumber as string;
  const curators = await StudentsCurator.find({
    select: ["CuratorName"],
    where: { citizenshipNumber: authnumber}
  });
  const grade = await StudentsCurator.find({
    select: ["Grade"], where: { citizenshipNumber: authnumber}
  });
  const allgrade = await StudentsCurator.find({select: ["Grade"], where:{CuratorName: CuratorName}});
  const students = await StudentsCurator.find({
    select: ["citizenshipNumber"],
    where: { CuratorName: CuratorName },
  });
  const citizenshipNumbers = [];
  for (let i = 0; i < students.length; i++) {
    const citizenshipNumber = students[i].citizenshipNumber;
    const user = await User.findOne({
      select: ["FirstName", "LastName"],
      where: { citizenshipNumber: citizenshipNumber },
    });

    if (user) {
      citizenshipNumbers.push(user);
    }
  }

  return res.json({ citizenshipNumbers, curators, grade, allgrade});
};
