// ** React Imports
import {Fragment, useState, useEffect} from "react"

// ** MUI Imports
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  Typography,
  Divider,
  Box,
  TextField
} from "@mui/material"

// ** MUI Icons Imports

// ** Import Components
import CardUser from "@views/pages/manager/bonus/lancar/CardUser"

// ** Import Third Party Components
import moment, {Moment} from "moment"
import toast from "react-hot-toast"

// ** Import useAuth Hook
import {useAuth} from "src/hooks/useAuth"

// ** Import APIs
import * as salesQ from "src/queries/sales"
import Sale from "interfaces/Sale"
import * as goalsQ from "src/queries/goals"
import Goal from "interfaces/Goal"
import * as bonusQ from "src/queries/bonus"
import IBonus from "interfaces/Bonus"
import User from "interfaces/User"
import {useQueryClient} from "@tanstack/react-query"
import {SelectPeriodAndGoal} from "@views/pages/manager/bonus/lancar/SelectPeriodAndGoal"

// ** Imports Types
import {IMonthsOfTheYear} from "src/@types"

export const years = () => {
  // Get current year and 1 year before and after
  const currentYear = moment().year()
  return [currentYear - 1, currentYear, currentYear + 1]
}

export const monthsOfTheYear: {label: IMonthsOfTheYear; value: number}[] = [
  {
    label: "Janeiro",
    value: 0
  },
  {
    label: "Fevereiro",
    value: 1
  },
  {
    label: "Março",
    value: 2
  },
  {
    label: "Abril",
    value: 3
  },
  {
    label: "Maio",
    value: 4
  },
  {
    label: "Junho",
    value: 5
  },
  {
    label: "Julho",
    value: 6
  },
  {
    label: "Agosto",
    value: 7
  },
  {
    label: "Setembro",
    value: 8
  },
  {
    label: "Outubro",
    value: 9
  },
  {
    label: "Novembro",
    value: 10
  },
  {
    label: "Dezembro",
    value: 11
  }
]

const getDateRange = (
  month: number,
  year: number
): {startDate: string; endDate: string} => {
  const startDate = moment()
    .year(year)
    .month(month)
    .startOf("month")
    .format("YYYY-MM-DD")
  const endDate = moment()
    .year(year)
    .month(month)
    .endOf("month")
    .format("YYYY-MM-DD")

  return {startDate, endDate}
}

const RedeemBonus = () => {
  // ** Use Auth
  const {selectedStore, user: employee} = useAuth()

  // ** States
  const [selectedMonth, setSelectedMonth] = useState<{
    label: IMonthsOfTheYear
    value: number
  }>(monthsOfTheYear[moment().month()])
  const [selectedYear, setSelectedYear] = useState<number>(moment().year())
  const [dateStart, setDateStart] = useState<string>("")
  const [dateEnd, setDateEnd] = useState<string>("")
  const [selectedGoalId, setSelectedGoalId] = useState<string>("")
  const [blockSelectGoal, setBlockSelectGoal] = useState<boolean>(false)

  // ** Api Calls
  const {data: goals, refetch: refetchGoals} =
    goalsQ.useGetMainGoalsByStoreQuery(selectedStore!._id, dateStart, dateEnd)

  const {data: sales, refetch: refetchSales} =
    salesQ.useAllSalesByReferenceAndDateRangeQuery(selectedStore!._id, {
      startDate: dateStart,
      endDate: dateEnd
    })

  const {data: bonusList} = bonusQ.useGetBonusByReferenceIdQuery(selectedGoalId)

  // * Filter bonus by vendor
  const bonusVendor = (vendorId: string, bonusList: IBonus[]) => {
    return bonusList?.find(bonus => (bonus.user as User)._id === vendorId)
  }

  const bonus = bonusVendor(employee?._id!, bonusList!)

  // ** Get Date Range
  useEffect(() => {
    const {startDate, endDate} = getDateRange(selectedMonth.value, selectedYear)
    setDateStart(startDate)
    setDateEnd(endDate)
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    if (dateStart && dateEnd) {
      refetchGoals()
      refetchSales()
    }
  }, [dateStart, dateEnd])

  return (
    <Grid container spacing={6}>
      <SelectPeriodAndGoal
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedGoalId={selectedGoalId}
        setSelectedGoalId={setSelectedGoalId}
        goals={goals!}
        selectDisabled={selectedGoalId === ""}
        blockSelectGoal={blockSelectGoal}
        setBlockSelectGoal={setBlockSelectGoal}
      />
      {selectedGoalId && blockSelectGoal && (
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" sx={{px: 3}}>
                Premios Lançados
              </Typography>
            </Box>

            <Divider sx={{px: 3}} />
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              {selectedGoalId && bonus && bonus.status !== "draft" ? (
                <CardUser
                  employee={employee!}
                  goal={goals?.find(goal => goal._id === selectedGoalId)!}
                  // @ts-ignore
                  store={selectedStore!}
                  sales={
                    sales?.filter(sale => sale.user?._id === employee?._id!)!
                  }
                  bonus={bonus ? bonus : null}
                  mode={"view"}
                />
              ) : (
                <Typography variant="h5" sx={{p: 5, textAlign: "center"}}>
                  Nenhum prêmio lançado...
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

RedeemBonus.acl = {
  action: "edit",
  subject: "finance-page"
}

export default RedeemBonus
