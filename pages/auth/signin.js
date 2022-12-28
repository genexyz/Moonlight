import { getProviders, signIn, getSession } from "next-auth/react";
import styles from "./signin.module.css";
import Image from "next/image";
import { Button } from "react-bootstrap";

export default function SignIn({ providers }) {
  return (
    <>
      <div className={styles.background}>
        <Image
          src={`${process.env.NEXT_PUBLIC_URL}/images/backgrounds/Background.webp`}
          alt={`Background Main Image`}
          layout="fill"
          objectFit="cover"
          quality={75}
        />
        <Image
          src={`${process.env.NEXT_PUBLIC_URL}/images/backgrounds/Asteroids.webp`}
          alt={`Background Asteroids Image`}
          layout="fill"
          objectFit="cover"
          quality={75}
        />
        <Image
          src={`${process.env.NEXT_PUBLIC_URL}/images/backgrounds/SecondLayer.webp`}
          alt={`Background Second Rocks Layer Image`}
          layout="fill"
          objectFit="cover"
          quality={75}
        />
        <Image
          src={`${process.env.NEXT_PUBLIC_URL}/images/backgrounds/FirstLayer.webp`}
          alt={`Background First Rocks Layer Image`}
          layout="fill"
          objectFit="cover"
          quality={75}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.cardWrapper}>
            <div className={styles.cardContent}>
              <Image
                src="/images/header/logo.webp"
                width="550px"
                height="64px"
                alt="App Logo"
              />
              <hr />
              {Object.values(providers).map((provider) => (
                <div key={provider.name} className={styles.providerDiv}>
                  <Button onClick={() => signIn(provider.id)}>
                    Sign in with {provider.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  const providers = await getProviders();

  return {
    props: { providers },
  };
}
