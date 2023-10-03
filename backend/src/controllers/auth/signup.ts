import { Request, Response } from "express";
import * as yup from "yup";
import { User } from "../../entity/User";
import bcrypt from "bcrypt";

const schema = yup.object({
  body: yup.object({
    FirstName: yup.string().min(3).required(),
    LastName: yup.string().min(3).required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    citizenshipNumber: yup.string().min(12).max(12),
  }),
});

export default async (req: Request, res: Response) => {
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }

  // Check if the email or citizenshipNumber already exists in the database
  const existingUserByEmail = await User.findOne({ email: req.body.email });
  const existingUserByCitizenshipNumber = await User.findOne({
    citizenshipNumber: req.body.citizenshipNumber,
  });

  if (existingUserByEmail) {
    return res.status(409).send({ error: "Email already exists." });
  }

  if (existingUserByCitizenshipNumber) {
    return res.status(409).send({ error: "Citizenship number already exists." });
  }

  let hashedPassword = undefined;

  try {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  } catch (error) {
    return res.status(500).send({ error });
  }

  const newUser = new User();

  newUser.admin = false;
  newUser.FirstName = req.body.FirstName;
  newUser.LastName = req.body.LastName;
  newUser.email = req.body.email;
  newUser.password = hashedPassword;
  newUser.citizenshipNumber = req.body.citizenshipNumber;

  try {
    await User.save(newUser);
  } catch (error) {
    return res.status(400).send(error);
  }

  return res.send(newUser);
};
