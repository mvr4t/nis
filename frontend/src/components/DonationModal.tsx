import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
interface DonationModalProps {
  show: boolean;
  onHide: () => void;
  onAddDonation: (donationAmount: number) => void;
}
function DonationModal({ show, onHide, onAddDonation }: DonationModalProps) {
  const [donationAmount, setDonationAmount] = useState(0);

  const handleDonate = () => {
    // Validate the donation amount (you can add more validation logic)
    if (donationAmount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    // Call the onAddDonation callback with the donation amount
    onAddDonation(donationAmount);

    // Close the modal
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Donate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="donationAmount">
          <Form.Label>Enter Donation Amount:</Form.Label>
          <Form.Control
            type="number"
            min="0"
            value={donationAmount}
            onChange={(e) => setDonationAmount(Number(e.target.value))}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleDonate}>
          Donate
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DonationModal;
