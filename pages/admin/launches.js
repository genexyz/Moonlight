// Next
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

// React
import { useState } from "react";
import { NotificationManager } from "react-notifications";

// Components
import AdminLayout from "../../components/AdminLayout";
import LaunchModal from "../../components/modals/LaunchModal";
import LaunchDeleteModal from "../../components/modals/LaunchDeleteModal";

// Styles
import styles from "./admin.module.css";
import { Container, Row, Col, Button, Table } from "react-bootstrap";

// Prisma
import prisma from "../../lib/prisma";

export default function LaunchesAdmin(props) {
  const [show, setShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [modalLaunch, setModalLaunch] = useState(null);
  const [modalType, setModalType] = useState("add");
  const [filter, setFilter] = useState({
    name: "",
  });

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleClose = () => {
    setShow(false);
    setDeleteShow(false);
    setModalLaunch(null);
  };

  const handleShow = (type, p) => {
    if (p) setModalLaunch(p);
    setModalType(type);
    setShow(true);
  };

  const handleDeleteShow = (p) => {
    if (p) setModalLaunch(p);
    setDeleteShow(true);
  };

  const handleNotification = (type, message, title) => {
    if (type === "success") {
      NotificationManager.success(message, title, 8000);
    }
    if (type === "error") {
      NotificationManager.error(message, title, 8000);
    }
    if (type === "warning") {
      NotificationManager.warning(message, title, 8000);
    }
  };

  const searchWithFilters = (event) => {
    const { name, value } = event.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  let dataSearch = props.launches.filter((item) => {
    return Object.keys(item).some(() =>
      item["flightNumber"]
        .toString()
        .toLowerCase()
        .includes(filter.name.toString().toLowerCase())
    );
  });

  return (
    <>
      <Head>
        <title>Moonlight - Admin - Launches</title>
        <meta
          name="description"
          content="Dive through the depths of the inner planets and beyond"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AdminLayout>
        <Row>
          <Container>
            <Row className={styles.titleRow}>
              <Col>
                <h1 className={styles.titleH1}>Launches</h1>
              </Col>
              <Col className={styles.addAdminCol}>
                <Button
                  className={styles.addAdminBtn}
                  onClick={() => handleShow("add", null)}
                >
                  Add Launch
                </Button>
              </Col>
            </Row>
            <Row className={styles.dataRow}>
              <input
                type="search"
                id="search-bar"
                placeholder="Search"
                className={`${styles.searchInput} form-control`}
                value={filter.name}
                name="name"
                onChange={(value) => searchWithFilters(value)}
              />
              <Table striped bordered variant="dark" size="sm" className={styles.table}>
                <thead>
                  <tr>
                    <th>Flight Number</th>
                    <th>Cost ($M)</th>
                    <th>Distance (AU)</th>
                    <th>Duration (Hs)</th>
                    <th>Date UTC</th>
                    <th>Rocket</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Client</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSearch.map((launch) => {
                    return (
                      <tr key={launch.id} className={styles.tableRow}>
                        <th>{launch.flightNumber}</th>
                        <th>{launch.cost}</th>
                        <th>{launch.distance}</th>
                        <th>{launch.duration}</th>
                        <th>
                          {launch.date.split("T")[0].split("-")[1]}/
                          {launch.date.split("T")[0].split("-")[2]}/
                          {launch.date.split("T")[0].split("-")[0]} -{" "}
                          {launch.date.split("T")[1].split(":")[0]}:
                          {launch.date.split("T")[1].split(":")[1]}
                        </th>
                        <th className={styles.iconImage}>
                          <Image
                            src={launch.rocket.image}
                            alt={`Rocket ${launch.rocket.name} Image`}
                            width={25}
                            height={25}
                            quality={50}
                          />
                          <div className={styles.nameLink}>
                            <Link href={`/rockets/${launch.rocket.id}`}>
                              {launch.rocket.name}
                            </Link>
                          </div>
                        </th>
                        <th className={styles.iconImage}>
                          <Image
                            src={launch.origin.planet.image}
                            alt={`Origin Planet ${launch.origin.planet.name} Image`}
                            width={25}
                            height={25}
                            quality={50}
                          />
                          <div className={styles.nameLink}>
                            <Link href={`/destinations/${launch.origin.id}`}>
                              {launch.origin.name}
                            </Link>
                          </div>
                        </th>
                        <th className={styles.iconImage}>
                          <Image
                            src={launch.destination.planet.image}
                            alt={`Destination Planet ${launch.destination.planet.name} Image`}
                            width={25}
                            height={25}
                            quality={50}
                          />
                          <div className={styles.nameLink}>
                            <Link href={`/destinations/${launch.destination.id}`}>
                              {launch.destination.name}
                            </Link>
                          </div>
                        </th>
                        <th>{launch.user.name}</th>
                        <th>
                          <Button
                            className={styles.editAdminBtn}
                            onClick={() => handleShow("edit", launch)}
                          >
                            Edit
                          </Button>
                          <Button
                            className={styles.deleteAdminBtn}
                            onClick={() => handleDeleteShow(launch)}
                          >
                            Delete
                          </Button>
                        </th>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Row>
          </Container>
        </Row>

        <LaunchModal
          show={show}
          handleClose={handleClose}
          type={modalType}
          launch={modalLaunch}
          rockets={props.rockets}
          destinations={props.destinations}
          users={props.users}
          handleNotification={handleNotification}
          refresh={refreshData}
        />

        <LaunchDeleteModal
          show={deleteShow}
          handleClose={handleClose}
          launch={modalLaunch}
          handleNotification={handleNotification}
          refresh={refreshData}
        />
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
    return { props: { launches: [] } };
  }

  const launches = await prisma.launch.findMany({
    select: {
      id: true,
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
          planet: {
            select: {
              name: true,
              id: true,
              image: true,
            },
          },
        },
      },
      destination: {
        select: {
          name: true,
          id: true,
          planet: {
            select: {
              name: true,
              id: true,
              image: true,
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

  const destinations = await prisma.destination.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const rockets = await prisma.rocket.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return {
    props: {
      launches: JSON.parse(JSON.stringify(launches)),
      destinations,
      rockets,
      users,
    },
  };
}
