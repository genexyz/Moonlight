// Next
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

// Components
import Background from "./Background";
import Tooltip from "@mui/material/Tooltip";

// Styles
import styles from "./AdminLayout.module.css";
import "react-notifications/lib/notifications.css";
import { Container, Row, Col } from "react-bootstrap";

export default function AdminLayout({ children }) {
  const router = useRouter();

  const { data: session, status } = useSession();
  const isActive = (pathname) => router.pathname === pathname;

  return (
    <section id="admin" className={styles.main__section}>
      <Background />
      <Container className={styles.adminContainer}>
        {status === "loading" && (
          <div className={styles.notFound}>
            <h1 className={styles.notFoundH1}>Loading...</h1>
          </div>
        )}
        {!session && status !== "loading" && (
          <div className={styles.notFound}>
            <h1 className={styles.notFoundH1}>Ooops...</h1>
            <h2 className={styles.notFoundH2}>You have to login to access this menu</h2>
            <p className={styles.notFoundP}>
              Go back to the{" "}
              <Link href="/">
                <a>Homepage</a>
              </Link>
            </p>
          </div>
        )}
        {session && (
          <>
            <Row className={styles.adminRow}>
              <Link href="/admin/planets">
                <Col
                  className={`${styles.adminCol} ${
                    isActive("/admin/planets") ? styles.activeTab : null
                  }`}
                >
                  Planets
                </Col>
              </Link>
              <Link href="/admin/destinations">
                <Col
                  className={`${styles.adminCol} ${
                    isActive("/admin/destinations") ? styles.activeTab : null
                  }`}
                >
                  Destinations
                </Col>
              </Link>
              <Link href="/admin/rockets">
                <Col
                  className={`${styles.adminCol} ${
                    isActive("/admin/rockets") ? styles.activeTab : null
                  }`}
                >
                  Rockets
                </Col>
              </Link>
              <Link href="/admin/launches">
                <Col
                  className={`${styles.adminCol} ${
                    isActive("/admin/launches") ? styles.activeTab : null
                  }`}
                >
                  Launches
                </Col>
              </Link>
              {session.user.admin && (
                <Link href="/admin/users">
                  <Col
                    className={`${styles.adminCol} ${
                      isActive("/admin/users") ? styles.activeTab : null
                    }`}
                  >
                    Users
                  </Col>
                </Link>
              )}
              {!session.user.admin && (
                <Col className={styles.adminColInactive}>
                  <Tooltip
                    title="This menu is only available for admin users"
                    placement="bottom"
                    arrow
                  >
                    <p className="m-0">Users</p>
                  </Tooltip>
                </Col>
              )}
            </Row>
            {children}
          </>
        )}
      </Container>
    </section>
  );
}
