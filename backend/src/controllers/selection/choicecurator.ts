import { Request, Response } from "express";
import * as yup from "yup";
import { StudentsCurator } from "../../entity/StudentsCurator";


const schema = yup.object({
  body: yup.object({
    CuratorName: yup.string().required(),
    citizenshipNumber: yup.string().min(12).max(12),
  }),
 
});

export default async (req: Request, res: Response) => {

  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }
  const studentsCurator = new StudentsCurator();
  studentsCurator.citizenshipNumber = req.body.citizenshipNumber;
  studentsCurator.CuratorName = req.body.CuratorName;
  studentsCurator.Grade = req.body.Grade;
  
  try {
    await StudentsCurator.save(studentsCurator);

  
  } catch (error) {
    return res.status(400).send(error);
  }
  
  return res.send({studentsCurator});
  
  
};

