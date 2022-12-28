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

    const result = await prisma.user.delete({
      where: { id: req.body.id },
    });
    console.log(result);
    res.json(result);
  }

  if (req.method === "PUT") {
    let { name, email, emailVerified, level, admin, image } = req.body;

    level = parseInt(level);

    if (!image || image === "") {
      image = "https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360";
    }
    // if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image)) {
    //   image = "https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360";
    // }

    const newErrors = {};
    if (!name || name === "") newErrors.name = "Cannot be blank!";
    if (!email || email === "") newErrors.email = "Cannot be blank!";
    if (!level || level === "") newErrors.level = "Cannot be blank!";
    if (level < 0) newErrors.level = "Cannot be negative!";
    if (level > 10) newErrors.level = "Cannot be greater than 10!";
    if (level === 0) newErrors.level = "Cannot be 0!";
    if (admin !== true && admin !== false) newErrors.admin = "Must be true or false!";
    // if (!!image && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image))
    //   newErrors.image = "Must be a valid image URL or Blank";

    if (Object.keys(newErrors).length > 0) {
      return res.status(400).send(newErrors);
    }

    if (!session.user.admin) {
      return res.status(202).send("ValidButNotAdmin");
    }

    const result = await prisma.user.update({
      where: { id: req.body.id },
      data: {
        name,
        email,
        emailVerified,
        level,
        admin,
        image,
      },
    });
    console.log(result);
    res.json(result);
  }
}
