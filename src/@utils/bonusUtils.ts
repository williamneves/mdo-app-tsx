import Sale from '@src/interfaces/Sale';
import { formattedCurrencyWithSymbol } from 'src/@utils/formatCurrency';
import { string } from 'yup';

// ** Sale Bonus Range
type keyNumberNumber = { [key: number]: number } 
export const bonusValueScale:keyNumberNumber = {
	1: 0.01,
	2: 0.018,
	3: 0.025,
	4: 0.03,
	5: 0.032,
	6: 0.0375,
	7: 0.04,
	8: 0.05,
};

export const salesBonusRange: { [key: number]: { min: number; max: number } } = {
	1: {
		min: 0,
		max: 1000,
	},
	2: {
		min: 1000,
		max: 1500,
	},
	3: {
		min: 1500,
		max: 2000,
	},
	4: {
		min: 2000,
		max: 2400,
	},
	5: {
		min: 2400,
		max: 2800,
	},
	6: {
		min: 2800,
		max: 3300,
	},
	7: {
		min: 3300,
		max: 3700,
	},
	8: {
		min: 3700,
		max: Infinity,
	},
};

type ranges = { [key: number]: { qtd: number; total: number, bonus: number } };

export interface ISaleBonusPerVendor {
  bonus: number;
  ranges: ranges;
  description: string;
}

// ** Get Bonus Value per Sale by a General List of Sales
export default function saleBonusPerVendor (sales: Sale[], vendorID?: String): ISaleBonusPerVendor {
	let bonus: number = 0;
	let ranges:ranges = {
		1: {qtd: 0, total: 0, bonus: 0}
		2: {qtd: 0, total: 0, bonus: 0},
		3: {qtd: 0, total: 0, bonus: 0},
		4: {qtd: 0, total: 0, bonus: 0},
		5: {qtd: 0, total: 0, bonus: 0},
		6: {qtd: 0, total: 0, bonus: 0},
		7: {qtd: 0, total: 0, bonus: 0},
		8: {qtd: 0, total: 0, bonus: 0},
	};

  let salesFiltered = [...sales];

	// Filter sales by vendorID
  if (vendorID) {
    salesFiltered = sales.filter((sale) => sale.user?._id === vendorID);
  }

	// By each sale, check what is the range, and multiply by the bonus value
	salesFiltered.forEach((sale) => {
		// Check the range of the sale by totalAmount
		for (let i = 1; i <= 8; i++) {
			if (sale.saleAmount >= salesBonusRange[i].min && sale.saleAmount <= salesBonusRange[i].max) {
        ranges[i].qtd += 1;
        ranges[i].total += sale.saleAmount;
        ranges[i].bonus += sale.saleAmount * bonusValueScale[i];
				bonus += sale.saleAmount * bonusValueScale[i];
			}
		}
  });
  
  // Create a Description string, saying the total bonus and (total qtd), and per range
  let description = `Total: R$ ${bonus.toFixed(2)}\n`;
  for (let i = 1; i <= 8; i++) {
    description += `Range ${i}: ${ranges[i].qtd} (${formattedCurrencyWithSymbol(ranges[i].total)})\n`;
  }

  // Add at the end, each range with min and max
  description += `\n`;
  for (let i = 1; i <= 8; i++) {
    description += `Range ${i}: ${salesBonusRange[i].min} - ${salesBonusRange[i].max}\n`;
  }

	return { bonus, ranges, description };
};

