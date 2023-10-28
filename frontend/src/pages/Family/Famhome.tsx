import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import { useBudgets } from "../../contexts/BudgetsContext";
import BudgetCard from "../../components/BudgetCard";
import AddExpenseModal from "../../components/AddExpenseModal";
import { AuthContext } from "../../contexts/Auth";
import axios from "../../axios";

interface Budget {
  id: number;
  name: string;
  collected: number;
  amount: number;
}

function Famhome() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState<number | null>(null);
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState<number | null>(null);
  const { getBudgetExpenses } = useBudgets();
  const [budget, setBudget] = useState<Budget[]>([]);
  const [error, setError] = useState<string | null>(null); // Add an error state
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);

  const authContext = useContext(AuthContext);
  const fixedlogin = authContext.Login;
  const prefix = fixedlogin.split('_')[0];

  const fetchTasks = () => {
    axios
      .get(`/family/getfam?Login=${prefix}`)
      .then((res) => {
        setBudget(res.data.detailmore);
        console.log(res.data.detailmore);
        setError(null); // Clear any previous errors on success
      })
      .catch((err) => {
        if(budget.length === 0){
          setError("No goals are written.");
        }
        else{
        console.error("Error fetching tasks:", err);
        setError("An error occurred while fetching data."); 
        }// Set an error message
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  function openAddExpenseModal(budgetId: number) {
    setSelectedBudgetId(budgetId);
    setShowAddExpenseModal(true);
  }
  
  return (
    <>
      <Container className="my-4">
        {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
        <Stack direction="horizontal" gap={2} className="mb-4">
          <h1 className="me-auto">Budgets</h1>
        </Stack>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
          {budget.map((budgetItem) => {
            return (
              <BudgetCard
                key={budgetItem.id}
                name={budgetItem.name}
                amount={budgetItem.collected}
                max={budgetItem.amount}
                onAddExpenseClick={() => openAddExpenseModal(budgetItem.id)}
                gray={false} // Provide a dummy value
                hideButtons={false} // Provide a dummy value
              />

            );
          })}
        </div>
      </Container>
      <AddExpenseModal
        show={showAddExpenseModal}
        handleClose={() => {
          setShowAddExpenseModal(false);
          setSelectedBudgetId(null); 
        }}
        selectedBudgetId={selectedBudgetId}
      />
    </>
  );
}

export default Famhome;
