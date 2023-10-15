import { Request, Response } from "express";
import dayjs from "dayjs";
export default (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    expires: dayjs().add(7, "days").toDate(),
  });
  res.end();
};
