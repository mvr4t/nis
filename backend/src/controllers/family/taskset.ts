import { Request, Response } from "express";
import * as yup from "yup";
import { Taskset} from "../../entity/Taskset";

const schema = yup.object({
  body: yup.object({
    Task: yup.string().required(),
    Reward: yup.number().required(),
    Date: yup.string().required(),
  }),
});

export default async (req: Request, res: Response) => {
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }

  const newTask = new Taskset();


  newTask.Task = req.body.Task;
  newTask.Reward = req.body.Reward;
  newTask.Date = req.body.Date;
  newTask.Login = req.body.Login;

  

  try {
    await Taskset.save(newTask);
  } catch (error) {
    return res.status(400).send(error);
  }

  return res.send(newTask);
};
