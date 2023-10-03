import { Request, Response } from "express";
import * as yup from "yup";
import { StudentsSubject } from "../../entity/StudentsSubject";

const schema = yup.object({
  body: yup.object({
    SubjectName: yup.string().required(),
    TeacherName: yup.string().required(),
    citizenshipNumber: yup.string().min(12).max(12),
  }),
 
});

export default async (req: Request, res: Response) => {
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }
  const studentsSubject = new StudentsSubject();
  studentsSubject.SubjectName = req.body.SubjectName;
  studentsSubject.TeacherName = req.body.TeacherName;
  studentsSubject.citizenshipNumber = req.body.citizenshipNumber
  try {
    await StudentsSubject.save(studentsSubject);
  
  } catch (error) {
    return res.status(400).send(error);
  }
  
  return res.send({studentsSubject});
  
  
};

