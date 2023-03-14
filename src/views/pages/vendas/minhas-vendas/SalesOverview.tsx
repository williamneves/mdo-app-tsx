// ** React Imports
import AccountOutline from "mdi-material-ui/AccountOutline"
import Poll from "mdi-material-ui/Poll"
import TrendingUp from "mdi-material-ui/TrendingUp"
import {Fragment, useState, useEffect} from "react"

// ** Import Component
import CardStatisticsSales from "components/cards/CardStatisticsSales"
import {SaleDataType} from "components/cards/CardStatisticsSales"
import {GetDateRange, createDateRange} from "src/@utils/createDateRange"

// ** Api Imports
import * as salesQ from "src/queries/sales"
import {useAuth} from "src/hooks/useAuth"

// ** Import Utils
import {
  formattedCurrency,
  formattedCurrencyWithSymbol
} from "src/@utils/formatCurrency"
import * as salesFunc from "src/@utils/salesStatistics"

// ** Rendered Element
import User from "src/interfaces/User"

interface SalesOverviewProps {
  dateRange?: GetDateRange
}

const SalesOverview = (props: SalesOverviewProps): JSX.Element => {
  // ** Hooks
  const {user, selectedUser, selectedStore} = useAuth()

  // ** Props
  const {dateRange} = props

  // ** States
  const [salesData, setSalesData] = useState<SaleDataType[] | []>([])

  // ** Apis
  const defaultDateRange = createDateRange("thisMonth")
  // Store Sales
  const {data: storeSales, isLoading: storeSalesLoading} =
    salesQ.useAllSalesByReferenceAndDateRangeQuery(
      selectedStore?._id as string,
      dateRange && dateRange.range
        ? dateRange.range
        : {
            startDate: defaultDateRange.range.startDate,
            endDate: defaultDateRange.range.endDate
          }
    )

  // Vendor Sales
  const {data: vendorSales, isLoading: vendorSalesLoading} =
    salesQ.useAllSalesByReferenceAndDateRangeQuery(
      selectedUser && selectedUser?._id ? selectedUser._id : user!._id,
      dateRange && dateRange.range
        ? dateRange.range
        : {
            startDate: defaultDateRange.range.startDate,
            endDate: defaultDateRange.range.endDate
          }
    )

  // Vendor Sales Last Period
  const {data: vendorSalesLastPeriod, isLoading: vendorSalesLastPeriodLoading} =
    salesQ.useAllSalesByReferenceAndDateRangeQuery(
      selectedUser && selectedUser?._id ? selectedUser._id : user!._id,
      dateRange && dateRange.pastRange
        ? dateRange.pastRange
        : {
            startDate: defaultDateRange!.pastRange!.startDate,
            endDate: defaultDateRange!.pastRange!.endDate
          }
    )

  const caption = () => {
    return `Total da Loja: ${formattedCurrencyWithSymbol(
      salesFunc.totalSaleAmount(storeSales!)
    )}`
  }

  useEffect(() => {
    console.log(vendorSalesLoading, vendorSalesLastPeriodLoading)
  }, [vendorSalesLoading])

  const captionLastPeriod = () => {
    const output: {type: string; percentage: string} = {
      type: "",
      percentage: ""
    }
    const totalSaleAmount = salesFunc.totalSaleAmount(vendorSales!)
    const totalSaleAmountLastPeriod = salesFunc.totalSaleAmount(
      vendorSalesLastPeriod!
    )

    // Return just % of increase or decrease with no decimal places
    if (totalSaleAmount > totalSaleAmountLastPeriod) {
      output.type = "increase"
      output.percentage =
        (totalSaleAmount / totalSaleAmountLastPeriod) * 100 - 100 + "%"
      console.log(totalSaleAmount / totalSaleAmountLastPeriod)
    }

    if (totalSaleAmount < totalSaleAmountLastPeriod) {
      output.type = "decrease"
      output.percentage =
        100 - (totalSaleAmount / totalSaleAmountLastPeriod) * 100 + "%"
      console.log(totalSaleAmount / totalSaleAmountLastPeriod)
    }

    if (totalSaleAmount === totalSaleAmountLastPeriod) {
      output.type = "increase"
      output.percentage = "0%"
    }

    return output
  }

  const salesDataDefault: SaleDataType[] = [
    {
      stats: formattedCurrencyWithSymbol(
        salesFunc.averageSaleAmount(vendorSales!)
      ),
      color: "secondary",
      title: "Ticket Médio",
      icon: <AccountOutline />
    },
    {
      stats: formattedCurrencyWithSymbol(
        salesFunc.highestSaleAmount(vendorSales!)
      ),
      color: "success",
      title: "Maior Venda",
      icon: <Poll />
    },
    {
      stats: salesFunc.scoreAverage(vendorSales!).toFixed(2),
      color: "secondary",
      title: "Score Médio",
      icon: <Poll />
    },
    {
      stats: formattedCurrencyWithSymbol(
        salesFunc.totalSaleAmount(vendorSales!)
      ),
      color: "success",
      title: "Minhas Vendas",
      icon: <TrendingUp />
    }
  ]

  return (
    <Fragment>
      <CardStatisticsSales
        data={salesData.length > 0 ? salesData : salesDataDefault}
        caption={caption()}
        percentage={captionLastPeriod()}
      />
    </Fragment>
  )
}

export default SalesOverview
