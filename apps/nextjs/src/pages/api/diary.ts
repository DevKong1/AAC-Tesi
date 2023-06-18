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

      const { date, pictograms } = req.body;
      if (date === undefined || pictograms === undefined) {
        res.status(400).json({ error: "Invalid data" });
        return;
      }

      const existingPage = await prisma.diaryPage.findFirst({
        where: {
          date: date as string,
        },
      });

      if (existingPage) {
        const updatedPage = await prisma.diaryPage.update({
          where: {
            id: existingPage.id,
          },
          data: {
            pictograms: pictograms,
          },
        });

        updatedPage
          ? res.status(200).json({ page: updatedPage })
          : res.status(500).json({ error: "Error in diary page updating" });
      } else {
        const createdPage = await prisma.diaryPage.create({
          data: {
            userId: dbUser.id,
            date: date as string,
            pictograms: pictograms,
          },
        });

        createdPage
          ? res.status(200).json({ page: createdPage })
          : res.status(500).json({ error: "Error in diary page creation" });
      }
    } else res.status(400).json({ error: "Invalid method call" });
  } catch (err) {
    res.status(500).json({ error: "Failed to comunicate with db" });
  }
}
