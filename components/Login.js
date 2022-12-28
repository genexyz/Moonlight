// Next
import Link from "next/link";
import Image from "next/image";

// React
import React from "react";

// Styles
import styles from "./Login.module.css";
import { Dropdown } from "react-bootstrap";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className={styles.dropdownToggle}
  >
    <div className={styles.loginCircle}>{children}</div>
  </div>
));
CustomToggle.displayName = "LoginToggle";

const CustomItem = React.forwardRef(({ children, className }, ref) => (
  <div ref={ref} className={className}>
    {children}
  </div>
));
CustomItem.displayName = "LoginItem";

const Login = (props) => {
  return (
    <Dropdown className={styles.dropdown}>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-login">
        {props.session && (
          <Image
            src={props.session.user.image}
            alt="User Logo"
            width={50}
            height={50}
            quality={80}
            className={styles.userImage}
          />
        )}
        {!props.session && (
          <Image
            src="https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360"
            alt="User Logo"
            width={50}
            height={50}
            quality={80}
            className={styles.userImage}
          />
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        {props.status === "loading" && (
          <Dropdown.Item as={CustomItem} className={styles.userName}>
            <p>Validating session ...</p>
          </Dropdown.Item>
        )}
        {!props.session && props.status !== "loading" && (
          <Link href="/api/auth/signin" passHref>
            <Dropdown.Item>Log In</Dropdown.Item>
          </Link>
        )}
        {props.session && (
          <>
            <Link href="/admin/planets" passHref>
              <Dropdown.Item>Admin Menu</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item as={CustomItem} className={styles.logOut}>
              <p onClick={() => props.signOut()}>Log out</p>
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Login;
