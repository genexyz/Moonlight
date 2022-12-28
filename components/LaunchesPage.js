// React & Next
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Styles
import styles from "./LaunchesPage.module.css";
import { Container, Row, Col, Table, Button } from "react-bootstrap";

// DatePicker
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";

// Components
import Background from "./Background";

export default function LaunchesPage(props) {
  const [filter, setFilter] = useState({
    flightNumber: "",
    distance: {
      min: 0,
      max: 30000,
    },
    duration: {
      min: 0,
      max: 150,
    },
    cost: {
      min: 0,
      max: 250,
    },
    date: {
      min: { $d: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
      max: { $d: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) },
    },
  });

  const setMinMaxFilter = (event, parentName) => {
    const { name, value } = event.target;
    setFilter((prevState) => ({
      ...prevState,
      [parentName]: {
        ...prevState[parentName],
        [name]: value,
      },
    }));
  };

  const setMinMaxDate = (date, limit) => {
    setFilter((prevState) => ({
      ...prevState,
      ["date"]: {
        ...prevState["date"],
        [limit]: date,
      },
    }));
  };

  const searchWithFilters = (event) => {
    const { name, value } = event.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  let dataSearch = props.data.launches.filter((item) => {
    return Object.keys(item).some(
      () =>
        item["flightNumber"]
          .toString()
          .toLowerCase()
          .includes(filter.flightNumber.toString().toLowerCase()) &&
        item["cost"] >= filter.cost.min &&
        item["cost"] <= filter.cost.max &&
        item["distance"] >= filter.distance.min &&
        item["distance"] <= filter.distance.max &&
        item["duration"] >= filter.duration.min &&
        item["duration"] <= filter.duration.max &&
        new Date(item["date"]) >= filter.date.min.$d &&
        new Date(item["date"]) <= filter.date.max.$d
    );
  });

  return (
    <section id="launches" className={styles.main__section}>
      <Background />
      <Container className={styles.launchesContainer} fluid>
        <Row className="justify-content-md-center">
          <Col>
            <div className={`${styles.launchesSearchDiv} form-outline`}>
              <input
                type="search"
                id="search-bar"
                placeholder="Search"
                className={`${styles.launchesSearchInput} form-control`}
                value={filter.name}
                name="name"
                onChange={(value) => searchWithFilters(value)}
              />
              <div className={`${styles.launchesSearchFilters}`}>
                <Row>
                  <Col lg={6}>
                    <span className={styles.launchesSearchFiltersMinMaxTitle}>
                      Distance (Min-Max):
                    </span>
                    <input
                      type="number"
                      id="distance-min-input"
                      placeholder="0"
                      className={`${styles.launchesSearchFiltersMinMaxInput} form-control`}
                      name="min"
                      value={filter.distance.min}
                      onChange={(value) => setMinMaxFilter(value, "distance")}
                    />
                    <span className={styles.launchesSearchFiltersMinMaxSymbol}>-</span>
                    <input
                      type="number"
                      id="distance-max-input"
                      placeholder="40"
                      className={`${styles.launchesSearchFiltersMinMaxInput} form-control`}
                      name="max"
                      value={filter.distance.max}
                      onChange={(value) => setMinMaxFilter(value, "distance")}
                    />
                    <span className={styles.launchesSearchFiltersMinMaxSymbol}>AU</span>
                  </Col>
                  <Col lg={6}>
                    <span className={styles.launchesSearchFiltersMinMaxTitle}>
                      Duration (Min-Max):
                    </span>
                    <input
                      type="number"
                      id="duration-min-input"
                      placeholder="0"
                      className={`${styles.launchesSearchFiltersMinMaxInput} form-control`}
                      name="min"
                      value={filter.duration.min}
                      onChange={(value) => setMinMaxFilter(value, "duration")}
                    />
                    <span className={styles.launchesSearchFiltersMinMaxSymbol}>-</span>
                    <input
                      type="number"
                      id="duration-max-input"
                      placeholder="150"
                      className={`${styles.launchesSearchFiltersMinMaxInput} form-control`}
                      name="max"
                      value={filter.duration.max}
                      onChange={(value) => setMinMaxFilter(value, "duration")}
                    />
                    <span className={styles.launchesSearchFiltersMinMaxSymbol}>Hs</span>
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-3" lg={6}>
                    <span className={styles.launchesSearchFiltersMinMaxTitle}>
                      Cost (Min-Max):
                    </span>
                    <input
                      type="number"
                      id="cost-min-input"
                      placeholder="0"
                      className={`${styles.launchesSearchFiltersMinMaxInput} form-control`}
                      name="min"
                      value={filter.cost.min}
                      onChange={(value) => setMinMaxFilter(value, "cost")}
                    />
                    <span className={styles.launchesSearchFiltersMinMaxSymbol}>-</span>
                    <input
                      type="number"
                      id="cost-max-input"
                      placeholder="250"
                      className={`${styles.launchesSearchFiltersMinMaxInput} form-control`}
                      name="max"
                      value={filter.cost.max}
                      onChange={(value) => setMinMaxFilter(value, "cost")}
                    />
                    <span className={styles.launchesSearchFiltersMinMaxSymbol}>$M</span>
                  </Col>
                  <Col className="mt-3" lg={6}>
                    <div className={styles.dateFilterDiv}>
                      <span className={styles.launchesSearchFiltersMinMaxTitle}>
                        Date (From-To):
                      </span>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          inputFormat="DD/MM/YYYY"
                          value={filter.date.min.$d}
                          onChange={(value) => {
                            setMinMaxDate(value, "min");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              className={`${styles.launchesSearchFiltersMinMaxInputDate} m-2`}
                            />
                          )}
                        />
                        <span className={styles.launchesSearchFiltersMinMaxSymbol}>
                          -
                        </span>
                        <DesktopDatePicker
                          inputFormat="DD/MM/YYYY"
                          value={filter.date.max.$d}
                          onChange={(value) => {
                            setMinMaxDate(value, "max");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              className={`${styles.launchesSearchFiltersMinMaxInputDate} m-2`}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        <Row className={`${styles.dataRow} justify-content-md-center`}>
          <Table striped bordered variant="dark" size="sm" className={styles.table}>
            <thead>
              <tr>
                <th>Flight Number</th>
                <th>Cost ($M)</th>
                <th>Distance (AU)</th>
                <th>Duration (Hs)</th>
                <th>Date UTC</th>
                <th>Rocket</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Client</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataSearch.map((launch) => {
                return (
                  <tr key={launch.id} className={styles.tableRow}>
                    <th>{launch.flightNumber}</th>
                    <th>{launch.cost}</th>
                    <th>{launch.distance}</th>
                    <th>{launch.duration}</th>
                    <th>
                      {launch.date.split("T")[0].split("-")[1]}/
                      {launch.date.split("T")[0].split("-")[2]}/
                      {launch.date.split("T")[0].split("-")[0]} -{" "}
                      {launch.date.split("T")[1].split(":")[0]}:
                      {launch.date.split("T")[1].split(":")[1]}
                    </th>
                    <th className={styles.iconImage}>
                      <Image
                        src={launch.rocket.image}
                        alt={`Rocket ${launch.rocket.name} Image`}
                        width={25}
                        height={25}
                        quality={50}
                      />
                      <div className={styles.nameLink}>
                        <Link href={`/rockets/${launch.rocket.id}`}>
                          {launch.rocket.name}
                        </Link>
                      </div>
                    </th>
                    <th className={styles.iconImage}>
                      <Image
                        src={launch.origin.planet.image}
                        alt={`Origin Planet ${launch.origin.planet.name} Image`}
                        width={25}
                        height={25}
                        quality={50}
                      />
                      <div className={styles.nameLink}>
                        <Link href={`/destinations/${launch.origin.id}`}>
                          {launch.origin.name}
                        </Link>
                      </div>
                    </th>
                    <th className={styles.iconImage}>
                      <Image
                        src={launch.destination.planet.image}
                        alt={`Destination Planet ${launch.destination.planet.name} Image`}
                        width={25}
                        height={25}
                        quality={50}
                      />
                      <div className={styles.nameLink}>
                        <Link href={`/destinations/${launch.destination.id}`}>
                          {launch.destination.name}
                        </Link>
                      </div>
                    </th>
                    <th>{launch.user.name}</th>
                    <th>
                      <Link href={`/launches/${launch.flightNumber}`} passHref>
                        <Button className={styles.editAdminBtn}>Details</Button>
                      </Link>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
      </Container>
    </section>
  );
}
