// React
import { useState } from "react";

// Styles
import styles from "./DestinationsPage.module.css";
import { Container, Row, Col, Form } from "react-bootstrap";

// Components
import DestinationSearchCard from "./Cards/DestinationSearchCard";
import Background from "./Background";

export default function DestinationsPage(props) {
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

  let dataSearch = props.data.destinations.filter((item) => {
    return Object.keys(item).some(
      () =>
        item["name"]
          .toString()
          .toLowerCase()
          .includes(filter.name.toString().toLowerCase()) &&
        item.planet["gravity"] >= filter.gravity.min &&
        item.planet["gravity"] <= filter.gravity.max &&
        ((item.planet["type"] === "Habitable" && filter.type.habitable) ||
          (item.planet["type"] === "Resource" && filter.type.resource) ||
          (item.planet["type"] === "Research" && filter.type.research) ||
          (item.planet["type"] === "Tourism" && filter.type.tourism) ||
          (!filter.type.habitable &&
            !filter.type.resource &&
            !filter.type.research &&
            !filter.type.tourism))
    );
  });

  return (
    <section id="destinations" className={styles.main__section}>
      <Background />
      <Container className={styles.destinationsContainer}>
        <Row className="justify-content-md-center">
          <Col>
            <div className={`${styles.destinationsSearchDiv} form-outline`}>
              <input
                type="search"
                id="search-bar"
                placeholder="Search"
                className={`${styles.destinationsSearchInput} form-control`}
                value={filter.name}
                name="name"
                onChange={(value) => searchWithFilters(value)}
              />
              <div className={`${styles.destinationsSearchFilters}`}>
                <Col>
                  <span className={styles.destinationsSearchFiltersCheckboxTitle}>
                    Planet Type:
                  </span>
                  <Form.Check
                    inline
                    label="Resource"
                    name="resource"
                    type="checkbox"
                    id={`inline-checkbox-resource`}
                    className={styles.destinationsSearchFiltersCheckbox}
                    value={filter.type.resource}
                    onChange={(value) => setTypeFilter(value)}
                  />
                  <Form.Check
                    inline
                    label="Habitable"
                    name="habitable"
                    type="checkbox"
                    id={`inline-checkbox-habitable`}
                    className={styles.destinationsSearchFiltersCheckbox}
                    value={filter.type.habitable}
                    onChange={(value) => setTypeFilter(value)}
                  />
                  <Form.Check
                    inline
                    label="Tourism"
                    name="tourism"
                    type="checkbox"
                    id={`inline-checkbox-tourism`}
                    className={styles.destinationsSearchFiltersCheckbox}
                    value={filter.type.tourism}
                    onChange={(value) => setTypeFilter(value)}
                  />
                  <Form.Check
                    inline
                    label="Research"
                    name="research"
                    type="checkbox"
                    id={`inline-checkbox-research`}
                    className={styles.destinationsSearchFiltersCheckbox}
                    value={filter.type.research}
                    onChange={(value) => setTypeFilter(value)}
                  />
                </Col>
                <Col>
                  <span className={styles.destinationsSearchFiltersCheckboxTitle}>
                    Gravity (Min-Max):
                  </span>
                  <input
                    type="number"
                    id="gravity-min-input"
                    placeholder="0"
                    className={`${styles.destinationsSearchGravityInput} form-control`}
                    name="min"
                    value={filter.gravity.min}
                    onChange={(value) => setGravityFilter(value)}
                  />
                  <span className={styles.destinationsSearchFiltersCheckboxSymbol}>
                    -
                  </span>
                  <input
                    type="number"
                    id="gravity-max-input"
                    placeholder="100"
                    className={`${styles.destinationsSearchGravityInput} form-control`}
                    name="max"
                    value={filter.gravity.max}
                    onChange={(value) => setGravityFilter(value)}
                  />
                  <span className={styles.destinationsSearchFiltersCheckboxSymbol}>
                    m/s²
                  </span>
                </Col>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          {dataSearch.map((destination) => {
            return (
              <Col key={destination.id} xl={6} xxl={4}>
                <DestinationSearchCard key={destination.id} data={destination} />
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
}
