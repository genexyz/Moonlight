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
import DestinationModal from "../../components/modals/DestinationModal";
import DestinationDeleteModal from "../../components/modals/DestinationDeleteModal";

// Prisma
import prisma from "../../lib/prisma";

// Styles
import styles from "./admin.module.css";
import { Container, Row, Col, Button, Table } from "react-bootstrap";

export default function DestinationsAdmin(props) {
  const [show, setShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [modalDestination, setModalDestination] = useState(null);
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
    setModalDestination(null);
  };

  const handleShow = (type, p) => {
    if (p) setModalDestination(p);
    setModalType(type);
    setShow(true);
  };
  const handleDeleteShow = (p) => {
    if (p) setModalDestination(p);
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

  let dataSearch = props.destinations.filter((item) => {
    return Object.keys(item).some(() =>
      item["name"].toString().toLowerCase().includes(filter.name.toString().toLowerCase())
    );
  });

  return (
    <>
      <Head>
        <title>Moonlight - Admin - Destinations</title>
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
                <h1 className={styles.titleH1}>Destinations</h1>
              </Col>
              <Col className={styles.addAdminCol}>
                <Button
                  className={styles.addAdminBtn}
                  onClick={() => handleShow("add", null)}
                >
                  Add Destination
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
                    <th>Name</th>
                    <th>Image</th>
                    <th>Planet Name</th>
                    <th>Planet Image</th>
                    <th>Planet Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSearch.map((destination) => {
                    return (
                      <tr key={destination.id} className={styles.tableRow}>
                        <th>{destination.name}</th>
                        <th className={styles.iconImage}>
                          <Image
                            src={destination.image}
                            alt={`Destination ${destination.name} Image`}
                            width={25}
                            height={25}
                            quality={50}
                          />
                        </th>
                        <th className={styles.nameLink}>
                          <Link href={`/planets/${destination.planet.id}`}>
                            {destination.planet.name}
                          </Link>
                        </th>
                        <th className={styles.iconImage}>
                          <Image
                            src={destination.planet.image}
                            alt={`Destination Planet${destination.planet.name} Image`}
                            width={25}
                            height={25}
                            quality={50}
                          />
                        </th>
                        <th>{destination.planet.type}</th>
                        <th>
                          <Button
                            className={styles.editAdminBtn}
                            onClick={() => handleShow("edit", destination)}
                          >
                            Edit
                          </Button>
                          <Button
                            className={styles.deleteAdminBtn}
                            onClick={() => handleDeleteShow(destination)}
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

        <DestinationModal
          show={show}
          handleClose={handleClose}
          type={modalType}
          destination={modalDestination}
          planets={props.planets}
          handleNotification={handleNotification}
          refresh={refreshData}
        />

        <DestinationDeleteModal
          show={deleteShow}
          handleClose={handleClose}
          destination={modalDestination}
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
    return { props: { destinations: [] } };
  }

  const destinations = await prisma.destination.findMany({
    include: {
      planet: {
        select: {
          name: true,
          id: true,
          image: true,
          type: true,
        },
      },
    },
  });

  const planets = await prisma.planet.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return {
    props: { destinations, planets },
  };
}
