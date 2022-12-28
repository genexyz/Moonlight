// Next
import Head from "next/head";

// Components
import AdminLayout from "../components/AdminLayout";

export default function Admin() {
  return (
    <>
      <Head>
        <title>Moonlight - Admin</title>
        <meta
          name="description"
          content="Dive through the depths of the inner planets and beyond"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AdminLayout />
    </>
  );
}
