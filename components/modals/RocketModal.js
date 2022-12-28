import { useState, useEffect } from "react";
import { Button, Container, Modal, Row, Col, Form, InputGroup } from "react-bootstrap";

const RocketModal = (props) => {
  const [errors, setErrors] = useState({});
  const [rocket, setRocket] = useState({
    name: "",
    baseCost: 0,
    distCost: 0,
    autonomy: 0,
    power: 0,
    height: 0,
    weight: 0,
    maxSpeed: 0,
    image: "",
    interiorImage: "",
    exteriorImage: "",
  });

  useEffect(() => {
    setRocket({
      name: props.rocket ? props.rocket.name : "",
      baseCost: props.rocket ? props.rocket.baseCost : 0,
      distCost: props.rocket ? props.rocket.distCost : 0,
      autonomy: props.rocket ? props.rocket.autonomy : 0,
      power: props.rocket ? props.rocket.power : 0,
      height: props.rocket ? props.rocket.height : 0,
      weight: props.rocket ? props.rocket.weight : 0,
      maxSpeed: props.rocket ? props.rocket.maxSpeed : 0,
      image: props.rocket ? props.rocket.image : "",
      interiorImage: props.rocket ? props.rocket.interiorImage : "",
      exteriorImage: props.rocket ? props.rocket.exteriorImage : "",
    });
  }, [props]);

  const handleClose = () => {
    setRocket({
      name: "",
      baseCost: 0,
      distCost: 0,
      autonomy: 0,
      power: 0,
      height: 0,
      weight: 0,
      maxSpeed: 0,
      image: "",
      interiorImage: "",
      exteriorImage: "",
    });
    setErrors({});
    props.handleClose();
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;

    setRocket((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!!errors[name])
      setErrors({
        ...errors,
        [name]: null,
      });
  };

  const findFormErrors = () => {
    const {
      name,
      baseCost,
      distCost,
      autonomy,
      power,
      height,
      weight,
      maxSpeed,
      image,
      interiorImage,
      exteriorImage,
    } = rocket;
    const newErrors = {};
    if (!name || name === "") newErrors.name = "Cannot be blank!";
    if (!baseCost) newErrors.baseCost = "Cannot be blank & should be a number!";
    if (baseCost < 0) newErrors.baseCost = "Cannot be negative!";
    if (!distCost) newErrors.distCost = "Cannot be blank & should be a number!";
    if (distCost < 0) newErrors.distCost = "Cannot be negative!";
    if (!autonomy) newErrors.autonomy = "Cannot be blank & should be a number!";
    if (autonomy < 0) newErrors.autonomy = "Cannot be negative!";
    if (!power) newErrors.power = "Cannot be blank & should be a number!";
    if (power < 0) newErrors.power = "Cannot be negative!";
    if (!height) newErrors.height = "Cannot be blank & should be a number!";
    if (height < 0) newErrors.height = "Cannot be negative!";
    if (height === 0) newErrors.height = "Cannot be 0!";
    if (!weight) newErrors.weight = "Cannot be blank & should be a number!";
    if (weight < 0) newErrors.weight = "Cannot be negative!";
    if (weight === 0) newErrors.weight = "Cannot be 0!";
    if (!maxSpeed) newErrors.maxSpeed = "Cannot be blank & should be a number!";
    if (maxSpeed < 0) newErrors.maxSpeed = "Cannot be negative!";
    if (!!image && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image))
      newErrors.image = "Must be a valid image URL or Blank";
    if (
      !!interiorImage &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(interiorImage)
    )
      newErrors.interiorImage = "Must be a valid image URL or Blank";
    if (
      !!exteriorImage &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(exteriorImage)
    )
      newErrors.exteriorImage = "Must be a valid image URL or Blank";
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
          ...rocket,
          id: props.rocket ? props.rocket.id : null,
        };
        const response = await fetch("/api/rocket", {
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
            `Rocket ${props.type === "add" ? "created" : "edited"} successfully!`
          );
        }
        if (response.status === 202) {
          handleClose();
          props.handleNotification(
            "warning",
            `The ${
              props.type === "add" ? "Rocket" : "changes"
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
            `Couldn't ${props.type === "add" ? "create" : "edit"} rocket, see Errors!`
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
        <Modal.Title>{(props.type === "add" ? "Add" : "Edit") + " Rocket"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Form.Group className="mb-3" controlId="formRocketName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={rocket.name}
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
              <Form.Group className="mb-3" controlId="formRocketImageURL">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={rocket.image}
                  name="image"
                  onChange={onInputChange}
                  placeholder="Default image will be used if left blank"
                  isInvalid={!!errors.image}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="formRocketImageURL">
                <Form.Label>Interior Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={rocket.interiorImage}
                  name="interiorImage"
                  onChange={onInputChange}
                  placeholder="Default image will be used if left blank"
                  isInvalid={!!errors.interiorImage}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.interiorImage}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="formRocketImageURL">
                <Form.Label>Exterior Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={rocket.exteriorImage}
                  name="exteriorImage"
                  onChange={onInputChange}
                  placeholder="Default image will be used if left blank"
                  isInvalid={!!errors.exteriorImage}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.exteriorImage}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Make sure that the images are hosted on a secure and stable site and
                  that the images are transparent (.webp format is suggested)
                </Form.Text>
              </Form.Group>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formRocketBaseCost">
                  <Form.Label>Base Cost</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      value={rocket.baseCost}
                      name="baseCost"
                      onChange={onInputChange}
                      isInvalid={!!errors.baseCost}
                    />
                    <InputGroup.Text>$M</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.baseCost}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formRocketDistCost">
                  <Form.Label>Distance Cost</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      value={rocket.distCost}
                      name="distCost"
                      onChange={onInputChange}
                      isInvalid={!!errors.distCost}
                    />
                    <InputGroup.Text>$M/AU</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.distCost}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formRocketAutonomy">
                  <Form.Label>Autonomy</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      value={rocket.autonomy}
                      name="autonomy"
                      onChange={onInputChange}
                      isInvalid={!!errors.autonomy}
                    />
                    <InputGroup.Text>AU</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.autonomy}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formRocketPower">
                  <Form.Label>Power</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      value={rocket.power}
                      name="power"
                      onChange={onInputChange}
                      isInvalid={!!errors.power}
                    />
                    <InputGroup.Text>m/s²</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.power}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formRocketHeight">
                  <Form.Label>Height</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      value={rocket.height}
                      name="height"
                      onChange={onInputChange}
                      isInvalid={!!errors.height}
                    />
                    <InputGroup.Text>Mts</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.height}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formRocketWeight">
                  <Form.Label>Weight</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      value={rocket.weight}
                      name="weight"
                      onChange={onInputChange}
                      isInvalid={!!errors.weight}
                    />
                    <InputGroup.Text>Tons</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.weight}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formRocketMaxSpeed">
                  <Form.Label>Max speed</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      value={rocket.maxSpeed}
                      name="maxSpeed"
                      onChange={onInputChange}
                      isInvalid={!!errors.maxSpeed}
                    />
                    <InputGroup.Text>AU/h</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.maxSpeed}
                    </Form.Control.Feedback>
                  </InputGroup>
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

export default RocketModal;
