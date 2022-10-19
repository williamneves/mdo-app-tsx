// ** React Imports
import AccountOutline from "mdi-material-ui/AccountOutline";
import Poll from "mdi-material-ui/Poll";
import TrendingUp from "mdi-material-ui/TrendingUp";
import { Fragment, useState, useEffect } from "react";

// ** Import Component
import CardStatisticsSales from "components/cards/CardStatisticsSales";
import { SaleDataType } from "components/cards/CardStatisticsSales";
import { GetDateRange, createDateRange } from "src/@utils/createDateRange";


// ** Api Imports
import * as salesQ from "src/queries/sales";
import { useAuth } from "src/hooks/useAuth";

// ** Import Utils
import { formattedCurrency, formattedCurrencyWithSymbol } from "src/@utils/formatCurrency";

// ** Sales Results Functions
const getTotalSalesAmount = (sales: any) => {
  let totalSales = 0;
  sales.forEach((sale: any) => {
    totalSales += sale.saleAmount;
  });
  return totalSales;
};

// ** Rendered Element
import User from "src/interfaces/User";

interface SalesOverviewProps {
  dateRange?: GetDateRange;
}

const SalesOverview = (props: SalesOverviewProps): JSX.Element => {

  // ** Hooks
  const { user, selectedUser, selectedStore } = useAuth();

  // ** Props
  const {
    dateRange
  } = props;

  // ** States
  const [salesData, setSalesData] = useState<SaleDataType[] | []>([]);

  // ** Apis
  const defaultDateRange = createDateRange("thisMonth");
  // Store Sales
  const {
    data: storeSales,
    isLoading: storeSalesLoading
  } = salesQ.useAllSalesByReferenceAndDateRangeQuery(selectedStore!._id, dateRange && dateRange.range ? dateRange.range : {
    startDate: defaultDateRange.range.startDate,
    endDate: defaultDateRange.range.endDate
  });

  // Vendor Sales
  const {
    data: vendorSales,
    isLoading: vendorSalesLoading,
  } = salesQ.useAllSalesByReferenceAndDateRangeQuery(selectedUser && selectedUser?._id ? selectedUser._id : user!._id, dateRange && dateRange.range ? dateRange.range : {
    startDate: defaultDateRange.range.startDate,
    endDate: defaultDateRange.range.endDate
  });

  const salesDataDefault: SaleDataType[] = [
    {
      stats: formattedCurrencyWithSymbol(getTotalSalesAmount(vendorSales ? vendorSales : [])),
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

  return (
    <Fragment>
      <CardStatisticsSales
        data={salesData.length > 0 ? salesData : salesDataDefault}
      />
    </Fragment>
  );
};

export default SalesOverview;