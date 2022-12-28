// Next
import Head from "next/head";

// Components
import DestinationsPage from "../components/DestinationsPage";

// Prisma
import prisma from "../lib/prisma";

export default function Destinations(props) {
  return (
    <>
      <Head>
        <title>Moonlight - Destinations</title>
        <meta
          name="description"
          content="Dive through the depths of the inner planets and beyond"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DestinationsPage data={props} />
    </>
  );
}

export async function getServerSideProps() {
  const destinations = await prisma.destination.findMany({
    include: {
      planet: {
        select: {
          name: true,
          type: true,
          gravity: true,
        },
      },
    },
  });

  return {
    props: { destinations },
  };
}
