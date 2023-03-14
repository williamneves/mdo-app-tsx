import moment, {Moment} from "moment"

export type DateRangeOptions =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "last3Months"
  | "thisYear"
  | "lastYear"
  | "customPeriod"

export type CustomPeriod = {
  startDate: Moment | Date | string
  endDate: Moment | Date | string
}

export interface GetDateRange {
  range: {
    startDate: string
    endDate: string
  }
  pastRange?: {
    startDate: string
    endDate: string
  }
  pastMonthRange?: {
    startDate: string
    endDate: string
  }
  pastYearRange?: {
    startDate: string
    endDate: string
  }
  totalDays?: number
}

export const createDateRange = (
  options: DateRangeOptions,
  customPeriod?: CustomPeriod
): GetDateRange => {
  let startDate: Moment
  let endDate: Moment
  let pastStartDate: Moment
  let pastEndDate: Moment
  let pastMonthStartDate: Moment
  let pastMonthEndDate: Moment
  let pastYearStartDate: Moment
  let pastYearEndDate: Moment
  let totalDays: number

  switch (options) {
    case "today":
      startDate = moment().startOf("day")
      endDate = moment().endOf("day")
      pastStartDate = moment().subtract(1, "days").startOf("day")
      pastEndDate = moment().subtract(1, "days").endOf("day")
      pastMonthStartDate = moment().subtract(1, "months").startOf("day")
      pastMonthEndDate = moment().subtract(1, "months").endOf("day")
      pastYearStartDate = moment().subtract(1, "years").startOf("day")
      pastYearEndDate = moment().subtract(1, "years").endOf("day")
      totalDays = 1
      return {
        range: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD")
        },
        pastRange: {
          startDate: pastStartDate.format("YYYY-MM-DD"),
          endDate: pastEndDate.format("YYYY-MM-DD")
        },
        pastMonthRange: {
          startDate: pastMonthStartDate.format("YYYY-MM-DD"),
          endDate: pastMonthEndDate.format("YYYY-MM-DD")
        },
        pastYearRange: {
          startDate: pastYearStartDate.format("YYYY-MM-DD"),
          endDate: pastYearEndDate.format("YYYY-MM-DD")
        },
        totalDays
      }

    case "yesterday":
      startDate = moment().subtract(1, "days").startOf("day")
      endDate = moment().subtract(1, "days").endOf("day")
      pastStartDate = moment().subtract(2, "days").startOf("day")
      pastEndDate = moment().subtract(2, "days").endOf("day")
      pastMonthStartDate = moment().subtract(2, "months").startOf("day")
      pastMonthEndDate = moment().subtract(2, "months").endOf("day")
      pastYearStartDate = moment().subtract(2, "years").startOf("day")
      pastYearEndDate = moment().subtract(2, "years").endOf("day")
      totalDays = 1
      return {
        range: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD")
        },
        pastRange: {
          startDate: pastStartDate.format("YYYY-MM-DD"),
          endDate: pastEndDate.format("YYYY-MM-DD")
        },
        pastMonthRange: {
          startDate: pastMonthStartDate.format("YYYY-MM-DD"),
          endDate: pastMonthEndDate.format("YYYY-MM-DD")
        },
        pastYearRange: {
          startDate: pastYearStartDate.format("YYYY-MM-DD"),
          endDate: pastYearEndDate.format("YYYY-MM-DD")
        },
        totalDays
      }

    case "thisWeek":
      startDate = moment().startOf("week")
      endDate = moment().endOf("week")
      pastStartDate = moment().subtract(1, "weeks").startOf("week")
      pastEndDate = moment().subtract(1, "weeks").endOf("week")
      pastMonthStartDate = moment().subtract(1, "months").startOf("week")
      pastMonthEndDate = moment().subtract(1, "months").endOf("week")
      pastYearStartDate = moment().subtract(1, "years").startOf("week")
      pastYearEndDate = moment().subtract(1, "years").endOf("week")
      totalDays = 7
      return {
        range: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD")
        },
        pastRange: {
          startDate: pastStartDate.format("YYYY-MM-DD"),
          endDate: pastEndDate.format("YYYY-MM-DD")
        },
        pastMonthRange: {
          startDate: pastMonthStartDate.format("YYYY-MM-DD"),
          endDate: pastMonthEndDate.format("YYYY-MM-DD")
        },
        pastYearRange: {
          startDate: pastYearStartDate.format("YYYY-MM-DD"),
          endDate: pastYearEndDate.format("YYYY-MM-DD")
        },
        totalDays
      }

    case "lastWeek":
      startDate = moment().subtract(1, "weeks").startOf("week")
      endDate = moment().subtract(1, "weeks").endOf("week")
      pastStartDate = moment().subtract(2, "weeks").startOf("week")
      pastEndDate = moment().subtract(2, "weeks").endOf("week")
      pastMonthStartDate = moment().subtract(2, "months").startOf("week")
      pastMonthEndDate = moment().subtract(2, "months").endOf("week")
      pastYearStartDate = moment().subtract(2, "years").startOf("week")
      pastYearEndDate = moment().subtract(2, "years").endOf("week")
      totalDays = 7
      return {
        range: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD")
        },
        pastRange: {
          startDate: pastStartDate.format("YYYY-MM-DD"),
          endDate: pastEndDate.format("YYYY-MM-DD")
        },
        pastMonthRange: {
          startDate: pastMonthStartDate.format("YYYY-MM-DD"),
          endDate: pastMonthEndDate.format("YYYY-MM-DD")
        },
        pastYearRange: {
          startDate: pastYearStartDate.format("YYYY-MM-DD"),
          endDate: pastYearEndDate.format("YYYY-MM-DD")
        },
        totalDays
      }

    case "thisMonth":
      startDate = moment().startOf("month")
      endDate = moment().endOf("month")
      pastStartDate = moment().subtract(1, "months").startOf("month")
      pastEndDate = moment().subtract(1, "months").endOf("month")
      pastMonthStartDate = moment().subtract(1, "months").startOf("month")
      pastMonthEndDate = moment().subtract(1, "months").endOf("month")
      pastYearStartDate = moment().subtract(1, "years").startOf("month")
      pastYearEndDate = moment().subtract(1, "years").endOf("month")
      totalDays = moment().daysInMonth()
      return {
        range: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD")
        },
        pastRange: {
          startDate: pastStartDate.format("YYYY-MM-DD"),
          endDate: pastEndDate.format("YYYY-MM-DD")
        },
        pastMonthRange: {
          startDate: pastMonthStartDate.format("YYYY-MM-DD"),
          endDate: pastMonthEndDate.format("YYYY-MM-DD")
        },
        pastYearRange: {
          startDate: pastYearStartDate.format("YYYY-MM-DD"),
          endDate: pastYearEndDate.format("YYYY-MM-DD")
        },
        totalDays
      }

    case "lastMonth":
      startDate = moment().subtract(1, "months").startOf("month")
      endDate = moment().subtract(1, "months").endOf("month")
      pastStartDate = moment().subtract(2, "months").startOf("month")
      pastEndDate = moment().subtract(2, "months").endOf("month")
      pastMonthStartDate = moment().subtract(2, "months").startOf("month")
      pastMonthEndDate = moment().subtract(2, "months").endOf("month")
      pastYearStartDate = moment().subtract(2, "years").startOf("month")
      pastYearEndDate = moment().subtract(2, "years").endOf("month")
      totalDays = moment().subtract(1, "months").daysInMonth()
      return {
        range: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD")
        },
        pastRange: {
          startDate: pastStartDate.format("YYYY-MM-DD"),
          endDate: pastEndDate.format("YYYY-MM-DD")
        },
        pastMonthRange: {
          startDate: pastMonthStartDate.format("YYYY-MM-DD"),
          endDate: pastMonthEndDate.format("YYYY-MM-DD")
        },
        pastYearRange: {
          startDate: pastYearStartDate.format("YYYY-MM-DD"),
          endDate: pastYearEndDate.format("YYYY-MM-DD")
        },
        totalDays
      }

    case "last3Months":
      startDate = moment().subtract(3, "months").startOf("month")
      endDate = moment().subtract(1, "months").endOf("month")
      pastStartDate = moment().subtract(6, "months").startOf("month")
      pastEndDate = moment().subtract(4, "months").endOf("month")
      pastMonthStartDate = moment().subtract(6, "months").startOf("month")
      pastMonthEndDate = moment().subtract(4, "months").endOf("month")
      pastYearStartDate = moment().subtract(2, "years").startOf("month")
      pastYearEndDate = moment().subtract(1, "years").endOf("month")
      totalDays =
        moment().subtract(1, "months").daysInMonth() +
        moment().subtract(2, "months").daysInMonth() +
        moment().subtract(3, "months").daysInMonth()
      return {
        range: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD")
        },
        pastRange: {
          startDate: pastStartDate.format("YYYY-MM-DD"),
          endDate: pastEndDate.format("YYYY-MM-DD")
        },
        pastMonthRange: {
          startDate: pastMonthStartDate.format("YYYY-MM-DD"),
          endDate: pastMonthEndDate.format("YYYY-MM-DD")
        },
        pastYearRange: {
          startDate: pastYearStartDate.format("YYYY-MM-DD"),
          endDate: pastYearEndDate.format("YYYY-MM-DD")
        },
        totalDays
      }

    case "thisYear":
      startDate = moment().startOf("year")
      endDate = moment().endOf("year")
      pastStartDate = moment().subtract(1, "years").startOf("year")
      pastEndDate = moment().subtract(1, "years").endOf("year")
      pastMonthStartDate = moment().subtract(1, "months").startOf("year")
      pastMonthEndDate = moment().subtract(1, "months").endOf("year")
      pastYearStartDate = moment().subtract(1, "years").startOf("year")
      pastYearEndDate = moment().subtract(1, "years").endOf("year")
      totalDays = moment().dayOfYear()
      return {
        range: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD")
        },
        pastRange: {
          startDate: pastStartDate.format("YYYY-MM-DD"),
          endDate: pastEndDate.format("YYYY-MM-DD")
        },
        pastMonthRange: {
          startDate: pastMonthStartDate.format("YYYY-MM-DD"),
          endDate: pastMonthEndDate.format("YYYY-MM-DD")
        },
        pastYearRange: {
          startDate: pastYearStartDate.format("YYYY-MM-DD"),
          endDate: pastYearEndDate.format("YYYY-MM-DD")
        },
        totalDays
      }

    case "lastYear":
      startDate = moment().subtract(1, "years").startOf("year")
      endDate = moment().subtract(1, "years").endOf("year")
      pastStartDate = moment().subtract(2, "years").startOf("year")
      pastEndDate = moment().subtract(2, "years").endOf("year")
      pastMonthStartDate = moment().subtract(2, "months").startOf("year")
      pastMonthEndDate = moment().subtract(2, "months").endOf("year")
      pastYearStartDate = moment().subtract(2, "years").startOf("year")
      pastYearEndDate = moment().subtract(2, "years").endOf("year")
      totalDays = moment().subtract(1, "years").dayOfYear()
      return {
        range: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD")
        },
        pastRange: {
          startDate: pastStartDate.format("YYYY-MM-DD"),
          endDate: pastEndDate.format("YYYY-MM-DD")
        },
        pastMonthRange: {
          startDate: pastMonthStartDate.format("YYYY-MM-DD"),
          endDate: pastMonthEndDate.format("YYYY-MM-DD")
        },
        pastYearRange: {
          startDate: pastYearStartDate.format("YYYY-MM-DD"),
          endDate: pastYearEndDate.format("YYYY-MM-DD")
        },
        totalDays
      }

    case "customPeriod":
      startDate = moment(customPeriod?.startDate)
      endDate = moment(customPeriod?.endDate)
      pastMonthStartDate = moment(customPeriod?.startDate)
        .subtract(1, "days")
        .subtract(1, "months")
        .startOf("day")
      pastMonthEndDate = moment(customPeriod?.startDate).subtract(1, "days")
      pastYearStartDate = moment(customPeriod?.startDate)
        .subtract(1, "days")
        .subtract(1, "years")
        .startOf("day")
      pastYearEndDate = moment(customPeriod?.startDate).subtract(1, "days")
      totalDays =
        moment(customPeriod?.endDate).diff(
          moment(customPeriod?.startDate),
          "days"
        ) + 1

      return {
        range: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD")
        },
        pastMonthRange: {
          startDate: pastMonthStartDate.format("YYYY-MM-DD"),
          endDate: pastMonthEndDate.format("YYYY-MM-DD")
        },
        pastYearRange: {
          startDate: pastYearStartDate.format("YYYY-MM-DD"),
          endDate: pastYearEndDate.format("YYYY-MM-DD")
        },
        totalDays
      }

    default:
      startDate = moment().startOf("month")
      endDate = moment().endOf("month")
      totalDays = moment().daysInMonth()

      return {
        range: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD")
        },
        totalDays
      }
  }
}
