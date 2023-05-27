import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export const PopupModal = (props) => {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(1);
  const [additionalTokenId, setAdditionalTokenId] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useState(() => {
    if (props?.defaultValue === "SHOW") {
      handleShow();
    }
    if (props?.defaultValue === "HIDE") {
      handleClose();
    }
  });



  return (
    <div>
      {props?.hideButton === false && (
        <Button variant="primary" onClick={handleShow}>
          {props?.buttonName}
        </Button>
      )}

      <Modal show={show} onHide={handleShow}>
        <Modal.Header closeButton={false}>
          <Modal.Title>
            {props?.title} {" " + props?.buttonName ? props?.buttonName : ""}{" "}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container">
            {props?.description}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
              variant="primary"
              onClick={() => {
                props.func(props?.id, amount);
                handleClose();
                if (props?.addLoading) {
                  props.setLoading(true);
                }
              }}
          >
            {props?.saveButtonName ? props?.saveButtonName : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
