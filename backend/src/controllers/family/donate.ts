// Import necessary modules and entities
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Famgoal } from "../../entity/Famgoal";

// Define the route handler
export default async (req: Request, res: Response) => {
  const { userId, donationAmount } = req.body; // Assuming you receive the Famgoal ID and donation amount in the request body

  try {
    // Get the Famgoal entity by ID
    const famgoalRepository = getRepository(Famgoal);
    const famgoal = await famgoalRepository.findOne(userId);

    if (!famgoal) {
      return res.status(404).json({ error: "Famgoal entity not found for this ID" });
    }
    console.log("MKIO",donationAmount);

    famgoal.collected += donationAmount;
    await famgoalRepository.save(famgoal);

    return res.status(200).json({ message: "Collected sum updated successfully" });
  } catch (error) {
    console.error("Error updating collected sum:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
