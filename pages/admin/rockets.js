// Next
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import Image from "next/image";

// React
import { useState } from "react";
import { NotificationManager } from "react-notifications";

// Components
import AdminLayout from "../../components/AdminLayout";
import RocketModal from "../../components/modals/RocketModal";
import RocketDeleteModal from "../../components/modals/RocketDeleteModal";

// Prisma
import prisma from "../../lib/prisma";

// Styles
import styles from "./admin.module.css";
import { Container, Row, Col, Table, Button } from "react-bootstrap";

export default function RocketsAdmin(props) {
  const [show, setShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [modalRocket, setModalRocket] = useState(null);
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
    setModalRocket(null);
  };

  const handleShow = (type, r) => {
    if (r) setModalRocket(r);
    setModalType(type);
    setShow(true);
  };
  const handleDeleteShow = (r) => {
    if (r) setModalRocket(r);
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

  let dataSearch = props.rockets.filter((item) => {
    return Object.keys(item).some(() =>
      item["name"].toString().toLowerCase().includes(filter.name.toString().toLowerCase())
    );
  });

  return (
    <>
      <Head>
        <title>Moonlight - Admin - Rockets</title>
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
                <h1 className={styles.titleH1}>Rockets</h1>
              </Col>
              <Col className={styles.addAdminCol}>
                <Button
                  className={styles.addAdminBtn}
                  onClick={() => handleShow("add", null)}
                >
                  Add Rocket
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
                    <th>Interior Image</th>
                    <th>Exterior Image</th>
                    <th>Base Cost ($M)</th>
                    <th>Dist Cost ($M/AU)</th>
                    <th>Autonomy (AU)</th>
                    <th>Power (m/s²)</th>
                    <th>Height (Mts)</th>
                    <th>Weight (Tons)</th>
                    <th>Max Speed (AU/h)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSearch.map((rocket) => {
                    return (
                      <tr key={rocket.id} className={styles.tableRow}>
                        <th>{rocket.name}</th>
                        <th className={styles.iconImage}>
                          <Image
                            src={rocket.image}
                            alt={`Rocket ${rocket.name} Image`}
                            width={30}
                            height={30}
                            quality={50}
                          />
                        </th>
                        <th className={styles.iconImage}>
                          <Image
                            src={rocket.interiorImage}
                            alt={`Rocket ${rocket.name} Interior Image`}
                            width={30}
                            height={30}
                            quality={50}
                          />
                        </th>
                        <th className={styles.iconImage}>
                          <Image
                            src={rocket.exteriorImage}
                            alt={`Rocket ${rocket.name} Exterior Image`}
                            width={30}
                            height={30}
                            quality={50}
                          />
                        </th>
                        <th>{rocket.baseCost}</th>
                        <th>{rocket.distCost}</th>
                        <th>{rocket.autonomy}</th>
                        <th>{rocket.power}</th>
                        <th>{rocket.height}</th>
                        <th>{rocket.weight}</th>
                        <th>{rocket.maxSpeed}</th>
                        <th>
                          <Button
                            className={styles.editAdminBtn}
                            onClick={() => handleShow("edit", rocket)}
                          >
                            Edit
                          </Button>
                          <Button
                            className={styles.deleteAdminBtn}
                            onClick={() => handleDeleteShow(rocket)}
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

        <RocketModal
          show={show}
          handleClose={handleClose}
          type={modalType}
          rocket={modalRocket}
          handleNotification={handleNotification}
          refresh={refreshData}
        />

        <RocketDeleteModal
          show={deleteShow}
          handleClose={handleClose}
          rocket={modalRocket}
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
    return { props: { rockets: [] } };
  }
  const rockets = await prisma.rocket.findMany();

  return {
    props: { rockets },
  };
}
