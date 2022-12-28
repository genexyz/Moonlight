// Next
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// Components
import Background from "../../components/Background";

// Prisma
import prisma from "../../lib/prisma";

// Styles
import styles from "./launch.module.css";
import { Container, Row, Col } from "react-bootstrap";

export default function Launch(props) {
  const cardBackColor =
    "linear-gradient(220deg, " +
    props.color2 +
    "88" +
    " , " +
    props.color1 +
    "88" +
    ", #000000CC 35% )";
  const htmlTitle = `Moonlight - Launch ${props.flightNumber}`;

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
            textAlign: "center",
          }}
        >
          <Row>
            <h2 className={styles.name}>{props.flightNumber}</h2>
          </Row>
          <Row>
            <Col md={6}>
              <div className={styles.cardData}>
                <h3>Origin:</h3>
                <div className={styles.destinationDataDiv}>
                  <span className={styles.destinationDataName}>Name:</span>
                  <div className={styles.nameLink}>
                    <Link href={`/destinations/${props.origin.id}`}>
                      {props.origin.name}
                    </Link>
                  </div>
                </div>
                <div className={styles.destinationDataDiv}>
                  <span className={styles.destinationDataImageName}>Planet:</span>
                  <Image
                    src={props.origin.planet.image}
                    alt={`Origin Planet ${props.origin.planet.name} Image`}
                    width={25}
                    height={25}
                    quality={50}
                    className={styles.destinationPlanetImage}
                  />
                  <div className={styles.nameLink}>
                    <Link href={`/planets/${props.origin.planet.id}`}>
                      {props.origin.planet.name}
                    </Link>
                  </div>
                </div>
                <p className={styles.destinationData}>
                  <span className={styles.destinationDataName}>Gravity: </span>
                  {props.origin.planet.gravity} m/s²
                </p>
                <p className={styles.destinationData}>
                  <span className={styles.destinationDataName}>Coords: </span>
                  {props.origin.planet.coords}
                </p>
                <hr />
                <Image
                  src={props.origin.image}
                  alt={`Origin Destination ${props.origin.name} Image`}
                  width={300}
                  height={170}
                  quality={50}
                  className={styles.destinationPlanetImage}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.cardData}>
                <h3>Destination:</h3>
                <div className={styles.destinationDataDiv}>
                  <span className={styles.destinationDataName}>Name:</span>
                  <div className={styles.nameLink}>
                    <Link href={`/destinations/${props.destination.id}`}>
                      {props.destination.name}
                    </Link>
                  </div>
                </div>
                <div className={styles.destinationDataDiv}>
                  <span className={styles.destinationDataImageName}>Planet:</span>
                  <Image
                    src={props.destination.planet.image}
                    alt={`Origin Planet ${props.destination.planet.name} Image`}
                    width={25}
                    height={25}
                    quality={50}
                    className={styles.destinationPlanetImage}
                  />
                  <div className={styles.nameLink}>
                    <Link href={`/planets/${props.destination.planet.id}`}>
                      {props.destination.planet.name}
                    </Link>
                  </div>
                </div>
                <p className={styles.destinationData}>
                  <span className={styles.destinationDataName}>Gravity: </span>
                  {props.destination.planet.gravity} m/s²
                </p>
                <p className={styles.destinationData}>
                  <span className={styles.destinationDataName}>Coords: </span>
                  {props.destination.planet.coords}
                </p>
                <hr />
                <Image
                  src={props.destination.image}
                  alt={`Origin Destination ${props.destination.name} Image`}
                  width={300}
                  height={170}
                  quality={50}
                  className={styles.destinationPlanetImage}
                />
              </div>
            </Col>
            <Col>
              <div className={styles.cardData}>
                <h3>Flight Specifications:</h3>
                <p className={styles.destinationData}>
                  <span className={styles.destinationDataName}>Flight Number:</span>
                  {props.flightNumber}
                </p>
                <div className={styles.destinationDataDiv}>
                  <span className={styles.destinationDataImageName}>Rocket:</span>
                  <Image
                    src={props.rocket.image}
                    alt={`Rocket ${props.rocket.name} Image`}
                    width={35}
                    height={35}
                    quality={50}
                    className={styles.destinationPlanetImage}
                  />
                  <div className={styles.nameLink}>
                    <Link href={`/rockets/${props.rocket.id}`}>{props.rocket.name}</Link>
                  </div>
                </div>
                <p className={styles.destinationData}>
                  <span className={styles.destinationDataName}>Date: </span>
                  {props.date}
                </p>
                <p className={styles.destinationData}>
                  <span className={styles.destinationDataName}>Distance: </span>
                  {props.distance} AU
                </p>
                <p className={styles.destinationData}>
                  <span className={styles.destinationDataName}>Cost:</span>
                  {props.cost} $M
                </p>
                <p className={styles.destinationData}>
                  <span className={styles.destinationDataName}>Client:</span>
                  {props.user.name}
                </p>
                <p className={styles.destinationData}>
                  <span className={styles.destinationDataName}>Description:</span>
                  {props.description}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const doesExists = await prisma.launch.findUnique({
    where: {
      flightNumber: context.query.id,
    },
  });

  if (!doesExists) {
    return {
      redirect: { destination: "/404" },
    };
  }

  const launch = await prisma.launch.findUnique({
    where: {
      flightNumber: context.query.id,
    },
    select: {
      description: true,
      flightNumber: true,
      cost: true,
      distance: true,
      duration: true,
      date: true,
      rocket: {
        select: {
          name: true,
          id: true,
          image: true,
        },
      },
      origin: {
        select: {
          name: true,
          id: true,
          image: true,
          planet: {
            select: {
              name: true,
              id: true,
              image: true,
              gravity: true,
              coords: true,
            },
          },
        },
      },
      destination: {
        select: {
          name: true,
          id: true,
          image: true,
          planet: {
            select: {
              name: true,
              id: true,
              image: true,
              gravity: true,
              coords: true,
            },
          },
        },
      },
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  if (!launch) {
    return {
      notFound: true,
    };
  }

  return {
    props: JSON.parse(JSON.stringify(launch)),
  };
}
