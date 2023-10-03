import { Request, Response } from "express";
import { getConnection } from "typeorm";

export default async (req: Request, res: Response) => {
  try {
    const name = req.query.FirstName as string;
    const taskId = req.query.TaskID as string;

    // Use a SQL query to update the DeclinedUsers column for the specified TaskID
    const query = `
      UPDATE taskset
      SET AcceptedUser = "${name}" 
      WHERE TaskID = ${taskId}
    `;
    const query2 = `
    UPDATE taskset
    SET status = "accepted" 
    WHERE TaskID = ${taskId}
  `;
    const result = await getConnection().query(query);
    const result2 = await getConnection().query(query2);
    if (result.affectedRows === 1 && result2.affectedRows === 1) {
      return res.send({ message: "Task accepted successfully" });
    } else {
      return res.status(500).send({ error: "Failed to decline task" });
    }
  } catch (error) {
    console.error("Error declining task:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
