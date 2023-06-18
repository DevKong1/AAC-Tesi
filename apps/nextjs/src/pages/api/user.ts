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
      // Check if user already exists
      const result = await prisma.user.findUnique({
        include: {
          customPictograms: true,
          diary: true,
          books: true,
        },
        where: {
          clerkID: user,
        },
      });
      if (result) res.status(200).json({ user: result });
      else {
        // Create user
        const { email } = req.body;
        if (!email || email instanceof Array) {
          res.status(400).json({ error: "Invalid data" });
          return;
        }

        const createdUser = await prisma.user.create({
          data: {
            email: email,
            clerkID: user,
          },
        });

        createdUser
          ? res.status(200).json({ user: createdUser })
          : res.status(500).json({ error: "Error in user creation" });
      }
    } else res.status(400).json({ error: "Invalid method call" });
  } catch (err) {
    res.status(500).json({ error: "Failed to comunicate with db" });
  }
}
