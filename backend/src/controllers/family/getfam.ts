import { Request, Response } from "express";
import { Familysignup } from "../../entity/Familysingup";
import { Famgoal } from "../../entity/Famgoal";
import { Like, In} from "typeorm";

export default async (req: Request, res: Response) => {
  const prefix = req.query.Login as string;

  // Find logins in Famgoal that match the given prefix
  const famgoalLogins = await Famgoal.createQueryBuilder("family")
    .select(["family.Login"])
    .where("family.Login LIKE :prefix", { prefix: `${prefix}%` })
    .getMany();

  if (famgoalLogins.length === 0) {
    return res.status(404).send({ error: "No matching logins found in Famgoal" });
  }

  // Extract the matching logins from the result
  const logins = famgoalLogins.map((item) => item.Login);

  // Find users in Familysignup whose Login is in the extracted logins
  const familyNames = await Familysignup.createQueryBuilder("family")
    .select(["family.FirstName", "family.LastName", "family.Login"])
    .where("family.Login IN (:...logins)", { logins })
    .getMany();

  if (familyNames.length === 0) {
    return res.status(404).send({ error: "No matching users found in Familysignup" });
  }
  const detail = await Famgoal.find({
    select: ["name"],
    where: { Login: In(logins) },
  });
  const detailmore = await Famgoal.find({
    select: ["id","name", "amount", "collected"],
    where: { Login: In(logins) },
  });

  if (familyNames.length > 0 && detail) {

    return res.send({ users: familyNames, name: detail, detailmore});
  } else {
    return res.status(404).send({ error: "User or detail not found" });
  }
};
