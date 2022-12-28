// Next
import Head from "next/head";
import Image from "next/image";

// Components
import Background from "../../components/Background";
import DestinationCard from "../../components/Cards/DestinationCard";

// Motion
import { motion } from "framer-motion";

// Prisma
import prisma from "../../lib/prisma";

// Styles
import styles from "./planet.module.css";
import { Container, Row, Col } from "react-bootstrap";

export default function Planet(props) {
  const BackColor =
    "-webkit-linear-gradient(0deg, " + props.color2 + " 5%, " + props.color1 + " 50%)";
  const cardBackColor =
    "linear-gradient(90deg, " +
    props.color2 +
    "88" +
    " , " +
    props.color1 +
    "88" +
    ", #000000CC 35% )";
  const htmlTitle = `Moonlight - Planet ${props.name}`;

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
                  src={props.image}
                  alt={`Planet ${props.name} Image`}
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
                    <span>Gravity: </span>
                    {props.gravity} m/s²
                  </p>
                  <p>
                    <span>Type: </span> {props.type}
                  </p>
                  <p>
                    <span>Coords: </span>
                    {props.coords}
                  </p>
                  <p>
                    <span>Description: </span>
                    {props.description}
                  </p>
                </div>
              </Row>
              <Row className={styles.destinationContainer}>
                {!props.destinations && (
                  <Col>
                    <div className={`${styles.description} text-center`}>
                      <p>
                        <span> No Destinations Available </span>
                      </p>
                    </div>
                  </Col>
                )}
                {props.destinations &&
                  props.destinations.map((destination) => (
                    <Col key={destination.id} xl={6} xxl={4}>
                      <DestinationCard key={destination.id} data={destination} />
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const doesExists = await prisma.planet.findUnique({
    where: {
      id: context.params.id,
    },
  });

  if (!doesExists) {
    return {
      redirect: { destination: "/404" },
    };
  }

  const planet = await prisma.planet.findUnique({
    where: {
      id: context.query.id,
    },
    include: {
      destinations: true,
    },
  });

  if (!planet) {
    return {
      notFound: true,
    };
  }

  return {
    props: planet,
  };
}
