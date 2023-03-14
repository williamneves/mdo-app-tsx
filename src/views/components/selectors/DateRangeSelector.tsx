// ** React Imports
import { Fragment, useState, ChangeEvent } from "react"

// ** MUI Imports
import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  TextField,
  MenuItem
} from "@mui/material"
import { useTheme } from "@mui/material/styles"

// ** Utils
import { createDateRange } from "src/@utils/createDateRange"

// ** Types
import {
  DateRangeOptions,
  GetDateRange,
  CustomPeriod
} from "src/@utils/createDateRange"

// ** Third Party Imports
import moment from "moment"
import timezone from "moment-timezone"

// ** Rendered Element
interface DateRangeSelectorProps {
  option?: DateRangeOptions
  dateRange: GetDateRange
  setDateRange: (dateRange: GetDateRange) => void
}

interface dateRangeOption {
  label: string
  value: DateRangeOptions
}

const dateRangeOptions: dateRangeOption[] = [
  {
    label: "Hoje",
    value: "today"
  },
  {
    label: "Ontem",
    value: "yesterday"
  },
  {
    label: "Esta semana",
    value: "thisWeek"
  },
  {
    label: "Última semana",
    value: "lastWeek"
  },
  {
    label: "Este mês",
    value: "thisMonth"
  },
  {
    label: "Mês anterior",
    value: "lastMonth"
  },
  {
    label: "Últimos 3 meses",
    value: "last3Months"
  },
  {
    label: "Esse ano",
    value: "thisYear"
  },
  {
    label: "Ano anterior",
    value: "lastYear"
  },
  {
    label: "Personalizado",
    value: "customPeriod"
  }
]

const DateRangeSelector = (props: DateRangeSelectorProps): JSX.Element => {
  // ** Props
  const { option, dateRange, setDateRange } = props

  // ** States
  const [selectedOption, setSelectedOption] = useState<DateRangeOptions>(
    option || "thisMonth"
  )
  const [enableCustomPeriod, setEnableCustomPeriod] = useState<boolean>(false)
  const [customPeriod, setCustomPeriod] = useState<CustomPeriod | null>(
    dateRange.range || createDateRange("thisMonth").range
  )

  // ** Handlers
  // Handle change on date range options
  const handleChangeOption = (event: ChangeEvent<HTMLInputElement>) => {
    // Destructure event
    const { value } = event.target

    // Set selected option
    // If values is not customPeriod, set enableCustomPeriod to false
    if (value !== "customPeriod") {
      setSelectedOption(value as DateRangeOptions)
      setEnableCustomPeriod(false)
      setDateRange(createDateRange(value as DateRangeOptions, customPeriod!))
      return
    }

    // If value is customPeriod, set enableCustomPeriod to true
    setSelectedOption(value as DateRangeOptions)
    setEnableCustomPeriod(true)
  }

  return (
    <Fragment>
      <Grid container spacing={5} justifyContent={"flex-end"}>
        <Grid item xs={12} sm={5}>
          <TextField
            select
            fullWidth
            label='Período'
            value={selectedOption}
            onChange={handleChangeOption}
            size={"small"}
          >
            {dateRangeOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default DateRangeSelector
