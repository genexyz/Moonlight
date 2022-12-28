// Next
import Head from "next/head";

// Components
import LaunchPage from "../components/LaunchPage";

// Prisma
import prisma from "../lib/prisma";

export default function Launch(props) {
  return (
    <>
      <Head>
        <title>Moonlight - New Launch</title>
        <meta
          name="description"
          content="Dive through the depths of the inner planets and beyond"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LaunchPage data={props} />
    </>
  );
}

export async function getServerSideProps() {
  const destinations = await prisma.destination.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      planet: {
        select: {
          name: true,
          id: true,
          image: true,
          type: true,
          gravity: true,
          coords: true,
        },
      },
    },
  });

  const rockets = await prisma.rocket.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      autonomy: true,
      baseCost: true,
      distCost: true,
      maxSpeed: true,
      power: true,
    },
  });

  return {
    props: {
      destinations,
      rockets,
    },
  };
}
