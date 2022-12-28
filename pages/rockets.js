// Next
import Head from "next/head";

// Components
import RocketsPage from "../components/RocketsPage";

// Prisma
import prisma from "../lib/prisma";

export default function Rockets(props) {
  return (
    <>
      <Head>
        <title>Moonlight - Rockets</title>
        <meta
          name="description"
          content="Dive through the depths of the inner rockets and beyond"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RocketsPage data={props} />
    </>
  );
}

export async function getServerSideProps() {
  const rockets = await prisma.rocket.findMany();

  return {
    props: { rockets },
  };
}
