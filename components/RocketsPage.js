// React
import { useState } from "react";

// Styles
import styles from "./RocketsPage.module.css";
import { Container, Row, Col } from "react-bootstrap";

// Components
import RocketCard from "./Cards/RocketCard";
import Background from "./Background";

export default function RocketsPage(props) {
  const [filter, setFilter] = useState({
    name: "",
    baseCost: {
      min: 0,
      max: 40,
    },
    distCost: {
      min: 0.0001,
      max: 0.006,
    },
    autonomy: {
      min: 3000,
      max: 40000,
    },
    power: {
      min: 5,
      max: 100,
    },
    maxSpeed: {
      min: 100,
      max: 300,
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

  const searchWithFilters = (event) => {
    const { name, value } = event.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  let dataSearch = props.data.rockets.filter((item) => {
    return Object.keys(item).some(
      () =>
        item["name"]
          .toString()
          .toLowerCase()
          .includes(filter.name.toString().toLowerCase()) &&
        item["baseCost"] >= filter.baseCost.min &&
        item["baseCost"] <= filter.baseCost.max &&
        item["distCost"] >= filter.distCost.min &&
        item["distCost"] <= filter.distCost.max &&
        item["autonomy"] >= filter.autonomy.min &&
        item["autonomy"] <= filter.autonomy.max &&
        item["power"] >= filter.power.min &&
        item["power"] <= filter.power.max &&
        item["maxSpeed"] >= filter.maxSpeed.min &&
        item["maxSpeed"] <= filter.maxSpeed.max
    );
  });

  return (
    <section id="rockets" className={styles.main__section}>
      <Background />
      <Container className={styles.rocketsContainer}>
        <Row className="justify-content-md-center">
          <Col>
            <div className={`${styles.rocketsSearchDiv} form-outline`}>
              <input
                type="search"
                id="search-bar"
                placeholder="Search"
                className={`${styles.rocketsSearchInput} form-control`}
                value={filter.name}
                name="name"
                onChange={(value) => searchWithFilters(value)}
              />
              <div className={`${styles.rocketsSearchFilters}`}>
                <Col>
                  <Row>
                    <Col xl={6}>
                      <span className={styles.rocketsSearchFiltersMinMaxTitle}>
                        Base Cost (Min-Max):
                      </span>
                      <input
                        type="number"
                        id="base-cost-min-input"
                        placeholder="0"
                        className={`${styles.rocketsSearchFiltersMinMaxInput} form-control`}
                        name="min"
                        value={filter.baseCost.min}
                        onChange={(value) => setMinMaxFilter(value, "baseCost")}
                      />
                      <span className={styles.rocketsSearchFiltersMinMaxSymbol}>-</span>
                      <input
                        type="number"
                        id="base-cost-max-input"
                        placeholder="40"
                        className={`${styles.rocketsSearchFiltersMinMaxInput} form-control`}
                        name="max"
                        value={filter.baseCost.max}
                        onChange={(value) => setMinMaxFilter(value, "baseCost")}
                      />
                      <span className={styles.rocketsSearchFiltersMinMaxSymbol}>$M</span>
                    </Col>
                    <Col xl={6}>
                      <span className={styles.rocketsSearchFiltersMinMaxTitle}>
                        Dist Cost (Min-Max):
                      </span>
                      <input
                        type="number"
                        id="dist-cost-min-input"
                        placeholder="0.0001"
                        step={0.0001}
                        className={`${styles.rocketsSearchFiltersMinMaxInput} form-control`}
                        name="min"
                        value={filter.distCost.min}
                        onChange={(value) => setMinMaxFilter(value, "distCost")}
                      />
                      <span className={styles.rocketsSearchFiltersMinMaxSymbol}>-</span>
                      <input
                        type="number"
                        id="dist-cost-max-input"
                        placeholder="0.005"
                        step={0.0001}
                        className={`${styles.rocketsSearchFiltersMinMaxInput} form-control`}
                        name="max"
                        value={filter.distCost.max}
                        onChange={(value) => setMinMaxFilter(value, "distCost")}
                      />
                      <span className={styles.rocketsSearchFiltersMinMaxSymbol}>
                        $M/AU
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={6}>
                      <span className={styles.rocketsSearchFiltersMinMaxTitle}>
                        Autonomy (Min-Max):
                      </span>
                      <input
                        type="number"
                        id="autonomy-min-input"
                        placeholder="3000"
                        className={`${styles.rocketsSearchFiltersMinMaxInput} form-control`}
                        name="min"
                        value={filter.autonomy.min}
                        onChange={(value) => setMinMaxFilter(value, "autonomy")}
                      />
                      <span className={styles.rocketsSearchFiltersMinMaxSymbol}>-</span>
                      <input
                        type="number"
                        id="autonomy-max-input"
                        placeholder="40000"
                        className={`${styles.rocketsSearchFiltersMinMaxInput} form-control`}
                        name="max"
                        value={filter.autonomy.max}
                        onChange={(value) => setMinMaxFilter(value, "autonomy")}
                      />
                      <span className={styles.rocketsSearchFiltersMinMaxSymbol}>AU</span>
                    </Col>
                    <Col xl={6}>
                      <span className={styles.rocketsSearchFiltersMinMaxTitle}>
                        Power (Min-Max):
                      </span>
                      <input
                        type="number"
                        id="power-min-input"
                        placeholder="5"
                        className={`${styles.rocketsSearchFiltersMinMaxInput} form-control`}
                        name="min"
                        value={filter.power.min}
                        onChange={(value) => setMinMaxFilter(value, "power")}
                      />
                      <span className={styles.rocketsSearchFiltersMinMaxSymbol}>-</span>
                      <input
                        type="number"
                        id="power-max-input"
                        placeholder="100"
                        className={`${styles.rocketsSearchFiltersMinMaxInput} form-control`}
                        name="max"
                        value={filter.power.max}
                        onChange={(value) => setMinMaxFilter(value, "power")}
                      />
                      <span className={styles.rocketsSearchFiltersMinMaxSymbol}>
                        m/s²
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={6}>
                      <span className={styles.rocketsSearchFiltersMinMaxTitle}>
                        Max Speed (Min-Max):
                      </span>
                      <input
                        type="number"
                        id="max-speed-min-input"
                        placeholder="100"
                        className={`${styles.rocketsSearchFiltersMinMaxInput} form-control`}
                        name="min"
                        value={filter.maxSpeed.min}
                        onChange={(value) => setMinMaxFilter(value, "maxSpeed")}
                      />
                      <span className={styles.rocketsSearchFiltersMinMaxSymbol}>-</span>
                      <input
                        type="number"
                        id="max-speed-max-input"
                        placeholder="300"
                        className={`${styles.rocketsSearchFiltersMinMaxInput} form-control`}
                        name="max"
                        value={filter.maxSpeed.max}
                        onChange={(value) => setMinMaxFilter(value, "maxSpeed")}
                      />
                      <span className={styles.rocketsSearchFiltersMinMaxSymbol}>
                        AU/h
                      </span>
                    </Col>
                  </Row>
                </Col>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          {dataSearch.map((rocket) => {
            return (
              <Col key={rocket.id} xxl={6}>
                <RocketCard key={rocket.id} data={rocket} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}
