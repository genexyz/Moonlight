import { useState, useEffect } from "react";
import { Button, Container, Modal, Row, Col, Form, InputGroup } from "react-bootstrap";

const UserModal = (props) => {
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    name: "",
    email: "",
    emailVerified: null,
    image: "",
    level: 1,
    admin: false,
  });

  useEffect(() => {
    setUser({
      name: props.user ? props.user.name : "",
      email: props.user ? props.user.email : "",
      emailVerified: props.user ? props.user.emailVerified : null,
      image: props.user ? props.user.image : "",
      level: props.user ? props.user.level : 1,
      admin: props.user ? props.user.admin : false,
    });
  }, [props]);

  const handleClose = () => {
    setUser({
      name: "",
      email: "",
      emailVerified: null,
      image: "",
      level: 1,
      admin: false,
    });
    setErrors({});
    props.handleClose();
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!!errors[name])
      setErrors({
        ...errors,
        [name]: null,
      });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const findFormErrors = () => {
    const { name, email, level, admin } = user;

    const newErrors = {};
    if (!name || name === "") newErrors.name = "Cannot be blank!";
    if (!email || email === "") newErrors.email = "Cannot be blank!";
    if (!level || level === "") newErrors.level = "Cannot be blank!";
    if (level < 0) newErrors.level = "Cannot be negative!";
    if (level > 10) newErrors.level = "Cannot be greater than 10!";
    if (level === 0) newErrors.level = "Cannot be 0!";
    if (admin !== true && admin !== false) newErrors.admin = "Must be true or false!";
    // if (!!image && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image))
    //   newErrors.image = "Must be a valid image URL or Blank";
    return newErrors;
  };

  const submitData = async (e) => {
    e.preventDefault();
    const method = props.type === "add" ? "POST" : "PUT";
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        const body = {
          ...user,
          id: props.user ? props.user.id : null,
        };
        const response = await fetch("/api/user", {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.status === 200) {
          handleClose();
          props.refresh();
          props.handleNotification(
            "success",
            ``,
            `User ${props.type === "add" ? "created" : "edited"} successfully!`
          );
        }
        if (response.status === 202) {
          handleClose();
          props.handleNotification(
            "warning",
            `The ${
              props.type === "add" ? "User" : "changes"
            } won't appear in the database as you are not an admin!`,
            "The petition would have been successfull!"
          );
        }
        if (response.status === 400) {
          const data = await response.json();
          setErrors(data);
          console.log(data);
          props.handleNotification(
            "error",
            ``,
            `Couldn't ${props.type === "add" ? "create" : "edit"} user, see Errors!`
          );
        }
        if (response.status === 401) {
          handleClose();
          props.handleNotification("error", ``, "You are not authorized!");
        }
        if (response.status === 500) {
          handleClose();
          props.handleNotification("error", ``, "Server error!");
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  return (
    <Modal show={props.show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{(props.type === "add" ? "Add" : "Edit") + " User"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Form.Group className="mb-3" controlId="formUserName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={user.name}
                  name="name"
                  onChange={onInputChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="formUserEmail">
                <Form.Label required>Email</Form.Label>
                <Form.Control
                  type="text"
                  value={user.email}
                  name="email"
                  onChange={onInputChange}
                  placeholder="email@domain.com"
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formUserLevel">
                  <Form.Label>Level </Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={1}
                      max={10}
                      value={user.level}
                      name="level"
                      onChange={onInputChange}
                      isInvalid={!!errors.level}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.level}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              {/* <Col sm={6}>
                <Form.Group className="mb-3" controlId="formUserEmailVerified">
                  <Form.Label>Email verified date </Form.Label>
                  <Form.Control
                    type="date"
                    name="emailVerified"
                    placeholder="Email verified date"
                    value={user.emailVerified ? user.emailVerified : ""}
                    onChange={onInputChange}
                  />
                </Form.Group>
              </Col> */}
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="formUserImageURL">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={user.image}
                  name="image"
                  onChange={onInputChange}
                  placeholder="Default image will be used if left blank"
                  isInvalid={!!errors.image}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Make sure that the image is hosted on a secure and stable site and that
                  the image is transparent (.webp format is suggested)
                </Form.Text>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="formUserAdmin">
                <InputGroup className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="admin"
                    onChange={handleCheckboxChange}
                    checked={user.admin}
                    label="Is Admin user?"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.admin}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitData}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
