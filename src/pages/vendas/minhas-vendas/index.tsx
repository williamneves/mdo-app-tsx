// ** React Imports
import { ThemeColor } from "@core/layouts/types";
import AccountOutline from "mdi-material-ui/AccountOutline";
import Poll from "mdi-material-ui/Poll";
import TrendingUp from "mdi-material-ui/TrendingUp";
import { Fragment, useState, useEffect, ReactElement } from "react";

// ** MUI Imports
import {
  Box,
  Grid,
  Typography
} from "@mui/material";

// ** MUI Imports Icons
import AddShoppingCartTwoToneIcon from "@mui/icons-material/AddShoppingCartTwoTone";
import ReceiptIcon from '@mui/icons-material/Receipt';

// ** Api Imports
import * as salesQ from "src/queries/sales";
import { useAuth } from "src/hooks/useAuth";

// ** Utils
import { createDateRange } from "src/@utils/createDateRange";

// ** Third Party Imports
import moment from "moment";
import timezone from "moment-timezone";

// ** Import Component
import CardStatisticsSales from "components/cards/CardStatisticsSales";
import { SaleDataType } from "components/cards/CardStatisticsSales";

const salesData: SaleDataType[] = [
  {
    stats: '8,458',
    color: 'primary',
    title: 'Customers',
    icon: <AccountOutline />
  },
  {
    stats: '$28.5k',
    color: 'warning',
    title: 'Total Profit',
    icon: <Poll />,
  },
  {
    stats: '$28.5k',
    color: 'warning',
    title: 'Total Profit',
    icon: <Poll />,
  },
  {
    color: 'info',
    stats: '2,450k',
    title: 'Transactions',
    icon: <TrendingUp />,
  }];

// ** Rendered Element
const MinhasVendas = () => {
  // ** Use Auth
  const { user, selectedStore } = useAuth();

  // ** States
  const [dateRange, setDateRange] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD")
  });

  // ** React Query
  const {
    data: vendorSales,
    isLoading
  } = salesQ.useAllSalesByReferenceAndDateRangeQuery(selectedStore!._id, dateRange);

  console.log(user?._id, dateRange);
  console.log(vendorSales);

  return (
    <Fragment>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <ReceiptIcon sx={{ fontSize: 30, color: "primary.main" }} />
          <Typography variant="h5">
            Minhas Vendas
          </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <CardStatisticsSales
            data={salesData}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default MinhasVendas;