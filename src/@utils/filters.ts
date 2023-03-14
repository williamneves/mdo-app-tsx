// Give an array of objects and a key, return an array of unique keys from the array of objects
// Useful when on AutoComplete or Any searchable component to filter on all objects keys when you type
import { matchSorter } from "match-sorter"
import Sale from "interfaces/Sale"
import moment from "moment"
import timezone from "moment-timezone"

const getAllObjectKeys = (arrayOfObjects: any): Array<string> => {
  const keys = arrayOfObjects.map((item: any) => Object.keys(item))
  return Array.from(new Set(keys.flat()))
}

// Give an array of objects, and get return the array filtered by the value at the given key
const filterListByKeyValue = (
  arrayOfObjects: any,
  key: string,
  value: string
): Array<any> => {
  return arrayOfObjects.filter((item: any) => item[key] === value)
}

const matchSearchFilter = (
  options: Array<any>,
  inputValue: string,
  filterKeys: Array<string>
) => matchSorter(options, inputValue, { keys: filterKeys })

const matchSearchFilterByKeys = (options: Array<any>, inputValue: string) =>
  matchSorter(options, inputValue, { keys: getAllObjectKeys(options) })

const filterSales = (sales: Array<Sale>, inputValue: string): Array<Sale> => {
  const filterKeys = [
    "client.name",
    "status",
    "paymentMethod.title",
    "saleNumber",
    "saleAmount",
    "date",
    "PDVNumber",
    "auditStatus",
    "score",
    "markup",
    "profit",
    "totalCost",
    "totalDiscount",
    "totalQuantity"
  ]

  // Make a regex with the word "pending"
  const pendingRegex = new RegExp("pend", "i")
  // Make a regex with the word "approved"
  const approvedRegex = new RegExp("aprov", "i")
  // Make a regex with the word "rejected"
  const rejectedRegex = new RegExp("rejei", "i")
  if (pendingRegex.test(inputValue)) inputValue = "pending"
  if (approvedRegex.test(inputValue)) inputValue = "approved"
  if (rejectedRegex.test(inputValue)) inputValue = "rejected"

  // Transform the date sales to Format DD/MM/YYYY
  const salesWithFormattedDate = [...sales].map((sale: Sale) => {
    return {
      ...sale,
      date: moment(sale.date).tz("America/Belem").format("DD/MM/YYYY")
    }
  })

  return matchSearchFilter(salesWithFormattedDate, inputValue, filterKeys)
}

export {
  getAllObjectKeys,
  filterListByKeyValue,
  matchSearchFilter,
  matchSearchFilterByKeys,
  filterSales
}
