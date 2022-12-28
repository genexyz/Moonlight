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

    const result = await prisma.planet.delete({
      where: { id: req.body.id },
    });
    console.log(result);
    res.json(result);
  }

  if (req.method === "POST" || req.method === "PUT") {
    let { name, description, gravity, type, coords, color1, color2, image } = req.body;
    let x = coords.split(",")[0];
    let y = coords.split(",")[1];
    let z = coords.split(",")[2];

    gravity = parseFloat(gravity);

    if (!image || image === "") {
      image = "https://www.moonlightspace.com/images/defaults/DefaultPlanet.webp";
    }
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image)) {
      image = "https://www.moonlightspace.com/images/defaults/DefaultPlanet.webp";
    }

    const newErrors = {};
    if (!name || name === "") newErrors.name = "Cannot be blank!";
    if (!gravity) newErrors.gravity = "Cannot be blank & should be a number!";
    if (gravity < 0) newErrors.gravity = "Cannot be negative!";
    if (gravity === 0) newErrors.gravity = "Cannot be 0!";
    if (!type || type === "") newErrors.type = "A type must be selected!";
    if (!x) newErrors.x = "Cannot be blank & should be a number!";
    if (x < -9999) newErrors.x = "X cannot be lower than -9999!";
    if (x > 9999) newErrors.x = "X cannot be higher than 9999!";
    if (!y) newErrors.y = "Cannot be blank & should be a number!";
    if (y < -9999) newErrors.y = "Y cannot be lower than -9999!";
    if (y > 9999) newErrors.y = "Y cannot be higher than 9999!";
    if (!z) newErrors.z = "Cannot be blank & should be a number!";
    if (z < -9999) newErrors.z = "Z cannot be lower than -9999!";
    if (z > 9999) newErrors.z = "Z cannot be higher than 9999!";
    if (!color1 || color1 === "") newErrors.color1 = "A color must be selected!";
    if (!color2 || color2 === "") newErrors.color2 = "A color must be selected!";
    if (!description || description === "")
      newErrors.description = "Description cannot be blank!";

    if (Object.keys(newErrors).length > 0) {
      return res.status(400).send(newErrors);
    }

    if (!session.user.admin) {
      return res.status(202).send("ValidButNotAdmin");
    }

    if (req.method === "POST") {
      const result = await prisma.planet.create({
        data: {
          name,
          description,
          gravity,
          type,
          coords,
          color1,
          color2,
          image,
        },
      });
      console.log(result);
      res.json(result);
    }
    if (req.method === "PUT") {
      const result = await prisma.planet.update({
        where: { id: req.body.id },
        data: {
          name,
          description,
          gravity,
          type,
          coords,
          color1,
          color2,
          image,
        },
      });
      console.log(result);
      res.json(result);
    }
  }
}
