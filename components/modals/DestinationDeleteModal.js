import { Button, Container, Modal, Row } from "react-bootstrap";

const DestinationDeleteModal = (props) => {
  const submitData = async (e) => {
    e.preventDefault();

    try {
      const body = {
        id: props.destination ? props.destination.id : null,
      };
      const response = await fetch("/api/destination", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        props.handleClose();
        props.refresh();
        props.handleNotification("success", `Destination deleted successfully!`);
      }
      if (response.status === 202) {
        props.handleClose();
        props.handleNotification(
          "warning",
          `The Destination won't be deleted in the database as you are not an admin!`,
          "The petition would have been successfull!"
        );
      }
      if (response.status === 400) {
        const data = await response.json();
        console.log(data);
        props.handleNotification("error", `Couldn't delete destination!`);
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
        <Modal.Title>Delete Destination</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            Destination Name: {"  "}
            {props.destination?.name ? props.destination.name : "---"}
          </Row>
          <Row>Are you sure you want to delete this Destination?</Row>
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

export default DestinationDeleteModal;
