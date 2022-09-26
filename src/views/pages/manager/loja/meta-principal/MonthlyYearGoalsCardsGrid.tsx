// ** React Imports
import { Fragment } from "react";

// ** MUI Imports
import Grid from "@mui/material/Grid";

// ** Import Components
import MonthYearGoalCard from "./MonthYearGoalCard";

// ** Types and Interfaces


// ** Rendered Element Interface
interface MonthlyYearGoalsCardsGridProps {
  year: number;
}

// ** Rendered Element Component
const MonthlyYearGoalsCardsGrid = (props: MonthlyYearGoalsCardsGridProps): JSX.Element => {

  // Create a array with 12 elements
  const array12 = Array.from(Array(12).keys());

  const {
      year,
  } = props;

  return (
    <Grid container spacing={6}>
      {
        array12.map((month, index) => (
          <MonthYearGoalCard key={index} />
        ))
      }
    </Grid>
  );
};

export default MonthlyYearGoalsCardsGrid;