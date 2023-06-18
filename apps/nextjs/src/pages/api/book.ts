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

      const { title, cover, pictograms } = req.body;
      if (
        title === undefined ||
        cover === undefined ||
        pictograms === undefined
      ) {
        res.status(400).json({ error: "Invalid data" });
        return;
      }

      const createdBook = await prisma.book.create({
        data: {
          userId: dbUser.id,
          title: title as string,
          cover: cover as string,
          pictograms: pictograms as string,
        },
      });

      createdBook
        ? res.status(200).json({ book: createdBook })
        : res.status(500).json({ error: "Error in book creation" });
    } else res.status(400).json({ error: "Invalid method call" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to comunicate with db" });
  }
}
