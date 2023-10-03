import { Request, Response } from "express";
import * as yup from "yup";
import { Familysignup} from "../../entity/Familysingup";
import bcrypt from "bcrypt";

const schema = yup.object({
  body: yup.object({
    FirstName: yup.string().min(3).required(),
    LastName: yup.string().min(3).required(),
    email: yup.string().email().required(),
    Login: yup.string().min(3).required(),
    Role: yup.string().required(),
    password: yup.string().min(8).required(),
    citizenshipNumber: yup.string().min(11).max(11),
  }),
});

export default async (req: Request, res: Response) => {
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }

  const existingUserByEmail = await Familysignup.findOne({ email: req.body.email });
  const existingUserByCitizenshipNumber = await Familysignup.findOne({
    citizenshipNumber: req.body.citizenshipNumber,
  });
  const existingUserByLogin = await Familysignup.findOne({ email: req.body.Login });


  if (existingUserByEmail) {
    return res.status(409).send({ error: "Email already exists." });
  }

  if (existingUserByCitizenshipNumber) {
    return res.status(409).send({ error: "Citizenship number already exists." });
  }
  if(existingUserByLogin){
    return res.status(409).send({ error: "Login already exists." });

  }

  let hashedPassword = undefined;

  try {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  } catch (error) {
    return res.status(500).send({ error });
  }

  const newUser = new Familysignup();


  newUser.FirstName = req.body.FirstName;
  newUser.LastName = req.body.LastName;
  newUser.email = req.body.email;
  newUser.Login = req.body.Login;
  newUser.Role = req.body.Role;
  newUser.password = hashedPassword;
  newUser.citizenshipNumber = req.body.citizenshipNumber;
  newUser.firstuser = true;
  

  try {
    await Familysignup.save(newUser);
  } catch (error) {
    return res.status(400).send(error);
  }

  return res.send(newUser);
};
