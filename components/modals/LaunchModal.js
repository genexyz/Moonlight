import { useState, useEffect } from "react";
import { Button, Container, Modal, Row, Col, Form, InputGroup } from "react-bootstrap";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// DatePickers
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const LaunchModal = (props) => {
  const [errors, setErrors] = useState({});
  const [launch, setLaunch] = useState({
    flightNumber: "",
    description: "",
    cost: 0,
    distance: 0,
    duration: 0,
    date: null,
    rocketId: "",
    originId: "",
    destinationId: "",
    userId: "",
  });
  const [rocketName, setRocketName] = useState("");
  const [originName, setOriginName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [userName, setUserName] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLaunch({
      flightNumber: props.launch ? props.launch.flightNumber : "",
      description: props.launch ? props.launch.description : "",
      cost: props.launch ? props.launch.cost : 0,
      distance: props.launch ? props.launch.distance : 0,
      duration: props.launch ? props.launch.duration : 0,
      date: props.launch ? new Date(props.launch.date) : null,
      rocketId: props.launch?.rocket ? props.launch.rocket.id : "",
      originId: props.launch?.origin ? props.launch.origin.id : "",
      destinationId: props.launch?.destination ? props.launch.destination.id : "",
      userId: props.launch?.user ? props.launch.user.id : "",
    });
    setRocketName(props.launch?.rocket ? props.launch.rocket.name : "");
    setOriginName(props.launch?.origin ? props.launch.origin.name : "");
    setDestinationName(props.launch?.destination ? props.launch.destination.name : "");
    setUserName(props.launch?.user ? props.launch.user.name : "");
  }, [props]);

  const AutocompleteRocketOptions = props.rockets.map((rocket) => {
    return {
      label: rocket.name,
      id: rocket.id,
    };
  });

  const AutocompleteDestinationOptions = props.destinations.map((destination) => {
    return {
      label: destination.name,
      id: destination.id,
    };
  });

  const AutocompleteUserOptions = props.users.map((user) => {
    return {
      label: user.name,
      id: user.id,
    };
  });

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  const handleClose = () => {
    setLaunch({
      flightNumber: "",
      description: "",
      cost: 0,
      distance: 0,
      duration: 0,
      date: null,
      rocketId: "",
      originId: "",
      destinationId: "",
      userId: "",
    });
    setRocketName("");
    setOriginName("");
    setDestinationName("");
    setUserName("");
    setErrors({});
    props.handleClose();
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;

    setLaunch((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!!errors[name])
      setErrors({
        ...errors,
        [name]: null,
      });
  };

  const onDateChange = (newValue) => {
    setLaunch((prevState) => ({
      ...prevState,
      ["date"]: newValue,
    }));

    if (!!errors["date"])
      setErrors({
        ...errors,
        ["date"]: null,
      });
  };

  const onRocketChange = (event, value) => {
    let rocketIdValue = value ? value.id : "";
    let rocketNameValue = value ? value.label : "";

    setLaunch((prevState) => ({
      ...prevState,
      ["rocketId"]: rocketIdValue,
    }));

    setRocketName(rocketNameValue);

    if (!!errors["rocketId"])
      setErrors({
        ...errors,
        ["rocketId"]: null,
      });
  };

  const onOriginChange = (event, value) => {
    let originIdValue = value ? value.id : "";
    let originNameValue = value ? value.label : "";

    setLaunch((prevState) => ({
      ...prevState,
      ["originId"]: originIdValue,
    }));

    setOriginName(originNameValue);

    if (!!errors["originId"])
      setErrors({
        ...errors,
        ["originId"]: null,
      });
  };

  const onDestinationChange = (event, value) => {
    let destinationIdValue = value ? value.id : "";
    let destinationNameValue = value ? value.label : "";

    setLaunch((prevState) => ({
      ...prevState,
      ["destinationId"]: destinationIdValue,
    }));

    setDestinationName(destinationNameValue);

    if (!!errors["destinationId"])
      setErrors({
        ...errors,
        ["destinationId"]: null,
      });
  };

  const onUserChange = (event, value) => {
    let userIdValue = value ? value.id : "";
    let userNameValue = value ? value.label : "";

    setLaunch((prevState) => ({
      ...prevState,
      ["userId"]: userIdValue,
    }));

    setUserName(userNameValue);

    if (!!errors["userId"])
      setErrors({
        ...errors,
        ["userId"]: null,
      });
  };

  const findFormErrors = () => {
    const {
      flightNumber,
      description,
      cost,
      distance,
      duration,
      date,
      rocketId,
      originId,
      destinationId,
      userId,
    } = launch;

    const newErrors = {};
    if (!flightNumber || flightNumber === "") newErrors.flightNumber = "Cannot be blank!";
    if (!description || description === "") newErrors.description = "Cannot be blank!";
    if (!cost) newErrors.cost = "Cannot be blank & should be a number!";
    if (cost < 0) newErrors.cost = "Cannot be negative!";
    if (cost === 0) newErrors.cost = "Cannot be 0!";
    if (!distance) newErrors.distance = "Cannot be blank & should be a number!";
    if (distance < 0) newErrors.distance = "Cannot be negative!";
    if (distance === 0) newErrors.distance = "Cannot be 0!";
    if (!duration) newErrors.duration = "Cannot be blank & should be a number!";
    if (duration < 0) newErrors.duration = "Cannot be negative!";
    if (duration === 0) newErrors.duration = "Cannot be 0!";
    if (!date || date === "") newErrors.date = "Cannot be blank!";
    if (!rocketId || rocketId === "") newErrors.rocketId = "Cannot be blank!";
    if (!originId || originId === "") newErrors.originId = "Cannot be blank!";
    if (!destinationId || destinationId === "")
      newErrors.destinationId = "Cannot be blank!";
    if (!userId || userId === "") newErrors.userId = "Cannot be blank!";

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
          ...launch,
          id: props.launch ? props.launch.id : null,
        };
        const response = await fetch("/api/launch", {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.status === 200) {
          handleClose();
          props.refresh();
          props.handleNotification(
            "success",
            "",
            `Launch ${props.type === "add" ? "created" : "edited"} successfully!`
          );
        }
        if (response.status === 202) {
          handleClose();
          props.handleNotification(
            "warning",
            `The ${
              props.type === "add" ? "Launch" : "changes"
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
            "",
            `Couldn't ${props.type === "add" ? "create" : "edit"} launch, see Errors!`
          );
        }
        if (response.status === 401) {
          handleClose();
          props.handleNotification("error", "", "You are not authorized!");
        }
        if (response.status === 500) {
          handleClose();
          props.handleNotification("error", "", "Server error!");
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  return (
    <Modal show={props.show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{(props.type === "add" ? "Add" : "Edit") + " Launch"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Form.Group className="mb-3" controlId="formLaunchFlightNumber">
                <Form.Label>FlightNumber</Form.Label>
                <Form.Control
                  type="text"
                  value={launch.flightNumber}
                  name="flightNumber"
                  onChange={onInputChange}
                  isInvalid={!!errors.flightNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.flightNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="formLaunchDescription">
                <Form.Label required>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={launch.description}
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
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formLaunchCost">
                  <Form.Label>Cost</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      value={launch.cost}
                      name="cost"
                      onChange={onInputChange}
                      isInvalid={!!errors.cost}
                    />
                    <InputGroup.Text>$M</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.cost}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formLaunchDistance">
                  <Form.Label>Distance</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      value={launch.distance}
                      name="distance"
                      onChange={onInputChange}
                      isInvalid={!!errors.distance}
                    />
                    <InputGroup.Text>AU</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.distance}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="formLaunchDuration">
                  <Form.Label>Duration</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      value={launch.duration}
                      name="duration"
                      onChange={onInputChange}
                      isInvalid={!!errors.duration}
                    />
                    <InputGroup.Text>Hs</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.duration}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="formLaunchDate">
                <Form.Label>Date</Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    disablePast
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    value={launch.date}
                    onChange={onDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onKeyDown={onKeyDown}
                        onClick={(e) => setOpen(true)}
                        error={errors.date ? true : false}
                        helperText={errors.date}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Form.Group>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formLaunchRocket">
                  <Form.Label required>Rocket</Form.Label>
                  <Autocomplete
                    disablePortal
                    id="formLaunchRocketAutoComplete"
                    name="rocketId"
                    options={AutocompleteRocketOptions}
                    value={rocketName}
                    onChange={(event, value) => onRocketChange(event, value)}
                    isOptionEqualToValue={() => {
                      return true;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={errors.rocketId ? true : false}
                        helperText={errors.rocketId}
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formLaunchUser">
                  <Form.Label required>User</Form.Label>
                  <Autocomplete
                    disablePortal
                    id="formLaunchUserAutoComplete"
                    name="userId"
                    options={AutocompleteUserOptions}
                    value={userName}
                    onChange={(event, value) => onUserChange(event, value)}
                    isOptionEqualToValue={() => {
                      return true;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={errors.userId ? true : false}
                        helperText={errors.userId}
                      />
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formLaunchOrigin">
                  <Form.Label required>Origin</Form.Label>
                  <Autocomplete
                    disablePortal
                    id="formLaunchOriginAutoComplete"
                    name="originId"
                    options={AutocompleteDestinationOptions}
                    value={originName}
                    onChange={(event, value) => onOriginChange(event, value)}
                    isOptionEqualToValue={() => {
                      return true;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={errors.originId ? true : false}
                        helperText={errors.originId}
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formLaunchDestination">
                  <Form.Label required>Destination</Form.Label>
                  <Autocomplete
                    disablePortal
                    id="formLaunchDestinationAutoComplete"
                    name="destinationId"
                    options={AutocompleteDestinationOptions}
                    value={destinationName}
                    onChange={(event, value) => onDestinationChange(event, value)}
                    isOptionEqualToValue={() => {
                      return true;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={errors.destinationId ? true : false}
                        helperText={errors.destinationId}
                      />
                    )}
                  />
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

export default LaunchModal;
