// React
import { useState } from "react";

// Styles
import styles from "./PlanetsPage.module.css";
import { Container, Row, Col, Form } from "react-bootstrap";

// Components
import PlanetCard from "./Cards/PlanetCard";
import Background from "./Background";

export default function PlanetsPage(props) {
  const [filter, setFilter] = useState({
    name: "",
    type: {
      habitable: false,
      resource: false,
      research: false,
      tourism: false,
    },
    gravity: {
      min: 0,
      max: 35,
    },
  });

  const setTypeFilter = (event) => {
    const { name, checked } = event.target;
    setFilter((prevState) => ({
      ...prevState,
      ["type"]: {
        ...prevState.type,
        [name]: checked,
      },
    }));
  };

  const setGravityFilter = (event) => {
    const { name, value } = event.target;
    setFilter((prevState) => ({
      ...prevState,
      ["gravity"]: {
        ...prevState.gravity,
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

  let dataSearch = props.data.planets.filter((item) => {
    return Object.keys(item).some(
      () =>
        item["name"]
          .toString()
          .toLowerCase()
          .includes(filter.name.toString().toLowerCase()) &&
        item["gravity"] >= filter.gravity.min &&
        item["gravity"] <= filter.gravity.max &&
        ((item["type"] === "Habitable" && filter.type.habitable) ||
          (item["type"] === "Resource" && filter.type.resource) ||
          (item["type"] === "Research" && filter.type.research) ||
          (item["type"] === "Tourism" && filter.type.tourism) ||
          (!filter.type.habitable &&
            !filter.type.resource &&
            !filter.type.research &&
            !filter.type.tourism))
    );
  });

  return (
    <section id="planets" className={styles.main__section}>
      <Background />
      <Container className={styles.planetsContainer}>
        <Row className="justify-content-md-center">
          <Col>
            <div className={`${styles.planetsSearchDiv} form-outline`}>
              <input
                type="search"
                id="search-bar"
                placeholder="Search"
                className={`${styles.planetsSearchInput} form-control`}
                value={filter.name}
                name="name"
                onChange={(value) => searchWithFilters(value)}
              />
              <div className={`${styles.planetsSearchFilters}`}>
                <Col>
                  <span className={styles.planetsSearchFiltersCheckboxTitle}>
                    Planet Type:
                  </span>
                  <Form.Check
                    inline
                    label="Resource"
                    name="resource"
                    type="checkbox"
                    id={`inline-checkbox-resource`}
                    className={styles.planetsSearchFiltersCheckbox}
                    value={filter.type.resource}
                    onChange={(value) => setTypeFilter(value)}
                  />
                  <Form.Check
                    inline
                    label="Habitable"
                    name="habitable"
                    type="checkbox"
                    id={`inline-checkbox-habitable`}
                    className={styles.planetsSearchFiltersCheckbox}
                    value={filter.type.habitable}
                    onChange={(value) => setTypeFilter(value)}
                  />
                  <Form.Check
                    inline
                    label="Tourism"
                    name="tourism"
                    type="checkbox"
                    id={`inline-checkbox-tourism`}
                    className={styles.planetsSearchFiltersCheckbox}
                    value={filter.type.tourism}
                    onChange={(value) => setTypeFilter(value)}
                  />
                  <Form.Check
                    inline
                    label="Research"
                    name="research"
                    type="checkbox"
                    id={`inline-checkbox-research`}
                    className={styles.planetsSearchFiltersCheckbox}
                    value={filter.type.research}
                    onChange={(value) => setTypeFilter(value)}
                  />
                </Col>
                <Col>
                  <span className={styles.planetsSearchFiltersCheckboxTitle}>
                    Gravity (Min-Max):
                  </span>
                  <input
                    type="number"
                    id="gravity-min-input"
                    placeholder="0"
                    className={`${styles.planetsSearchGravityInput} form-control`}
                    name="min"
                    value={filter.gravity.min}
                    onChange={(value) => setGravityFilter(value)}
                  />
                  <span className={styles.planetsSearchFiltersCheckboxSymbol}>-</span>
                  <input
                    type="number"
                    id="gravity-max-input"
                    placeholder="100"
                    className={`${styles.planetsSearchGravityInput} form-control`}
                    name="max"
                    value={filter.gravity.max}
                    onChange={(value) => setGravityFilter(value)}
                  />
                  <span className={styles.planetsSearchFiltersCheckboxSymbol}>m/s²</span>
                </Col>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          {dataSearch.map((planet) => {
            return (
              <Col key={planet.id} xxl={6}>
                <PlanetCard key={planet.id} data={planet} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}
