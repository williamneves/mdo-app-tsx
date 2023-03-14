// ** React Imports
import SalesDataGrid from "components/data-grid/SalesDataGrid"
import DateRangeSelector from "components/selectors/DateRangeSelector"
import { Fragment, useState, useEffect, ReactElement } from "react"

// ** MUI Imports
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  useMediaQuery
} from "@mui/material"
import { useTheme } from "@mui/material/styles"

// ** MUI Imports Icons
import ReceiptIcon from "@mui/icons-material/Receipt"

// ** Api Imports
import * as salesQ from "src/queries/sales"
import { useAuth } from "src/hooks/useAuth"

// ** Utils
import {
  GetDateRange,
  createDateRange,
  CustomPeriod
} from "src/@utils/createDateRange"

interface dateRange {
  startDate: string
  endDate: string
}

// ** Third Party Imports
import moment from "moment"
import timezone from "moment-timezone"

// ** Import Component
import SalesOverview from "@views/pages/vendas/minhas-vendas/SalesOverview"
import { SaleDataType } from "components/cards/CardStatisticsSales"
import SelectVendor from "@views/components/selectors/SelectVendor"

// ** Rendered Element
const MinhasVendas = () => {
  // ** Use Auth
  const { user, selectedStore, selectedUser } = useAuth()

  // ** States
  const [dateRange, setDateRange] = useState<GetDateRange>(
    createDateRange("thisMonth")
  )

  // ** Hooks
  const theme = useTheme()
  // Get the media query
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const getUser = selectedUser ? selectedUser : user

  // ** React Query
  const { data: vendorSales, isLoading } =
    salesQ.useAllSalesByReferenceAndDateRangeQuery(
      getUser!._id!,
      dateRange.range as dateRange
    )

  console.log(user?._id, dateRange)
  console.log(vendorSales)

  return (
    <Fragment>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3
            }}
          >
            <ReceiptIcon sx={{ fontSize: 30, color: "primary.main" }} />
            <Typography variant='h5'>Minhas Vendas</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "flex-start" : "flex-end",
              gap: 3
            }}
          >
            {user?.role === "admin" ||
              (user?.role === "manager" && <SelectVendor />)}
            <DateRangeSelector
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <SalesOverview dateRange={dateRange} />
        </Grid>
        <Grid item xs={12}>
          <SalesDataGrid sales={vendorSales!} loading={isLoading} />
        </Grid>
      </Grid>
    </Fragment>
  )
}

MinhasVendas.acl = {
  action: "read",
  subject: "vendor-page"
}

export default MinhasVendas
