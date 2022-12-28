// Next
import Head from "next/head";
import Image from "next/image";

// Components
import Background from "../../components/Background";

// Motion
import { motion } from "framer-motion";

// Prisma
import prisma from "../../lib/prisma";

// Styles
import styles from "./destination.module.css";
import { Container, Row, Col } from "react-bootstrap";

export default function Destination(props) {
  const BackColor =
    "-webkit-linear-gradient(0deg, " +
    props.planet.color2 +
    " 5%, " +
    props.planet.color1 +
    " 50%)";
  const cardBackColor =
    "linear-gradient(90deg, " +
    props.planet.color2 +
    "88" +
    " , " +
    props.planet.color1 +
    "88" +
    ", #000000CC 35% )";
  const htmlTitle = `Moonlight - Destination ${props.name}`;

  return (
    <>
      <Head>
        <title>{htmlTitle}</title>
        <meta name="description" content={props.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={styles.main__section}>
        <Background />
        <Container
          fluid
          className={styles.planetcardcontainer}
          style={{
            background: cardBackColor,
          }}
        >
          <Row className={styles.row}>
            <Col lg={4} className={styles.heightPlanet}>
              <motion.div
                transition={{
                  scale: {
                    repeat: Infinity,
                    duration: 8,
                    delay: 1,
                  },
                }}
                animate={{ scale: [1.001, 1.05, 1.001] }}
                className={styles.planet}
              >
                <Image
                  src={props.planet.image}
                  alt={`Rocket ${props.planet.name} Image`}
                  layout="fill"
                  quality={75}
                />
              </motion.div>
            </Col>
            <Col lg={8}>
              <Row>
                <motion.h2
                  className={styles.name}
                  style={{
                    background: BackColor,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {props.name}
                </motion.h2>
              </Row>
              <Row>
                <div className={styles.description}>
                  <p>
                    <span>Planet Name: </span>
                    {props.planet.name}
                  </p>
                  <p>
                    <span>Planet Gravity: </span>
                    {props.planet.gravity} m/s²
                  </p>
                  <p>
                    <span>Planet Type: </span> {props.planet.type}
                  </p>
                  <p>
                    <span>Description: </span>
                    {props.description}
                  </p>
                </div>
              </Row>
              <Row className={styles.destinationContainer}>
                <Col>
                  <Image
                    src={props.image}
                    alt="Destination Image"
                    layout="intrinsic"
                    width={912}
                    height={510}
                    quality={100}
                    className={styles.destinationImage}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const doesExists = await prisma.destination.findUnique({
    where: {
      id: context.params.id,
    },
  });

  if (!doesExists) {
    return {
      redirect: { destination: "/404" },
    };
  }

  const destination = await prisma.destination.findUnique({
    where: {
      id: context.query.id,
    },
    include: {
      planet: {
        select: {
          name: true,
          image: true,
          type: true,
          gravity: true,
          color1: true,
          color2: true,
        },
      },
    },
  });

  if (!destination) {
    return {
      notFound: true,
    };
  }

  return {
    props: destination,
  };
}
