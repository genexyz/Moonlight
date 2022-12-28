// Next
import Head from "next/head";

// Components
import Mainpage from "../components/Mainpage";

export default function Home() {
  return (
    <>
      <Head>
        <title>Moonlight</title>
        <meta
          name="description"
          content="Manage your trips to Inner and Outer Space safely"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Mainpage />
    </>
  );
}
