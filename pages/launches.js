// Next
import Head from "next/head";

// Components
import LaunchesPage from "../components/LaunchesPage";

// Prisma
import prisma from "../lib/prisma";

export default function Launches(props) {
  return (
    <>
      <Head>
        <title>Moonlight - Launches</title>
        <meta
          name="description"
          content="Dive through the depths of the inner planets and beyond"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LaunchesPage data={props} />
    </>
  );
}

export async function getServerSideProps() {
  const launches = await prisma.launch.findMany({
    select: {
      id: true,
      description: true,
      flightNumber: true,
      cost: true,
      distance: true,
      duration: true,
      date: true,
      rocket: {
        select: {
          name: true,
          id: true,
          image: true,
        },
      },
      origin: {
        select: {
          name: true,
          id: true,
          planet: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      },
      destination: {
        select: {
          name: true,
          id: true,
          planet: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      },
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  return {
    props: {
      launches: JSON.parse(JSON.stringify(launches)),
    },
  };
}
