import { Button, Container, Modal, Row } from "react-bootstrap";

const RocketDeleteModal = (props) => {
  const submitData = async (e) => {
    e.preventDefault();

    try {
      const body = {
        id: props.rocket ? props.rocket.id : null,
      };
      const response = await fetch("/api/rocket", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        props.handleClose();
        props.refresh();
        props.handleNotification("success", `Rocket deleted successfully!`);
      }
      if (response.status === 202) {
        props.handleClose();
        props.handleNotification(
          "warning",
          `The Rocket won't be deleted in the database as you are not an admin!`,
          "The petition would have been successfull!"
        );
      }
      if (response.status === 400) {
        const data = await response.json();
        console.log(data);
        props.handleNotification("error", `Couldn't delete rocket!`);
      }
      if (response.status === 401) {
        props.handleClose();
        props.handleNotification("error", "You are not authorized!");
      }
      if (response.status === 500) {
        props.handleClose();
        props.handleNotification("error", "Server error!");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} size="md">
      <Modal.Header closeButton>
        <Modal.Title>Delete Rocket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            Rocket Name: {"  "}
            {props.rocket?.name ? props.rocket.name : "---"}
          </Row>
          <Row>Are you sure you want to delete this rocket?</Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={submitData}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RocketDeleteModal;
