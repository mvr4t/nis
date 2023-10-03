import { Request, Response } from "express";
import * as yup from "yup";
import { Familysignup } from "../../entity/Familysingup";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// Configure the transporter outside of the route handler function
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use the email service you prefer
  auth: {
    user: 'kenbay.ilyas@gmail.com', // Your email address
    pass: "cwwp gogn evlu mkle",
  },
});

const schema = yup.object({
  body: yup.object({
    FirstName: yup.string().min(3).required(),
    LastName: yup.string().min(3).required(),
    email: yup.string().email().required(),
    Role: yup.string().required(),
    citizenshipNumber: yup.string().min(11).max(11),
  }),
});

export default async (req: Request, res: Response) => {
  try {
    await schema.validate(req);
  } catch (error: any) {
    return res.status(400).send(error.errors);
  }
  console.log("Checking for existing user by Email:", req.body.email);
  const existingUserByEmail = await Familysignup.findOne({ email: req.body.email });
  console.log("Checking for existing user by CitizenshipNumber:", req.body.citizenshipNumber);
  const existingUserByCitizenshipNumber = await Familysignup.findOne({
    citizenshipNumber: req.body.citizenshipNumber,
  });
  console.log("Checking for existing user by Login:", req.body.Login);
  const existingUserByLogin = await Familysignup.findOne({ email: req.body.Login });
  if (existingUserByEmail) {
    return res.status(409).send({ error: "Email already exists." });
  }

  if (existingUserByCitizenshipNumber) {
    return res.status(409).send({ error: "Citizenship number already exists." });
  }
  if (existingUserByLogin) {

    return res.status(409).send({ error: "Login already exists." });
  }
  try {
  const newUser = new Familysignup();
  newUser.FirstName = req.body.FirstName;
  newUser.LastName = req.body.LastName;
  newUser.email = req.body.email;
  newUser.Login = req.body.Login;
  newUser.Role = req.body.Role;

  // Generate a random password
  const randomPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  newUser.password = hashedPassword;
  newUser.citizenshipNumber = req.body.citizenshipNumber;


    await Familysignup.save(newUser);

    // Send an email with the generated password
    const mailOptions = {
      from: "kenbay.ilyas@gmail.com",
      to: req.body.email, // User's email
      subject: "Your New Account Password",
      text: `Your password is: ${randomPassword}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email error:", error);
        return res.status(500).send({ error: "Failed to send email." });
      }
      console.log("Email sent:", info.response);
      return res.send({ newUser, password: randomPassword });
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};

// Function to generate a random password
function generateRandomPassword() {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
