import React, {useState, useEffect, useContext}from "react";
import { Button, Card, ProgressBar, Stack } from "react-bootstrap";
import { currencyFormatter } from "../utils";
import axios from "axios";
import { AuthContext } from "../contexts/Auth";
interface BudgetCardProps {
  name: string;
  amount: number;
  max?: number;
  gray?: boolean;
  hideButtons?: boolean;
  onAddExpenseClick?: () => void;
}
interface Budget {
  id: number;
  name: string;
  collected: number;
  amount: number;
}

const BudgetCard: React.FC<BudgetCardProps> = ({
  name,
  amount,
  max,
  gray,
  hideButtons,
  onAddExpenseClick,
}) => {
  const classNames = [];
  if (amount > max!) {
    classNames.push("bg-danger", "bg-opacity-10");
  } else if (gray) {
    classNames.push("bg-light");
  }

  const [status, setStatus] = useState<"not-started" | "running" | "finished">(
    "not-started"
  );
  const authContext = useContext(AuthContext);
  const fixedlogin = authContext.Login;
  const prefix = fixedlogin.split('_')[0];
  const getProgressBarVariant = (amount: number, max: number) => {
    const ratio = amount / max;
    if (ratio < 0.5) return "primary";
    if (ratio < 0.75) return "warning";
    return "danger";
  };
  useEffect(() => {
    axios
      .get("/polls/status")
      .then((res) => {
        setStatus(res.data.status);
      })
      .catch((error) => console.log({ error }));
  }, []);
  console.log(status);
  return (
    <Card className={classNames.join(" ")}>
      <Card.Body>
        {status === "running" || status === "not-started" ? (
          <p>Election should be finished</p>
        ) : (
          <>
            <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
              <div className="me-2">{name}</div>
              <div className="d-flex align-items-baseline">
                {currencyFormatter.format(amount)}
                {max && (
                  <span className="text-muted fs-6 ms-1">
                    / {currencyFormatter.format(max)}
                  </span>
                )}
              </div>
            </Card.Title>
            {max && (
              <ProgressBar
                className="rounded-pill"
                variant={getProgressBarVariant(amount, max)}
                min={0}
                max={max}
                now={amount}
              />
            )}
            {!hideButtons && (
              <Stack direction="horizontal" gap={2} className="mt-4">
                <Button
                  variant="outline-primary"
                  className="ms-auto"
                  onClick={onAddExpenseClick}
                >
                  Add Expense
                </Button>
              </Stack>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
  
};

export default BudgetCard;
