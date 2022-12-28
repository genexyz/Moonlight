// Next
import { getSession } from "next-auth/react";

// Prisma
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  if (req.method === "DELETE") {
    if (!req.body.id || req.body.id === "") {
      return res.status(400).send("Wrong Payload");
    }

    if (!session.user.admin) {
      return res.status(202).send("ValidButNotAdmin");
    }

    const result = await prisma.destination.delete({
      where: { id: req.body.id },
    });
    console.log(result);
    res.json(result);
  }

  if (req.method === "POST" || req.method === "PUT") {
    let { name, description, image, planetId } = req.body;

    if (!image || image === "") {
      image = "https://www.moonlightspace.com/images/defaults/DefaultDestination.webp";
    }
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image)) {
      image = "https://www.moonlightspace.com/images/defaults/DefaultDestination.webp";
    }

    const newErrors = {};

    if (!name || name === "") newErrors.name = "Cannot be blank!";
    if (!description || description === "")
      newErrors.description = "Description cannot be blank!";
    if (!planetId || planetId === "") newErrors.planetId = "Cannot be blank!";

    if (Object.keys(newErrors).length > 0) {
      return res.status(400).send(newErrors);
    }

    if (!session.user.admin) {
      return res.status(202).send("ValidButNotAdmin");
    }

    if (req.method === "POST") {
      const result = await prisma.destination.create({
        data: {
          name,
          description,
          image,
          planet: {
            connect: { id: planetId },
          },
        },
      });
      console.log(result);
      res.json(result);
    }
    if (req.method === "PUT") {
      const result = await prisma.destination.update({
        where: { id: req.body.id },
        data: {
          name,
          description,
          image,
          planet: {
            connect: { id: planetId },
          },
        },
      });
      console.log(result);
      res.json(result);
    }
  }
}
