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

      const { oldId, text, image, tags, color } = req.body;
      if (text === undefined && image === undefined) {
        res
          .status(400)
          .json({ error: "Invalid required data, both text and image empty" });
        return;
      }

      const existingId = await prisma.customPictogram.findFirst({
        where: {
          oldId: oldId,
        },
      });
      if (existingId) {
        res.status(400).json({
          error: "CustomPictogram associated to oldId already exists!",
        });
        return;
      }

      const createdPictogram = await prisma.customPictogram.create({
        data: {
          userId: dbUser.id,
          oldId: oldId as string | undefined,
          text: text as string | undefined,
          image: image as string | undefined,
          tags: tags as string | undefined,
          color: color as string | undefined,
        },
      });

      createdPictogram
        ? res.status(200).json({ pictogram: createdPictogram })
        : res.status(500).json({ error: "Error in pictogram creation" });
    } else res.status(400).json({ error: "Invalid method call" });
  } catch (err) {
    res.status(500).json({ error: "Failed to comunicate with db" });
  }
}
