import { Request, Response } from "express";
import * as yup from "yup";
import { StudentsFeedback } from "../../entity/StudentsFeedback";


const schema = yup.object({
  body: yup.object({
    Date: yup.string().nullable(),
    Lesson: yup.string().required(),
    Address: yup.string().required(),
    content: yup.string().required(),
    citizenshipNumber: yup.string().min(12).max(12),
  }),
 
});

export default async (req: Request, res: Response) => {

  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }
  const studentsFeedback = new StudentsFeedback();
  studentsFeedback.citizenshipNumber = req.body.citizenshipNumber;
  studentsFeedback.content = req.body.content;
  studentsFeedback.Date = req.body.Date;
  studentsFeedback.Lesson = req.body.Lesson;
  studentsFeedback.Address = req.body.Address;

  try {
    await StudentsFeedback.save(studentsFeedback);

  
  } catch (error) {
    return res.status(400).send(error);
  }
  
  return res.send({studentsFeedback});
  
  
};

