import React, { useState, useEffect, useContext } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import axios from "../axios";
import { AuthContext } from "../contexts/Auth";

interface AddExpenseModalProps {
  show: boolean;
  handleClose: () => void;
  selectedBudgetId: number | null;
}

interface Budget {
  id: number;
  name: string;
  collected: number;
  amount: number;
}

export default function AddExpenseModal({
  show,
  handleClose,
  selectedBudgetId, // Add selectedBudget prop
}: AddExpenseModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | undefined>(0);
  const [budget, setBudget] = useState<Budget[]>([]);
  const authContext = useContext(AuthContext);
  const fixedlogin = authContext.Login;
  const prefix = fixedlogin.split('_')[0];
  const handleSubmit = () => {
    if (!selectedBudgetId) return; // Check if a budget is selected
    const budgetId = selectedBudgetId;

    axios
      .post(`/family/donate`, {
        userId: budgetId,
        donationAmount: amount,
      })
      .then((res) => {
        console.log("Donation successful");
      })
      .catch((err) => {
        console.error("Error donating:", err);
      });

    console.log(amount);
    handleClose();
  };
  const fetchTasks = () => {
    axios
      .get(`/family/getfam?Login=${prefix}`)
      .then((res) => {
        setBudget(res.data.detailmore);
        setError(null); // Clear any previous errors on success
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setError("An error occurred while fetching data."); // Set an error message
      });
  };
  useEffect(() => {
    fetchTasks();
   
  }, []);
  const selectedBudget = budget.find((budget) => budget.id === selectedBudgetId);

  const selectedBudgetName = selectedBudget ? selectedBudget.name : '';
    
  return (
    <Modal show={show} onHide={handleClose}>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Donation for {selectedBudgetName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
              min={0}
              step={0.01}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
