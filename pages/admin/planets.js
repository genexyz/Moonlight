// Next
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

// React
import { useState } from "react";
import { NotificationManager } from "react-notifications";

// Components
import AdminLayout from "../../components/AdminLayout";
import PlanetModal from "../../components/modals/PlanetModal";
import PlanetDeleteModal from "../../components/modals/PlanetDeleteModal";

// Prisma
import prisma from "../../lib/prisma";

// Styles
import styles from "./admin.module.css";
import { Container, Row, Col, Button, Table } from "react-bootstrap";

export default function PlanetsAdmin(props) {
  const [show, setShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [modalPlanet, setModalPlanet] = useState(null);
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
    setModalPlanet(null);
  };

  const handleShow = (type, p) => {
    if (p) setModalPlanet(p);
    setModalType(type);
    setShow(true);
  };
  const handleDeleteShow = (p) => {
    if (p) setModalPlanet(p);
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

  let dataSearch = props.planets.filter((item) => {
    return Object.keys(item).some(() =>
      item["name"].toString().toLowerCase().includes(filter.name.toString().toLowerCase())
    );
  });

  return (
    <>
      <Head>
        <title>Moonlight - Admin - Planets</title>
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
                <h1 className={styles.titleH1}>Planets</h1>
              </Col>
              <Col className={styles.addAdminCol}>
                <Button
                  className={styles.addAdminBtn}
                  onClick={() => handleShow("add", null)}
                >
                  Add Planet
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
                    <th>Type</th>
                    <th>Gravity</th>
                    <th>Coordinates</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSearch.map((planet) => {
                    return (
                      <tr key={planet.id} className={styles.tableRow}>
                        <th>{planet.name}</th>
                        <th className={styles.iconImage}>
                          <Image
                            src={planet.image}
                            alt={`Planet ${planet.name} Image`}
                            width={25}
                            height={25}
                            quality={50}
                          />
                        </th>
                        <th>{planet.type}</th>
                        <th>{planet.gravity}</th>
                        <th>{planet.coords}</th>
                        <th>
                          <Button
                            className={styles.editAdminBtn}
                            onClick={() => handleShow("edit", planet)}
                          >
                            Edit
                          </Button>
                          <Button
                            className={styles.deleteAdminBtn}
                            onClick={() => handleDeleteShow(planet)}
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

        <PlanetModal
          show={show}
          handleClose={handleClose}
          type={modalType}
          planet={modalPlanet}
          handleNotification={handleNotification}
          refresh={refreshData}
        />

        <PlanetDeleteModal
          show={deleteShow}
          handleClose={handleClose}
          planet={modalPlanet}
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
    return { props: { planets: [] } };
  }

  const planets = await prisma.planet.findMany();
  return {
    props: { planets },
  };
}
