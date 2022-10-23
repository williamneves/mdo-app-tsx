// ** React Imports
import { ReactElement, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";

// ** Icons Imports
import Poll from "mdi-material-ui/Poll";
import ChevronUp from "mdi-material-ui/ChevronUp";
import ChevronDown from "mdi-material-ui/ChevronDown";
import TrendingUp from "mdi-material-ui/TrendingUp";
import DotsVertical from "mdi-material-ui/DotsVertical";
import AccountOutline from "mdi-material-ui/AccountOutline";


// ** Types and Interfaces
import { ThemeColor } from "src/@core/layouts/types";
import Sale from "src/interfaces/Sale";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";

export interface SaleDataType {
  stats: string;
  title: string;
  color: ThemeColor;
  icon: ReactElement;
}

const salesData: SaleDataType[] = [
  {
    stats: "8,458",
    color: "primary",
    title: "Customers",
    icon: <AccountOutline />
  },
  {
    stats: "$28.5k",
    color: "warning",
    title: "Total Profit",
    icon: <Poll />
  }, {
    stats: "$28.5k",
    color: "warning",
    title: "Total Profit",
    icon: <Poll />
  },
  {
    color: "info",
    stats: "2,450k",
    title: "Transactions",
    icon: <TrendingUp />
  }
];

const renderStats = (salesData: SaleDataType[]) => {
  return salesData.map((sale: SaleDataType, index: number) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
        <CustomAvatar skin="light" variant="rounded" color={sale.color} sx={{ mr: 4 }}>
          {sale.icon}
        </CustomAvatar>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {sale.stats}
          </Typography>
          <Typography variant="caption">{sale.title}</Typography>
        </Box>
      </Box>
    </Grid>
  ));
};

interface CardStatisticsSalesProps {
  data: SaleDataType[];
  caption: string;
  percentage: {
    type: string;
    percentage: string;
  };
}

const CardStatisticsSales = (props: CardStatisticsSalesProps) => {
  // ** Props
  const { data, caption, percentage } = props;

  // ** States
  const [collapsed, setCollapsed] = useState<boolean>(true);


  return (
    <Card>
      <CardHeader
        title="Resumo de Vendas"
        titleTypographyProps={{ variant: "h6" }}
        action={
          <IconButton
            size="small"
            aria-label="collapse"
            sx={{ color: "text.secondary" }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {!collapsed ? <ChevronDown fontSize="small" /> : <ChevronUp fontSize="small" />}
          </IconButton>
        }
        subheader={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="subtitle2" sx={{ mr: 1.5 }}>
              {caption}
            </Typography>
            {/*<Typography variant="subtitle2" sx={{ color: percentage.type === "decrease" ? 'error.main' : "success.main" }}>*/}
            {/*  {percentage.percentage}*/}
            {/*</Typography>*/}
            {/*<ChevronUp fontSize="small" sx={{ color: "success.main" }} />*/}
          </Box>
        }
      />
      <Collapse in={collapsed}>
        <CardContent>
          <Grid container spacing={6}>
            {renderStats(data)}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

CardStatisticsSales.defaultProps = salesData;

export default CardStatisticsSales;
