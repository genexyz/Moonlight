import { useState, useEffect } from "react";
import { Button, Container, Modal, Row, Col, Form, InputGroup } from "react-bootstrap";

const PlanetModal = (props) => {
  const [errors, setErrors] = useState({});
  const [planet, setPlanet] = useState({
    name: "",
    description: "",
    gravity: 0,
    type: "",
    coords: "",
    color1: "#000000",
    color2: "#c0c0c0",
    image: "",
  });

  const [coords, setCoords] = useState({
    x: "0",
    y: "0",
    z: "0",
  });

  useEffect(() => {
    setPlanet({
      name: props.planet ? props.planet.name : "",
      description: props.planet ? props.planet.description : "",
      gravity: props.planet ? props.planet.gravity : 0,
      type: props.planet ? props.planet.type : "",
      coords: props.planet ? props.planet.coords : "",
      color1: props.planet ? props.planet.color1 : "#000000",
      color2: props.planet ? props.planet.color2 : "#c0c0c0",
      image: props.planet ? props.planet.image : "",
    });
    setCoords({
      x: props.planet?.coords ? props.planet.coords.split(",")[0] : "0",
      y: props.planet?.coords ? props.planet.coords.split(",")[1] : "0",
      z: props.planet?.coords ? props.planet.coords.split(",")[2] : "0",
    });
  }, [props]);

  const handleClose = () => {
    setPlanet({
      name: "",
      description: "",
      gravity: 0,
      type: "",
      coords: "",
      color1: "",
      color2: "",
      image: "",
    });
    setCoords({
      x: 0,
      y: 0,
      z: 0,
    });
    setErrors({});
    props.handleClose();
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "x" || name === "y" || name === "z") {
      setCoords((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setPlanet((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    if (!!errors[name])
      setErrors({
        ...errors,
        [name]: null,
      });
  };

  const findFormErrors = () => {
    const { name, gravity, type, color1, color2, description, image } = planet;
    const { x, y, z } = coords;
    const newErrors = {};
    if (!name || name === "") newErrors.name = "Cannot be blank!";
    if (!gravity) newErrors.gravity = "Cannot be blank & should be a number!";
    if (gravity < 0) newErrors.gravity = "Cannot be negative!";
    if (gravity > 80) newErrors.gravity = "Cannot be higher than 80!";
    if (gravity === 0) newErrors.gravity = "Cannot be 0!";
    if (!type || type === "") newErrors.type = "A type must be selected!";
    if (!x) newErrors.x = "Cannot be blank & should be a number!";
    if (x < -9999) newErrors.x = "Cannot be lower than -9999!";
    if (x > 9999) newErrors.x = "Cannot be higher than 9999!";
    if (!y) newErrors.y = "Cannot be blank & should be a number!";
    if (y < -9999) newErrors.y = "Cannot be lower than -9999!";
    if (y > 9999) newErrors.y = "Cannot be higher than 9999!";
    if (!z) newErrors.z = "Cannot be blank & should be a number!";
    if (z < -9999) newErrors.z = "Cannot be lower than -9999!";
    if (z > 9999) newErrors.z = "Cannot be higher than 9999!";
    if (!color1 || color1 === "") newErrors.color1 = "A color must be selected!";
    if (!color2 || color2 === "") newErrors.color2 = "A color must be selected!";
    if (!description || description === "") newErrors.description = "Cannot be blank!";
    if (!!image && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image))
      newErrors.image = "Must be a valid image URL or Blank";
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
          ...planet,
          coords: `${coords.x},${coords.y},${coords.z}`,
          id: props.planet ? props.planet.id : null,
        };
        const response = await fetch("/api/planet", {
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
            `Planet ${props.type === "add" ? "created" : "edited"} successfully!`
          );
        }
        if (response.status === 202) {
          handleClose();
          props.handleNotification(
            "warning",
            `The ${
              props.type === "add" ? "Planet" : "changes"
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
            `Couldn't ${props.type === "add" ? "create" : "edit"} planet, see Errors!`
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
        <Modal.Title>{(props.type === "add" ? "Add" : "Edit") + " Planet"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Form.Group className="mb-3" controlId="formPlanetName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={planet.name}
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
              <Form.Group className="mb-3" controlId="formPlanetDescription">
                <Form.Label required>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={planet.description}
                  name="description"
                  onChange={onInputChange}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="formPlanetImageURL">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={planet.image}
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
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formPlanetGravity">
                  <Form.Label>Gravity </Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      max={80}
                      value={planet.gravity}
                      name="gravity"
                      onChange={onInputChange}
                      isInvalid={!!errors.gravity}
                    />
                    <InputGroup.Text>m/s²</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.gravity}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formPlanetType">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    required
                    aria-label="Planet Type Select"
                    value={planet.type}
                    name="type"
                    onChange={onInputChange}
                    isInvalid={!!errors.type}
                  >
                    <option value="">Select...</option>
                    <option value="Resource">Resource</option>
                    <option value="Habitable">Habitable</option>
                    <option value="Tourism">Tourism</option>
                    <option value="Research">Research</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Coordinates</Form.Label>
              <Row>
                <Col sm={4}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>X</InputGroup.Text>
                    <Form.Control
                      required
                      type="number"
                      id="formPlanetCoordsX"
                      min={-9999}
                      max={9999}
                      value={coords.x}
                      name="x"
                      onChange={onInputChange}
                      isInvalid={!!errors.x}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.x}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>
                <Col sm={4}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>Y</InputGroup.Text>
                    <Form.Control
                      required
                      type="number"
                      id="formPlanetCoordsY"
                      min={-9999}
                      max={9999}
                      value={coords.y}
                      name="y"
                      onChange={onInputChange}
                      isInvalid={!!errors.y}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.y}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>
                <Col sm={4}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>Z</InputGroup.Text>
                    <Form.Control
                      required
                      type="number"
                      id="formPlanetCoordsZ"
                      min={-9999}
                      max={9999}
                      value={coords.z}
                      name="z"
                      onChange={onInputChange}
                      isInvalid={!!errors.z}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.z}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>
              </Row>
            </Form.Group>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formPlanetColor1">
                  <Form.Label>Color 1</Form.Label>
                  <Form.Control
                    required
                    type="color"
                    title="Choose your color"
                    value={planet.color1}
                    name="color1"
                    onChange={onInputChange}
                    isInvalid={!!errors.color1}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.color1}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formPlanetColor2">
                  <Form.Label>Color 2</Form.Label>
                  <Form.Control
                    required
                    type="color"
                    title="Choose your color"
                    value={planet.color2}
                    name="color2"
                    onChange={onInputChange}
                    isInvalid={!!errors.color2}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.color2}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
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

export default PlanetModal;
