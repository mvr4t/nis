import { Request, Response } from "express";
import { StudentsSubject } from "../../entity/StudentsSubject";
import { User } from "../../entity/User";
import { StudentsCurator } from "../../entity/StudentsCurator";

export default async (req: Request, res: Response) => {
  const SubjectName = req.query.SubjectName as string;
  const TeacherName = req.query.TeacherName as string;
  const authnumber = req.query.authnumber as string;
  const students = await StudentsSubject.find({
    select: ["citizenshipNumber"],
    where: { SubjectName: SubjectName, TeacherName: TeacherName },
  });
  const teachers = await StudentsSubject.find({
    select: ["TeacherName"],
    where: { citizenshipNumber: authnumber, SubjectName: SubjectName}
  })
  const subjects = await StudentsSubject.find({
    select: ["SubjectName"],
    where: { citizenshipNumber: authnumber  },
  });
  const studentnames = [];
  for (let i = 0; i < students.length; i++) {
    const citizenshipNumber = students[i].citizenshipNumber;
    const user = await User.findOne({
      select: ["FirstName", "LastName"],
      where: { citizenshipNumber: citizenshipNumber },
    });

    if (user) {
      studentnames.push(user);
    }
  }

  const classgrades = [];
  for (let i = 0; i < students.length; i++) {
    const citizenshipNumber = students[i].citizenshipNumber;
    const user = await StudentsCurator.findOne({
      select: ["Grade"],
      where: { citizenshipNumber: citizenshipNumber },
    });

    if (user) {
      classgrades.push(user);
    }
  }

  return res.json({ studentnames, subjects, teachers, classgrades});
};
