// Next
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// Styles
import styles from "./404.module.css";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Moonlight - 404 Not Found</title>
        <meta name="description" content="404 - Page Not Found" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.background}`}>
        <Image
          src={`${process.env.NEXT_PUBLIC_URL}/images/backgrounds/Stars.webp`}
          alt="Background Image - Stars"
          layout="fill"
          objectFit="cover"
          quality={75}
        />
      </div>
      <div className={styles.stars}>
        <div className={styles.centralBody}>
          <Image
            className={styles.image404}
            src={`${process.env.NEXT_PUBLIC_URL}/images/404/404.svg`}
            width={300}
            height={205}
            alt="404 Text"
          />
          <Link href="/" passHref>
            <button className={styles.btnGoHome}>GO BACK HOME</button>
          </Link>
        </div>
        <div className={styles.objects}>
          <div className={styles.objectRocket}>
            <Image
              src={`${process.env.NEXT_PUBLIC_URL}/images/404/rocket.svg`}
              alt="Rocket"
              width={40}
              height={29}
            />
          </div>
          <div className={styles.objectEarth}>
            <Image
              src={`${process.env.NEXT_PUBLIC_URL}/images/404/earth.svg`}
              alt="Earth"
              width={100}
              height={100}
            />
          </div>
          <div className={styles.objectMoon}>
            <Image
              src={`${process.env.NEXT_PUBLIC_URL}/images/404/moon.svg`}
              alt="Moon"
              width={80}
              height={80}
            />
          </div>
          <div className={styles.boxAstronaut}>
            <div className={styles.objectAstronaut}>
              <Image
                src={`${process.env.NEXT_PUBLIC_URL}/images/404/astronaut.svg`}
                alt="Astronaut"
                width={140}
                height={179}
              />
            </div>
          </div>
        </div>
        <div className={styles.glowingStars}>
          <div className={styles.star}></div>
          <div className={styles.star}></div>
          <div className={styles.star}></div>
          <div className={styles.star}></div>
          <div className={styles.star}></div>
        </div>
      </div>
    </>
  );
}
