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

    const result = await prisma.launch.delete({
      where: { id: req.body.id },
    });
    console.log(result);
    res.json(result);
  }

  if (req.method === "POST" || req.method === "PUT") {
    let {
      flightNumber,
      description,
      cost,
      distance,
      duration,
      date,
      rocketId,
      originId,
      destinationId,
      userId,
    } = req.body;

    cost = parseFloat(cost);
    distance = parseFloat(distance);
    duration = parseFloat(duration);
    let dateAux = new Date(date);
    date = dateAux.toISOString();

    const newErrors = {};

    if (!flightNumber || flightNumber === "") newErrors.flightNumber = "Cannot be blank!";
    if (!description || description === "") newErrors.description = "Cannot be blank!";
    if (!cost) newErrors.cost = "Cannot be blank & should be a number!";
    if (cost < 0) newErrors.cost = "Cannot be negative!";
    if (cost === 0) newErrors.cost = "Cannot be 0!";
    if (!distance) newErrors.distance = "Cannot be blank & should be a number!";
    if (distance < 0) newErrors.distance = "Cannot be negative!";
    if (distance === 0) newErrors.distance = "Cannot be 0!";
    if (!duration) newErrors.duration = "Cannot be blank & should be a number!";
    if (duration < 0) newErrors.duration = "Cannot be negative!";
    if (duration === 0) newErrors.duration = "Cannot be 0!";
    if (!date || date === "") newErrors.date = "Cannot be blank!";
    if (!rocketId || rocketId === "") newErrors.rocketId = "Cannot be blank!";
    if (!originId || originId === "") newErrors.originId = "Cannot be blank!";
    if (!destinationId || destinationId === "")
      newErrors.destinationId = "Cannot be blank!";
    if (originId === destinationId) {
      newErrors.destinationId = "Cannot be the same as origin!";
      newErrors.originId = "Cannot be the same as destination!";
    }
    if (!userId || userId === "") newErrors.userId = "Cannot be blank!";

    if (Object.keys(newErrors).length > 0) {
      return res.status(400).send(newErrors);
    }

    if (userId === "1234@") {
      return res.status(203).send("ValidButTestUser");
    }

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    if (req.method === "POST") {
      const result = await prisma.launch.create({
        data: {
          flightNumber,
          description,
          cost,
          distance,
          duration,
          date,
          rocket: {
            connect: { id: rocketId },
          },
          origin: {
            connect: { id: originId },
          },
          destination: {
            connect: { id: destinationId },
          },
          user: {
            connect: { id: userId },
          },
        },
      });
      console.log(result);
      res.json(result);
    }
    if (req.method === "PUT") {
      if (!session.user.admin) {
        return res.status(202).send("ValidButNotAdmin");
      }

      const result = await prisma.launch.update({
        where: { id: req.body.id },
        data: {
          flightNumber,
          description,
          cost,
          distance,
          duration,
          date,
          rocket: {
            connect: { id: rocketId },
          },
          origin: {
            connect: { id: originId },
          },
          destination: {
            connect: { id: destinationId },
          },
          user: {
            connect: { id: userId },
          },
        },
      });
      console.log(result);
      res.json(result);
    }
  }
}
