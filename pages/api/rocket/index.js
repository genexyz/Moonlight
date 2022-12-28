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

    const result = await prisma.rocket.delete({
      where: { id: req.body.id },
    });
    console.log(result);
    res.json(result);
  }

  if (req.method === "POST" || req.method === "PUT") {
    let {
      name,
      baseCost,
      distCost,
      autonomy,
      power,
      height,
      weight,
      maxSpeed,
      image,
      interiorImage,
      exteriorImage,
    } = req.body;

    height = parseFloat(height);
    weight = parseFloat(weight);
    maxSpeed = parseFloat(maxSpeed);
    baseCost = parseFloat(baseCost);
    distCost = parseFloat(distCost);
    autonomy = parseInt(autonomy);
    power = parseFloat(power);

    if (!image || image === "") {
      image = "https://www.moonlightspace.com/images/defaults/DefaultRocket.webp";
    }
    if (!interiorImage || interiorImage === "") {
      interiorImage =
        "https://www.moonlightspace.com/images/defaults/DefaultRocketInterior.webp";
    }
    if (!exteriorImage || exteriorImage === "") {
      exteriorImage =
        "https://www.moonlightspace.com/images/defaults/DefaultRocketExterior.webp";
    }
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image)) {
      image = "https://www.moonlightspace.com/images/defaults/DefaultRocket.webp";
    }
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(interiorImage)) {
      interiorImage =
        "https://www.moonlightspace.com/images/defaults/DefaultRocketInterior.webp";
    }
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(exteriorImage)) {
      exteriorImage =
        "https://www.moonlightspace.com/images/defaults/DefaultRocketExterior.webp";
    }

    const newErrors = {};
    if (!name || name === "") newErrors.name = "Cannot be blank!";
    if (!baseCost) newErrors.baseCost = "Cannot be blank & should be a number!";
    if (baseCost < 0) newErrors.baseCost = "Cannot be negative!";
    if (!distCost) newErrors.distCost = "Cannot be blank & should be a number!";
    if (distCost < 0) newErrors.distCost = "Cannot be negative!";
    if (!autonomy) newErrors.autonomy = "Cannot be blank & should be a number!";
    if (autonomy < 0) newErrors.autonomy = "Cannot be negative!";
    if (!power) newErrors.power = "Cannot be blank & should be a number!";
    if (power < 0) newErrors.power = "Cannot be negative!";
    if (!height) newErrors.height = "Cannot be blank & should be a number!";
    if (height < 0) newErrors.height = "Cannot be negative!";
    if (!weight) newErrors.weight = "Cannot be blank & should be a number!";
    if (weight < 0) newErrors.weight = "Cannot be negative!";
    if (!maxSpeed) newErrors.maxSpeed = "Cannot be blank & should be a number!";
    if (maxSpeed < 0) newErrors.maxSpeed = "Cannot be negative!";
    if (weight === 0) newErrors.weight = "Cannot be 0!";
    if (height === 0) newErrors.height = "Cannot be 0!";
    if (!!image && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image))
      newErrors.image = "Must be a valid image URL or Blank";
    if (
      !!interiorImage &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(interiorImage)
    )
      newErrors.interiorImage = "Must be a valid image URL or Blank";
    if (
      !!exteriorImage &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(exteriorImage)
    )
      newErrors.exteriorImage = "Must be a valid image URL or Blank";

    if (Object.keys(newErrors).length > 0) {
      return res.status(400).send(newErrors);
    }

    if (!session.user.admin) {
      return res.status(202).send("ValidButNotAdmin");
    }

    if (req.method === "POST") {
      const result = await prisma.rocket.create({
        data: {
          name,
          baseCost,
          distCost,
          autonomy,
          power,
          height,
          weight,
          maxSpeed,
          image,
        },
      });
      console.log(result);
      res.json(result);
    }
    if (req.method === "PUT") {
      const result = await prisma.rocket.update({
        where: { id: req.body.id },
        data: {
          name,
          baseCost,
          distCost,
          autonomy,
          power,
          height,
          weight,
          maxSpeed,
          image,
        },
      });
      console.log(result);
      res.json(result);
    }
  }
}
