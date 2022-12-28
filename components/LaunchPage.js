// React & Next
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// Styles
import styles from "./LaunchPage.module.css";
import { Button, Container, Row, Col, Form, Table } from "react-bootstrap";
import "react-notifications/lib/notifications.css";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";

// DatePickers
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

// Components
import Background from "./Background";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { NotificationManager } from "react-notifications";

export default function LaunchPage(props) {
  const router = useRouter();
  const { data: session } = useSession();
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
  const [date, setDate] = useState("");
  const [originName, setOriginName] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [destinationName, setDestinationName] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [requiredPower, setRequiredPower] = useState(0);
  const [showStage2, setShowStage2] = useState(false);
  const [showStage3, setShowStage3] = useState(false);
  const [showStage4, setShowStage4] = useState(false);
  const [hiddenStage1, setHiddenStage1] = useState(false);
  const [hiddenStage2, setHiddenStage2] = useState(false);
  const [hiddenStage3, setHiddenStage3] = useState(false);
  const [selectedRocket, setSelectedRocket] = useState(null);
  const [availableRockets, setAvailableRockets] = useState([]);
  const [open, setOpen] = useState(false);

  const AutocompleteDestinationOptions = props.data.destinations.map((destination) => {
    return {
      label: destination.name,
      id: destination.id,
    };
  });

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  const onDataChange = () => {
    setShowStage2(false);
    setShowStage3(false);
    setShowStage4(false);
    setHiddenStage1(false);
    setHiddenStage2(false);
    setHiddenStage3(false);
    setSelectedRocket(null);
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

  const onRocketSelect = (rocket) => {
    setSelectedRocket(rocket);
    setLaunch((prevState) => ({
      ...prevState,
      ["rocketId"]: rocket.id,
      ["cost"]: parseFloat(rocket.baseCost + rocket.distCost * launch.distance).toFixed(
        2
      ),
      ["duration"]: parseFloat(launch.distance / rocket.maxSpeed).toFixed(2),
    }));

    setShowStage4(false);

    if (!!errors["rocketId"])
      setErrors({
        ...errors,
        ["rocketId"]: null,
      });
  };

  const onDateChange = (newValue) => {
    setLaunch((prevState) => ({
      ...prevState,
      ["date"]: newValue,
    }));

    onDataChange();

    let auxDate = new Date(newValue);
    setDate(
      `${auxDate.getDate()}/${
        auxDate.getMonth() + 1
      }/${auxDate.getFullYear()} - ${auxDate.getHours()}:${auxDate.getMinutes()}`
    );

    if (!!errors["date"])
      setErrors({
        ...errors,
        ["date"]: null,
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
    setSelectedOrigin(props.data.destinations.find((d) => d.id === originIdValue));

    onDataChange();

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
    setSelectedDestination(
      props.data.destinations.find((d) => d.id === destinationIdValue)
    );

    onDataChange();

    if (!!errors["destinationId"])
      setErrors({
        ...errors,
        ["destinationId"]: null,
      });
  };

  const findBeginFormErrors = () => {
    const { description, date, originId, destinationId } = launch;

    const newErrors = {};
    if (!description || description === "") newErrors.description = "Cannot be blank!";
    if (!date || date === "") newErrors.date = "Cannot be blank!";
    if (!originId || originId === "") newErrors.originId = "Cannot be blank!";
    if (!destinationId || destinationId === "")
      newErrors.destinationId = "Cannot be blank!";
    if (originId === destinationId) {
      newErrors.destinationId = "Cannot be the same as origin!";
      newErrors.originId = "Cannot be the same as destination!";
    }
    if (selectedDestination.planet.id === selectedOrigin.planet.id) {
      newErrors.destinationId = "Cannot be on the same planet as origin!";
      newErrors.originId = "Cannot be on the same planet as destination!";
    }

    return newErrors;
  };

  const submitBeginData = async (e) => {
    e.preventDefault();
    const newErrors = findBeginFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});

      // Origin & Destination
      const sOrigin = props.data.destinations.find((d) => d.id === launch.originId);
      setSelectedOrigin(sOrigin);
      const sDestination = props.data.destinations.find(
        (d) => d.id === launch.destinationId
      );
      setSelectedDestination(sDestination);

      // Flight Number
      const date = new Date(launch.date);
      const flightNum = `${originName.substring(0, 3)}${destinationName.substring(
        0,
        3
      )}${session.user.name.substring(
        0,
        3
      )}-${date.getFullYear()}${date.getMonth()}${date.getDate()}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

      setLaunch((prevState) => ({
        ...prevState,
        ["flightNumber"]: flightNum,
      }));

      // Distance
      const x1 = sOrigin.planet.coords.split(",")[0];
      const y1 = sOrigin.planet.coords.split(",")[1];
      const x2 = sDestination.planet.coords.split(",")[0];
      const y2 = sDestination.planet.coords.split(",")[1];
      const z1 = sOrigin.planet.coords.split(",")[2];
      const z2 = sDestination.planet.coords.split(",")[2];
      const dist = parseFloat(
        Math.sqrt(
          (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1)
        ).toFixed(2)
      );
      setLaunch((prevState) => ({
        ...prevState,
        ["distance"]: dist,
      }));

      // Required Power
      const reqPower =
        sOrigin.planet.gravity > sDestination.planet.gravity
          ? sOrigin.planet.gravity
          : sDestination.planet.gravity;
      setRequiredPower(reqPower);

      // Available Rockets
      let filteredRockets = props.data.rockets.filter((item) => {
        return Object.keys(item).some(
          () => item["power"] >= reqPower && item["autonomy"] >= dist
        );
      });
      setAvailableRockets(filteredRockets);

      //User ID
      setLaunch((prevState) => ({
        ...prevState,
        ["userId"]: session.user.id,
      }));

      setHiddenStage1(true);
      setShowStage2(true);
    }
  };

  const submitFlightConfirmationData = async (e) => {
    e.preventDefault();
    const newErrors = findBeginFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setHiddenStage2(true);
      setShowStage3(true);
    }
  };

  const submitRocketSelection = async (e) => {
    e.preventDefault();
    const newErrors = findBeginFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      if (!selectedRocket) {
        NotificationManager.error("A rocket must be selected to proceed");
      } else {
        setHiddenStage3(true);
        setShowStage4(true);
      }
    }
  };

  const submitData = async (e) => {
    e.preventDefault();
    const newErrors = findBeginFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        const body = {
          ...launch,
        };
        const response = await fetch("/api/launch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.status === 200) {
          NotificationManager.success("Launch created successfully!");
          router.push("/launches");
        }
        if (response.status === 203) {
          NotificationManager.warning(
            "The launch won't appear in the database as you are using a test user!",
            "The petition would have been successfull!",
            8000
          );
        }
        if (response.status === 400) {
          const data = await response.json();
          setErrors(data);
          console.log(data);
          NotificationManager.error("Couldn't create launch, see Errors!");
        }
        if (response.status === 401) {
          NotificationManager.error("You are not authorized!");
        }
        if (response.status === 500) {
          NotificationManager.error("Server error!");
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  return (
    <section id="launch" className={styles.main__section}>
      <Background />
      <Container className={styles.launchContainer}>
        {!session && (
          <div
            className={`${styles.launchBorderDiv} form-outline justify-content-md-center text-center`}
          >
            <Link href="/api/auth/signin" passHref>
              <Button variant="primary" className={styles.loginBtn}>
                Login to Launch
              </Button>
            </Link>
          </div>
        )}
        {!hiddenStage1 && session && (
          <Row>
            <div
              className={`${styles.launchBorderDiv} form-outline justify-content-md-center`}
            >
              <Row onClick={() => setHiddenStage1(true)}>
                <Col>
                  <h1 className={styles.title}>🧑‍🚀 Launch Preparations:</h1>
                </Col>
                <Col className={styles.beginBtnRow}>
                  <Image
                    src="/images/icons/minimize.webp"
                    alt="Minimize Icon"
                    width={40}
                    height={40}
                    className={styles.minimizeBtn}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} xl={4}>
                  <Form.Group className="mb-3" controlId="formLaunchOrigin">
                    <Form.Label required>Origin</Form.Label>
                    <Autocomplete
                      disablePortal
                      id="formLaunchOriginAutoComplete"
                      name="originId"
                      className={styles.errorInput}
                      options={AutocompleteDestinationOptions}
                      value={originName}
                      onChange={(event, value) => onOriginChange(event, value)}
                      isOptionEqualToValue={() => {
                        return true;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            backgroundColor: "white",
                            borderRadius: "5px",
                          }}
                          error={errors.originId ? true : false}
                          helperText={errors.originId}
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} xl={4}>
                  <Form.Group className="mb-3" controlId="formLaunchDestination">
                    <Form.Label required>Destination</Form.Label>
                    <Autocomplete
                      disablePortal
                      id="formLaunchDestinationAutoComplete"
                      name="destinationId"
                      className={styles.errorInput}
                      options={AutocompleteDestinationOptions}
                      value={destinationName}
                      onChange={(event, value) => onDestinationChange(event, value)}
                      isOptionEqualToValue={() => {
                        return true;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            backgroundColor: "white",
                            borderRadius: "5px",
                          }}
                          error={errors.destinationId ? true : false}
                          helperText={errors.destinationId}
                        />
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} xl={4}>
                  <Form.Group className="mb-3" controlId="formLaunchDate">
                    <Form.Label>Launch Date</Form.Label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        disablePast
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        className={styles.errorInput}
                        value={launch.date}
                        onChange={onDateChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onKeyDown={onKeyDown}
                            onClick={(e) => setOpen(true)}
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "5px",
                            }}
                            error={errors.date ? true : false}
                            helperText={errors.date}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Form.Group>
                </Col>
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
              <Row className={styles.beginBtnRow}>
                <Col>
                  <Button
                    variant="primary"
                    onClick={submitBeginData}
                    className={styles.beginBtn}
                  >
                    Next Stage
                  </Button>
                </Col>
              </Row>
            </div>
          </Row>
        )}
        {hiddenStage1 && session && (
          <Row>
            <div
              className={`${styles.launchBorderDiv} form-outline justify-content-md-center`}
            >
              <Row onClick={() => setHiddenStage1(false)}>
                <Col>
                  <h1 className={styles.title}>🧑‍🚀 Launch Preparations:</h1>
                </Col>
                <Col className={styles.beginBtnRow}>
                  <Image
                    src="/images/icons/maximize.webp"
                    alt="Maximize Icon"
                    width={40}
                    height={40}
                    className={styles.minimizeBtn}
                  />
                </Col>
              </Row>
            </div>
          </Row>
        )}
        {showStage2 &&
          !hiddenStage2 &&
          selectedOrigin &&
          selectedDestination &&
          launch.flightNumber &&
          requiredPower !== 0 && (
            <Row>
              <div
                className={`${styles.launchBorderDiv} form-outline justify-content-md-center`}
              >
                <Row onClick={() => setHiddenStage2(true)}>
                  <Col>
                    <h1 className={styles.title}>📅 Flight Data Confirmation:</h1>
                  </Col>
                  <Col className={styles.beginBtnRow}>
                    <Image
                      src="/images/icons/minimize.webp"
                      alt="Minimize Icon"
                      width={40}
                      height={40}
                      className={styles.minimizeBtn}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <div className={styles.cardData}>
                      <h3>Origin:</h3>
                      <div className={styles.destinationDataDiv}>
                        <span className={styles.destinationDataName}>Name:</span>
                        <div className={styles.nameLink}>
                          <Link href={`/destinations/${selectedOrigin.id}`}>
                            {selectedOrigin.name}
                          </Link>
                        </div>
                      </div>
                      <div className={styles.destinationDataDiv}>
                        <span className={styles.destinationDataImageName}>Planet:</span>
                        <Image
                          src={selectedOrigin.planet.image}
                          alt={`Origin Planet ${selectedOrigin.planet.name} Image`}
                          width={25}
                          height={25}
                          quality={50}
                          className={styles.destinationPlanetImage}
                        />
                        <div className={styles.nameLink}>
                          <Link href={`/planets/${selectedOrigin.planet.id}`}>
                            {selectedOrigin.planet.name}
                          </Link>
                        </div>
                      </div>
                      <p className={styles.destinationData}>
                        <span className={styles.destinationDataName}>Gravity: </span>
                        {selectedOrigin.planet.gravity} m/s²
                      </p>
                      <p className={styles.destinationData}>
                        <span className={styles.destinationDataName}>Coords: </span>
                        {selectedOrigin.planet.coords}
                      </p>
                      <hr />
                      <Image
                        src={selectedOrigin.image}
                        alt={`Origin Destination ${selectedOrigin.name} Image`}
                        width={300}
                        height={170}
                        quality={50}
                        className={styles.destinationPlanetImage}
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className={styles.cardData}>
                      <h3>Destination:</h3>
                      <div className={styles.destinationDataDiv}>
                        <span className={styles.destinationDataName}>Name:</span>
                        <div className={styles.nameLink}>
                          <Link href={`/destinations/${selectedDestination.id}`}>
                            {selectedDestination.name}
                          </Link>
                        </div>
                      </div>
                      <div className={styles.destinationDataDiv}>
                        <span className={styles.destinationDataImageName}>Planet:</span>
                        <Image
                          src={selectedDestination.planet.image}
                          alt={`Origin Planet ${selectedDestination.planet.name} Image`}
                          width={25}
                          height={25}
                          quality={50}
                          className={styles.destinationPlanetImage}
                        />
                        <div className={styles.nameLink}>
                          <Link href={`/planets/${selectedDestination.planet.id}`}>
                            {selectedDestination.planet.name}
                          </Link>
                        </div>
                      </div>
                      <p className={styles.destinationData}>
                        <span className={styles.destinationDataName}>Gravity: </span>
                        {selectedDestination.planet.gravity} m/s²
                      </p>
                      <p className={styles.destinationData}>
                        <span className={styles.destinationDataName}>Coords: </span>
                        {selectedDestination.planet.coords}
                      </p>
                      <hr />
                      <Image
                        src={selectedDestination.image}
                        alt={`Origin Destination ${selectedDestination.name} Image`}
                        width={300}
                        height={170}
                        quality={50}
                        className={styles.destinationPlanetImage}
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className={styles.cardData}>
                      <h3>Flight Specifications & Requirements:</h3>
                      <p className={styles.destinationData}>
                        <span className={styles.destinationDataName}>Flight Number:</span>
                        {launch.flightNumber}
                        <Tooltip
                          title="This will be the unique flight identification number"
                          placement="right"
                          arrow
                          className={styles.tooltip}
                        >
                          <InfoIcon fontSize="small" color="warning" />
                        </Tooltip>
                      </p>
                      <p className={styles.destinationData}>
                        <span className={styles.destinationDataName}>Date: </span>
                        {date}
                      </p>
                      <p className={styles.destinationData}>
                        <span className={styles.destinationDataName}>Distance: </span>
                        {launch.distance} AU
                        <Tooltip
                          title="Only rockets with the required autonomy can make this flight"
                          placement="right"
                          arrow
                          className={styles.tooltip}
                        >
                          <InfoIcon fontSize="small" color="warning" />
                        </Tooltip>
                      </p>
                      <p className={styles.destinationData}>
                        <span className={styles.destinationDataName}>
                          Required Power:
                        </span>
                        {requiredPower} m/s²
                        <Tooltip
                          title="Only rockets with the required power can make this flight"
                          placement="right"
                          arrow
                          className={styles.tooltip}
                        >
                          <InfoIcon fontSize="small" color="warning" />
                        </Tooltip>
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row className={styles.beginBtnRow}>
                  <Col>
                    <Button
                      variant="primary"
                      onClick={submitFlightConfirmationData}
                      className={styles.beginBtn}
                    >
                      Next Stage
                    </Button>
                  </Col>
                </Row>
              </div>
            </Row>
          )}
        {hiddenStage2 && (
          <Row>
            <div
              className={`${styles.launchBorderDiv} form-outline justify-content-md-center`}
            >
              <Row onClick={() => setHiddenStage2(false)}>
                <Col>
                  <h1 className={styles.title}>📅 Flight Data Confirmation:</h1>
                </Col>
                <Col className={styles.beginBtnRow}>
                  <Image
                    src="/images/icons/maximize.webp"
                    alt="Maximize Icon"
                    width={40}
                    height={40}
                    className={styles.minimizeBtn}
                  />
                </Col>
              </Row>
            </div>
          </Row>
        )}
        {showStage3 && !hiddenStage3 && (
          <Row>
            <div
              className={`${styles.launchBorderDiv} form-outline justify-content-md-center`}
            >
              <Row onClick={() => setHiddenStage3(true)}>
                <Col>
                  <h1 className={styles.title}>🚀 Rocket Selection:</h1>
                </Col>
                <Col className={styles.beginBtnRow}>
                  <Image
                    src="/images/icons/minimize.webp"
                    alt="Minimize Icon"
                    width={40}
                    height={40}
                    className={styles.minimizeBtn}
                  />
                </Col>
              </Row>
              <Row className={styles.dataRow}>
                <Col>
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
                        <th>Flight Cost ($M)</th>
                        <th>Flight Duration</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableRockets.map((rocket) => {
                        return (
                          <tr
                            key={rocket.id}
                            className={`${styles.tableRow} ${
                              rocket.id === selectedRocket?.id ? styles.selectedRow : ""
                            }`}
                          >
                            <th>{rocket.name}</th>
                            <th className={styles.iconImage}>
                              <Image
                                src={rocket.image}
                                alt={`Rocket ${rocket.name} Image`}
                                width={25}
                                height={25}
                                quality={50}
                              />
                            </th>
                            <th>
                              {parseFloat(
                                rocket.baseCost + rocket.distCost * launch.distance
                              ).toFixed(1)}{" "}
                              $M
                            </th>
                            <th>
                              {parseFloat(launch.distance / rocket.maxSpeed).toFixed(2)}{" "}
                              Hs
                            </th>
                            <th>
                              <Button
                                className={styles.selectRocketBtn}
                                onClick={() => onRocketSelect(rocket)}
                              >
                                Select
                              </Button>
                            </th>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row className={styles.beginBtnRow}>
                <Col>
                  <Button
                    variant="primary"
                    onClick={submitRocketSelection}
                    className={styles.beginBtn}
                  >
                    Next Stage
                  </Button>
                </Col>
              </Row>
            </div>
          </Row>
        )}
        {hiddenStage3 && (
          <Row>
            <div
              className={`${styles.launchBorderDiv} form-outline justify-content-md-center`}
            >
              <Row onClick={() => setHiddenStage3(false)}>
                <Col>
                  <h1 className={styles.title}>🚀 Rocket Selection:</h1>
                </Col>
                <Col className={styles.beginBtnRow}>
                  <Image
                    src="/images/icons/maximize.webp"
                    alt="Maximize Icon"
                    width={40}
                    height={40}
                    className={styles.minimizeBtn}
                  />
                </Col>
              </Row>
            </div>
          </Row>
        )}
        {showStage4 && (
          <Row>
            <div
              className={`${styles.launchBorderDiv} form-outline justify-content-md-center`}
            >
              <Row>
                <Col>
                  <h1 className={styles.title}>🎫 Launch Confirmation:</h1>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className={styles.cardData}>
                    <h3>Launch Ticket:</h3>
                    <p className={styles.destinationData}>
                      <span className={styles.destinationDataName}>Flight Number:</span>
                      {launch.flightNumber}
                    </p>
                    <p className={styles.destinationData}>
                      <span className={styles.destinationDataName}>Date:</span>
                      {date}
                    </p>
                    <p className={styles.destinationData}>
                      <span className={styles.destinationDataName}>Duration:</span>
                      {launch.duration}
                    </p>
                    <p className={styles.destinationData}>
                      <span className={styles.destinationDataName}>Cost:</span>
                      {launch.cost}
                    </p>
                    <div className={styles.destinationDataDiv}>
                      <span className={styles.destinationDataName}>Origin:</span>
                      <div className={styles.nameLink}>
                        <Link href={`/destinations/${selectedOrigin.id}`}>
                          {selectedOrigin.name}
                        </Link>
                      </div>
                    </div>
                    <div className={styles.destinationDataDiv}>
                      <span className={styles.destinationDataImageName}>
                        Origin Planet:
                      </span>
                      <Image
                        src={selectedOrigin.planet.image}
                        alt={`Origin Planet ${selectedOrigin.planet.name} Image`}
                        width={25}
                        height={25}
                        quality={50}
                        className={styles.destinationPlanetImage}
                      />
                      <div className={styles.nameLink}>
                        <Link href={`/planets/${selectedOrigin.planet.id}`}>
                          {selectedOrigin.planet.name}
                        </Link>
                      </div>
                    </div>
                    <div className={styles.destinationDataDiv}>
                      <span className={styles.destinationDataName}>Destination:</span>
                      <div className={styles.nameLink}>
                        <Link href={`/destinations/${selectedDestination.id}`}>
                          {selectedDestination.name}
                        </Link>
                      </div>
                    </div>
                    <div className={styles.destinationDataDiv}>
                      <span className={styles.destinationDataImageName}>
                        Destination Planet:
                      </span>
                      <Image
                        src={selectedDestination.planet.image}
                        alt={`Destination Planet ${selectedDestination.planet.name} Image`}
                        width={25}
                        height={25}
                        quality={50}
                        className={styles.destinationPlanetImage}
                      />
                      <div className={styles.nameLink}>
                        <Link href={`/planets/${selectedDestination.planet.id}`}>
                          {selectedDestination.planet.name}
                        </Link>
                      </div>
                    </div>
                    <div className={styles.destinationDataDiv}>
                      <span className={styles.destinationDataImageName}>Rocket:</span>
                      <Image
                        src={selectedRocket.image}
                        alt={`Rocket ${selectedRocket.name} Image`}
                        width={25}
                        height={25}
                        quality={50}
                        className={styles.destinationPlanetImage}
                      />
                      <div className={styles.nameLink}>
                        <Link href={`/rockets/${selectedRocket.id}`}>
                          {selectedRocket.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className={styles.beginBtnRow}>
                <Col>
                  <Button
                    variant="primary"
                    onClick={submitData}
                    className={styles.confirmBtn}
                  >
                    Confirm Launch
                  </Button>
                </Col>
              </Row>
            </div>
          </Row>
        )}
      </Container>
    </section>
  );
}
