// Next
import Head from "next/head";

// Components
import PlanetsPage from "../components/PlanetsPage";

// Prisma
import prisma from "../lib/prisma";

export default function Planets(props) {
  return (
    <>
      <Head>
        <title>Moonlight - Planets</title>
        <meta
          name="description"
          content="Dive through the depths of the inner planets and beyond"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PlanetsPage data={props} />
    </>
  );
}

export async function getServerSideProps() {
  const planets = await prisma.planet.findMany();

  return {
    props: { planets },
  };
}
