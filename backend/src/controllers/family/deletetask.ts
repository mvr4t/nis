import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Taskset } from '../../entity/Taskset';

export default async function deleteTask(req: Request, res: Response) {
  const taskId = req.params.taskId; // Get the TaskID from the URL parameter

  try {
    const taskRepository = getRepository(Taskset);

    // Check if the task with the specified TaskID exists
    const task = await taskRepository.findOne(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete the task
    await taskRepository.remove(task);

    return res.status(204).send(); // Successfully deleted, no content response
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
