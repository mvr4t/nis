// Import necessary modules and entities
import { Request, Response } from "express";
import { Taskset } from "../../entity/Taskset";

export default async (req: Request, res: Response) => {
  try {
    const taskId = req.query.TaskID as string; // Note: Make sure taskId is a string or numeric type

    // Fetch the task by TaskID
    const task = await Taskset.findOne(taskId);

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    // Mark the task as completed
    task.Completed = true;

    // Save the updated task
    await task.save();

    return res.send({ message: "Task marked as completed successfully" });
  } catch (error) {
    console.error("Error marking task as completed:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
