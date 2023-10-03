import { Request, Response } from "express";
import ElectionContract from "../../../../../Nis/backend/src/web3";

export default async (_: Request, res: Response) => {
  const instance = await ElectionContract.deployed();

  const status = await instance.getStatus();

  return res.send({ status });
};
