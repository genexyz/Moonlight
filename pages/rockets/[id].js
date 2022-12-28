// Next
import Head from "next/head";
import Image from "next/image";

// Bootstrap
import { Container, Row, Col } from "react-bootstrap";

// Components
import Background from "../../components/Background";
import RocketImageCard from "../../components/Cards/RocketImageCard";

// Styles
import styles from "./rocket.module.css";

// Motion
import { motion } from "framer-motion";

// Prisma
import prisma from "../../lib/prisma";

export default function Rocket(props) {
  const BackColor =
    "-webkit-linear-gradient(0deg, " + "#0077ff" + " 5%, " + "#9b00ca" + " 50%)";
  const cardBackColor =
    "linear-gradient(90deg, " +
    "#0077ff" +
    "88" +
    " , " +
    "#9b00ca" +
    "88" +
    ", #000000CC 35% )";
  const htmlTitle = `Moonlight - Rocket ${props.name}`;

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
          className={styles.rocketcardcontainer}
          style={{
            background: cardBackColor,
          }}
        >
          <Row className={styles.row}>
            <Col lg={4} className={styles.heightRocket}>
              <motion.div
                transition={{
                  scale: {
                    repeat: Infinity,
                    duration: 8,
                    delay: 1,
                  },
                }}
                animate={{ scale: [1.001, 1.05, 1.001] }}
                className={styles.rocket}
              >
                <Image
                  src={props.image}
                  alt={`Rocket ${props.name} Image`}
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
                <Col lg={6}>
                  <div className={styles.description}>
                    <p>
                      <span>Autonomy: </span>
                      {props.autonomy} AU
                    </p>
                    <p>
                      <span>Power: </span> {props.power} m/s²
                    </p>
                    <p>
                      <span>Max Speed: </span> {props.maxSpeed} AU/h
                    </p>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className={styles.description}>
                    <p>
                      <span>Base Cost: </span>
                      {props.baseCost} $M
                    </p>
                    <p>
                      <span>Distance Cost: </span>
                      {props.distCost} $M/AU
                    </p>
                    <p>
                      <span>Height: </span>
                      {props.height} Mts
                    </p>
                    <p>
                      <span>Weight: </span>
                      {props.weight} Tons
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className={styles.imagesContainer}>
                {(!props.interiorImage || !props.exteriorImage) && (
                  <Col>
                    <div className={`${styles.description} text-center`}>
                      <p>
                        <span> No Available Images </span>
                      </p>
                    </div>
                  </Col>
                )}
                {(props.interiorImage || props.exteriorImage) && (
                  <>
                    <Col xl={6}>
                      <RocketImageCard image={props.exteriorImage} title={"Exterior"} />
                    </Col>
                    <Col xl={6}>
                      <RocketImageCard image={props.interiorImage} title={"Interior"} />
                    </Col>
                  </>
                )}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const doesExists = await prisma.rocket.findUnique({
    where: {
      id: context.params.id,
    },
  });

  if (!doesExists) {
    return {
      redirect: { destination: "/404" },
    };
  }

  const rocket = await prisma.rocket.findUnique({
    where: {
      id: context.query.id,
    },
  });

  if (!rocket) {
    return {
      notFound: true,
    };
  }

  return {
    props: rocket,
  };
}
