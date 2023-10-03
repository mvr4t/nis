import { Request, Response } from "express";
import { getConnection } from "typeorm";

export default async (req: Request, res: Response) => {
  try {
    const userLogin = req.query.Login as string;
    const taskId = req.query.TaskID as string;

    // Use a SQL query to update the DeclinedUsers column for the specified TaskID
    const query = `
      UPDATE taskset
      SET DeclinedUsers = JSON_ARRAY_APPEND(
        COALESCE(DeclinedUsers, JSON_ARRAY()),
        "$",
        "${userLogin}"
      )
      WHERE TaskID = ${taskId}
    `;

    const result = await getConnection().query(query);

    if (result.affectedRows === 1) {
      return res.send({ message: "Task declined successfully" });
    } else {
      return res.status(500).send({ error: "Failed to decline task" });
    }
  } catch (error) {
    console.error("Error declining task:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
