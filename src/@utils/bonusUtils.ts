import Sale from "@src/interfaces/Sale"
import { formattedCurrencyWithSymbol } from "src/@utils/formatCurrency"
import { string } from "yup"

// ** Sale Bonus Range
type keyNumberNumber = { [key: number]: number }
export const bonusValueScale = (goalLevel: 1 | 2 | 3 | 4): keyNumberNumber => {
  switch (goalLevel) {
    case 1:
      return {
        1: 0.004,
        2: 0.007,
        3: 0.013,
        4: 0.018,
        5: 0.022,
        6: 0.0265,
        7: 0.03,
        8: 0.034
      }

    case 2:
      return {
        1: 0.007,
        2: 0.01,
        3: 0.016,
        4: 0.0225,
        5: 0.026,
        6: 0.03,
        7: 0.033,
        8: 0.036
      }

    case 3:
      return {
        1: 0.09,
        2: 0.012,
        3: 0.019,
        4: 0.025,
        5: 0.029,
        6: 0.033,
        7: 0.0365,
        8: 0.04
      }

    case 4:
      return {
        1: 0.01,
        2: 0.015,
        3: 0.023,
        4: 0.027,
        5: 0.03,
        6: 0.035,
        7: 0.0385,
        8: 0.043
      }

    default:
      return {
        1: 0.01,
        2: 0.015,
        3: 0.023,
        4: 0.027,
        5: 0.03,
        6: 0.035,
        7: 0.0385,
        8: 0.043
      }
  }
}

export const salesBonusRange: { [key: number]: { min: number; max: number } } =
  {
    1: {
      min: 0,
      max: 1000
    },
    2: {
      min: 1000,
      max: 1500
    },
    3: {
      min: 1500,
      max: 2000
    },
    4: {
      min: 2000,
      max: 2400
    },
    5: {
      min: 2400,
      max: 2800
    },
    6: {
      min: 2800,
      max: 3300
    },
    7: {
      min: 3300,
      max: 3700
    },
    8: {
      min: 3700,
      max: Infinity
    }
  }

type ranges = { [key: number]: { qtd: number; total: number; bonus: number } }

export interface ISaleBonusPerVendor {
  bonus: number
  ranges: ranges
  description: string
}

// ** Get Bonus Value per Sale by a General List of Sales
export default function saleBonusPerVendor(
  sales: Sale[],
  goalLevel: 1 | 2 | 3 | 4,
  vendorID?: String
): ISaleBonusPerVendor {
  let bonus: number = 0
  let ranges: ranges = {
    1: { qtd: 0, total: 0, bonus: 0 },
    2: { qtd: 0, total: 0, bonus: 0 },
    3: { qtd: 0, total: 0, bonus: 0 },
    4: { qtd: 0, total: 0, bonus: 0 },
    5: { qtd: 0, total: 0, bonus: 0 },
    6: { qtd: 0, total: 0, bonus: 0 },
    7: { qtd: 0, total: 0, bonus: 0 },
    8: { qtd: 0, total: 0, bonus: 0 }
  }

  const bonusScale = bonusValueScale(goalLevel)

  let salesFiltered = [...sales]

  // Filter sales by vendorID
  if (vendorID) {
    salesFiltered = sales.filter(sale => sale.user?._id === vendorID)
  }

  // By each sale, check what is the range, and multiply by the bonus value
  salesFiltered.forEach(sale => {
    // Check the range of the sale by totalAmount
    for (let i = 1; i <= 8; i++) {
      if (
        sale.saleAmount >= salesBonusRange[i].min &&
        sale.saleAmount <= salesBonusRange[i].max
      ) {
        ranges[i].qtd += 1
        ranges[i].total += sale.saleAmount
        ranges[i].bonus += sale.saleAmount * bonusScale[i]
        bonus += sale.saleAmount * bonusScale[i]
      }
    }
  })

  // Create a Description string, saying the total bonus and (total qtd), and per range
  let description = `Bônus Total..........................: ${formattedCurrencyWithSymbol(
    bonus
  )}\n`
  description += `\n`
  description += `Detalhamento:\n`
  description += `\n`

  for (let i = 1; i <= 8; i++) {
    description += `Nível ${i}: ${
      ranges[i].qtd
    } vendas, total de ${formattedCurrencyWithSymbol(
      ranges[i].total
    )}, bônus de ${formattedCurrencyWithSymbol(ranges[i].bonus)}\n`
  }

  // Add total sale amount
  description += `\n`
  description += `Total em vendas: ${formattedCurrencyWithSymbol(
    salesFiltered.reduce((acc, sale) => acc + sale.saleAmount, 0)
  )}\n`
  description += `Total em bônus: ${formattedCurrencyWithSymbol(bonus)} (${(
    (bonus / salesFiltered.reduce((acc, sale) => acc + sale.saleAmount, 0)) *
    100
  ).toFixed(2)})%\n`

  // Add at the end, each range with min and max
  description += `\n`
  description += `Descrição dos níveis:\n`
  description += `\n`
  for (let i = 1; i <= 8; i++) {
    description += `Nível ${i}: ${formattedCurrencyWithSymbol(
      salesBonusRange[i].min
    )} - ${
      salesBonusRange[i].max === Infinity
        ? "..."
        : formattedCurrencyWithSymbol(salesBonusRange[i].max)
    }\n`
  }

  return { bonus, ranges, description }
}
