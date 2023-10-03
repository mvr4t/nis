import React, { useContext, useState } from "react"
import { v4 as uuidV4 } from "uuid"
import useLocalStorage from "../hooks/useLocalStorage";

const BudgetsContext = React.createContext()
export function useBudgets() {
  return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
  const [expenses, setExpenses] = useLocalStorage("expenses", [])

  function getBudgetExpenses(budgetId) {
    return expenses.filter(expense => expense.budgetId === budgetId)
  }
  function addExpense({ amount, budgetId }) {
    setExpenses(prevExpenses => {
      return [...prevExpenses, { id: uuidV4(), amount, budgetId }]
    })
  }

  return (
    <BudgetsContext.Provider
      value={{
        getBudgetExpenses,
        addExpense,
  
      }}
    >
      {children}
    </BudgetsContext.Provider>
  )
}
