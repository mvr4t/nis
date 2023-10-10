import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import authRouter from "./routers/auth";
import pollsRouter from "./routers/polls";
import usersRouter from "./routers/users";
import selectionRouter from "./routers/selection";
import famRouter from "./routers/family";
const app = express();


app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/family", famRouter)
app.use("/auth", authRouter);
app.use("/polls", pollsRouter);
app.use("/users", usersRouter);
app.use("/selection", selectionRouter);
app.use("/uploads", express.static(path.join(__dirname,"upload")));



app.get("/", (req: Request, res: Response) => {
  console.log(req.cookies);
  res.status(404).send("<h1>Hi there</h1>");
});


export default app;
