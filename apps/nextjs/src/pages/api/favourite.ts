import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@acme/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Get user id cookie set by middleware
    const user = req.cookies.user;
    if (!user || user.length <= 0) {
      res.status(401).json({ error: "Invalid user" });
      return;
    }
    if (req.method === "POST") {
      const dbUser = await prisma.user.findUnique({
        where: {
          clerkID: user,
        },
      });

      if (!dbUser) {
        res.status(401).json({ error: "Invalid user" });
        return;
      }

      const { favourites } = req.body;
      if (favourites === undefined) {
        res.status(400).json({ error: "Invalid data" });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          favourites: favourites,
        },
      });

      res.status(200).json({ user: updatedUser });
    } else res.status(400).json({ error: "Invalid method call" });
  } catch (err) {
    res.status(500).json({ error: "Failed to comunicate with db" });
  }
}
