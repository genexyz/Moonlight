import { useState, useEffect } from "react";
import { Button, Container, Modal, Row, Form } from "react-bootstrap";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const DestinationModal = (props) => {
  const [errors, setErrors] = useState({});
  const [destination, setDestination] = useState({
    name: "",
    description: "",
    image: "",
    planetId: "",
  });
  const [planetName, setPlanetName] = useState("");

  useEffect(() => {
    setDestination({
      name: props.destination ? props.destination.name : "",
      description: props.destination ? props.destination.description : "",
      image: props.destination ? props.destination.image : "",
      planetId: props.destination?.planet ? props.destination.planet.id : "",
    });
    setPlanetName(props.destination?.planet ? props.destination.planet.name : "");
  }, [props]);

  const AutocompleteOptions = props.planets.map((planet) => {
    return {
      label: planet.name,
      id: planet.id,
    };
  });

  const handleClose = () => {
    setDestination({
      name: "",
      description: "",
      image: "",
      planetId: "",
    });
    setPlanetName("");
    setErrors({});
    props.handleClose();
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;

    setDestination((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!!errors[name])
      setErrors({
        ...errors,
        [name]: null,
      });
  };

  const onPlanetChange = (event, value) => {
    let planetIdValue = value ? value.id : "";
    let planetNameValue = value ? value.label : "";

    setDestination((prevState) => ({
      ...prevState,
      ["planetId"]: planetIdValue,
    }));

    setPlanetName(planetNameValue);

    if (!!errors["planetId"])
      setErrors({
        ...errors,
        ["planetId"]: null,
      });
  };

  const findFormErrors = () => {
    const { name, description, image, planetId } = destination;
    const newErrors = {};
    if (!name || name === "") newErrors.name = "Cannot be blank!";
    if (!description || description === "") newErrors.description = "Cannot be blank!";
    if (!!image && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image))
      newErrors.image = "Must be a valid image URL or Blank";
    if (!planetId || planetId === "") newErrors.planetId = "Cannot be blank!";

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
          ...destination,
          id: props.destination ? props.destination.id : null,
        };
        const response = await fetch("/api/destination", {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        switch (response.status) {
          case 200:
            handleClose();
            props.refresh();
            props.handleNotification(
              "success",
              ``,
              `Destination ${props.type === "add" ? "created" : "edited"} successfully!`
            );
            break;
          case 202:
            handleClose();
            props.handleNotification(
              "warning",
              `The ${
                props.type === "add" ? "Destination" : "changes"
              } won't appear in the database as you are not an admin!`,
              "The petition would have been successfull!"
            );
            break;
          case 400:
            const data = await response.json();
            setErrors(data);
            console.log(data);
            props.handleNotification(
              "error",
              "",
              `Couldn't ${
                props.type === "add" ? "create" : "edit"
              } destination, see Errors!`
            );
            break;
          case 401:
            handleClose();
            props.handleNotification("error", "", "You are not authorized!");
            break;
          case 500:
            handleClose();
            props.handleNotification("error", "", "Server error!");
            break;
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  return (
    <Modal show={props.show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {(props.type === "add" ? "Add" : "Edit") + " Destination"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Form.Group className="mb-3" controlId="formDestinationName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={destination.name}
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
              <Form.Group className="mb-3" controlId="formDestinationDescription">
                <Form.Label required>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={destination.description}
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
              <Form.Group className="mb-3" controlId="formDestinationImageURL">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={destination.image}
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
              <Form.Group className="mb-3" controlId="formDestinationPlanet">
                <Form.Label required>Planet</Form.Label>
                <Autocomplete
                  disablePortal
                  id="formDestinationPlanetAutocomplete"
                  name="planetId"
                  options={AutocompleteOptions}
                  value={planetName}
                  onChange={(event, value) => onPlanetChange(event, value)}
                  isOptionEqualToValue={() => {
                    return true;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={errors.planetId ? true : false}
                      helperText={errors.planetId}
                    />
                  )}
                />
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

export default DestinationModal;
