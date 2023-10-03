import { Request, Response } from "express";
import { Taskset } from "../../entity/Taskset"; // Import your TaskSet entity
import { Like } from "typeorm"; // Import Like function from TypeORM
import { Familysignup } from "../../entity/Familysingup";
export default async (req: Request, res: Response) => {
  try {
    const prefix = req.query.prefix as string;
    const tasks = await Taskset.find({ where: { Login: Like(`${prefix}%`) } });

    if (tasks.length > 0) {
      const uniqueLogins = Array.from(new Set(tasks.map((task) => task.Login)));
      const familyNames = await Familysignup.createQueryBuilder("family")
        .select(["family.FirstName", "family.LastName", "family.Login"]) // Adjust the properties you need
        .where("family.Login IN (:...logins)", { logins: uniqueLogins })
        .getMany();
      return res.send({ tasks, familyNames });
    } else {
      return res.status(404).send({ error: "No tasks found" });
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
