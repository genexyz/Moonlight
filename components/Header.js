// Next
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

// Motion
import { motion } from "framer-motion";

// Styles
import styles from "./Header.module.css";
import { Navbar, Container, Nav } from "react-bootstrap";

// Components
import Login from "./Login";

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <section id="navbar">
      <Navbar expand="xxl" fixed="top" className={styles.header}>
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand>
              <motion.div
                className={styles.logo}
                initial={{ x: -50 }}
                whileHover={{ scale: 1.1 }}
              >
                <Image
                  src="/images/header/logo.webp"
                  alt="Logo Moonlight Travel"
                  layout="fill"
                  quality={100}
                />
              </motion.div>
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className={styles.toggler}>
            <span className={`${styles.togglerIcon} navbar-toggler-icon`} />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Item className={styles.item}>
                <Link href="/" passHref>
                  <Nav.Link>
                    <motion.div
                      id={styles["btn"]}
                      initial={{ background: "#2f1755", color: "#fff" }}
                      whileHover={{ background: "#FFF", color: "#2f1755", scale: 1.2 }}
                    >
                      🌑Homebase
                    </motion.div>
                  </Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className={styles.item}>
                <Link href="/planets" passHref>
                  <Nav.Link>
                    <motion.div
                      id={styles["btn"]}
                      initial={{ background: "#2f1755", color: "#fff" }}
                      whileHover={{ background: "#FFF", color: "#2f1755", scale: 1.2 }}
                    >
                      🌍Planets
                    </motion.div>
                  </Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className={styles.item}>
                <Link href="/destinations" passHref>
                  <Nav.Link>
                    <motion.div
                      id={styles["btn"]}
                      initial={{ background: "#2f1755", color: "#fff" }}
                      whileHover={{ background: "#FFF", color: "#2f1755", scale: 1.2 }}
                    >
                      🖼️Destinations
                    </motion.div>
                  </Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className={styles.item}>
                <Link href="/rockets" passHref>
                  <Nav.Link>
                    <motion.div
                      id={styles["btn"]}
                      initial={{ background: "#2f1755", color: "#fff" }}
                      whileHover={{ background: "#FFF", color: "#2f1755", scale: 1.2 }}
                    >
                      🚀Rockets
                    </motion.div>
                  </Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className={styles.item}>
                <Link href="/launches" passHref>
                  <Nav.Link>
                    <motion.div
                      id={styles["btn"]}
                      initial={{ background: "#2f1755", color: "#fff" }}
                      whileHover={{ background: "#FFF", color: "#2f1755", scale: 1.2 }}
                    >
                      🔭Launches
                    </motion.div>
                  </Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className={styles.login}>
                <Login session={session} status={status} signOut={signOut} />
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </section>
  );
};
export default Header;
