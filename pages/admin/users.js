// Next
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

// React
import { useState } from "react";
import { NotificationManager } from "react-notifications";

// Components
import AdminLayout from "../../components/AdminLayout";
import UserModal from "../../components/modals/UserModal";
import UserDeleteModal from "../../components/modals/UserDeleteModal";

// Prisma
import prisma from "../../lib/prisma";

// Styles
import styles from "./admin.module.css";
import { Container, Row, Col, Table, Button } from "react-bootstrap";

export default function UsersAdmin(props) {
  const [show, setShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [modalType, setModalType] = useState("add");
  const [filter, setFilter] = useState({
    name: "",
  });

  const { data: session } = useSession();

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  const handleClose = () => {
    setShow(false);
    setDeleteShow(false);
    setModalUser(null);
  };

  const handleShow = (type, u) => {
    if (u) setModalUser(u);
    setModalType(type);
    setShow(true);
  };
  const handleDeleteShow = (u) => {
    if (u) setModalUser(u);
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

  let dataSearch = props.users.filter((item) => {
    return Object.keys(item).some(() =>
      item["name"].toString().toLowerCase().includes(filter.name.toString().toLowerCase())
    );
  });

  return (
    <>
      <Head>
        <title>Moonlight - Admin - Users</title>
        <meta
          name="description"
          content="Dive through the depths of the inner planets and beyond"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AdminLayout>
        <Row>
          <Container>
            {session && !session.user.admin && (
              <div className={styles.notFound}>
                <h1 className={styles.notFoundH1}>Ooops...</h1>
                <h2 className={styles.notFoundH2}>
                  You have to login to access this menu
                </h2>
                <p className={styles.notFoundP}>
                  Go back to the{" "}
                  <Link href="/">
                    <a>Homepage</a>
                  </Link>
                </p>
              </div>
            )}
            {session && session.user.admin && (
              <>
                <Row className={styles.titleRow}>
                  <Col>
                    <h1 className={styles.titleH1}>Users</h1>
                  </Col>
                  <Col className={styles.addAdminCol}>
                    <Button
                      className={styles.addAdminBtn}
                      onClick={() => handleShow("add", null)}
                      disabled
                    >
                      Add User
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
                  <Table
                    striped
                    bordered
                    variant="dark"
                    size="sm"
                    className={styles.table}
                  >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Email</th>
                        <th>Email verified</th>
                        <th>Level</th>
                        <th>Admin</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataSearch.map((user) => {
                        return (
                          <tr key={user.id} className={styles.tableRow}>
                            <th>{user.name}</th>
                            <th className={styles.iconImage}>
                              <Image
                                src={user.image}
                                alt={`User ${user.name} Image`}
                                width={50}
                                height={50}
                                quality={50}
                              />
                            </th>
                            <th>{user.email}</th>
                            <th>
                              {user.emailVerified ? user.emailVerified : "Not verified"}
                            </th>
                            <th>{user.level}</th>
                            <th>{user.admin ? "Yes" : "No"}</th>
                            <th>
                              <Button
                                className={styles.editAdminBtn}
                                onClick={() => handleShow("edit", user)}
                              >
                                Edit
                              </Button>
                              <Button
                                className={styles.deleteAdminBtn}
                                onClick={() => handleDeleteShow(user)}
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
              </>
            )}
          </Container>
        </Row>

        <UserModal
          show={show}
          handleClose={handleClose}
          type={modalType}
          user={modalUser}
          handleNotification={handleNotification}
          refresh={refreshData}
        />

        <UserDeleteModal
          show={deleteShow}
          handleClose={handleClose}
          user={modalUser}
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
    return { props: { users: [] } };
  }

  if (!session.user.admin) {
    res.statusCode = 403;
    return { props: { users: [] } };
  }

  const users = await prisma.user.findMany();

  return {
    props: { users },
  };
}
