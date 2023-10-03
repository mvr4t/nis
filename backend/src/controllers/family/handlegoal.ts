import { Request, Response } from "express";
import * as yup from "yup";
import { Famgoal } from "../../entity/Famgoal";


const schema = yup.object({
  body: yup.object({
    name: yup.string().nullable(),
    reason: yup.string().required(),
    amount: yup.string().required(),

  }),
 
});

export default async (req: Request, res: Response) => {

  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }
  const famgoal = new Famgoal();
  famgoal.name = req.body.name;
  famgoal.reason = req.body.reason;
  famgoal.amount = req.body.amount;
  famgoal.Login = req.body.Login;

  try {
    await Famgoal.save(famgoal);

  
  } catch (error) {
    return res.status(400).send(error);
  }
  
  return res.send({famgoal});
  
  
};

