import Sale from "interfaces/Sale";
import PaymentMethod from "interfaces/PaymentMethod";
import authUser from "interfaces/authUser";

// Get Total Sale Amount
export const totalSaleAmount = (sale: Sale[]): number => {
  let totalSaleAmount = 0;
  sale.forEach((sale: Sale) => {
    totalSaleAmount += sale.saleAmount;
  });
  return totalSaleAmount;
};

// Get The Lowest Sale Amount
export const lowestSaleAmount = (sale: Sale[]): number => {
  let lowestSaleAmount = 0;
  sale.forEach((sale: Sale) => {
    if (lowestSaleAmount === 0) {
      lowestSaleAmount = sale.saleAmount;
    } else if (lowestSaleAmount > sale.saleAmount) {
      lowestSaleAmount = sale.saleAmount;
    }
  });
  return lowestSaleAmount;
};

// Get The Highest Sale Amount
export const highestSaleAmount = (sale: Sale[]): number => {
  let highestSaleAmount = 0;
  sale.forEach((sale: Sale) => {
    if (highestSaleAmount === 0) {
      highestSaleAmount = sale.saleAmount;
    } else if (highestSaleAmount < sale.saleAmount) {
      highestSaleAmount = sale.saleAmount;
    }
  });
  return highestSaleAmount;
};

// Get The Average Sale Amount
export const averageSaleAmount = (sale: Sale[]): number => {
  let totalSaleAmount = 0;
  sale.forEach((sale: Sale) => {
    totalSaleAmount += sale.saleAmount;
  });
  return totalSaleAmount / sale.length;
};

// Get The total cost
export const totalCosts = (sale: Sale[]): number => {
  let totalCost = 0;
  sale.forEach((sale: Sale) => {
    totalCost += sale.totalCost;
  });
  return totalCost;
};

// Get the cost average
export const costsAverage = (sale: Sale[]): number => {
  let totalCost = 0;
  sale.forEach((sale: Sale) => {
    totalCost += sale.totalCost;
  });
  return totalCost / sale.length;
};

// Get the total profit
export const totalProfit = (sale: Sale[]): number => {
  let totalProfit = 0;
  sale.forEach((sale: Sale) => {
    totalProfit += sale.profit;
  });
  return totalProfit;
};

// Get the profit average
export const profitAverage = (sale: Sale[]): number => {
  let totalProfit = 0;
  sale.forEach((sale: Sale) => {
    totalProfit += sale.profit;
  });
  return totalProfit / sale.length;
};

// Get The Score Average
export const scoreAverage = (sale: Sale[]): number => {
  let totalScore = 0;
  sale.forEach((sale: Sale) => {
    totalScore += sale.score;
  });
  return totalScore / sale.length;
};

// Markup Average
export const markupAverage = (sale: Sale[]): number => {
  let totalMarkup = 0;
  sale.forEach((sale: Sale) => {
    totalMarkup += sale.markup;
  });
  return totalMarkup / sale.length;
};

// Total Sale per Payment Method
interface salePerPaymentMethod {
  amount: number;
  count: number;
  average: number;
  paymentMethod: PaymentMethod;
}

export const salePerPaymentMethodStats = (sale: Sale[]): salePerPaymentMethod[] | [] => {
  const result: salePerPaymentMethod[] = [];

  // For each sale, verify if the payment method is already in the result array, if not, add it
  // And if it is, add the amount to the amount of the payment method
  sale.forEach((sale: Sale) => {
    // Verify if the payment method is already in the result array
    const paymentMethodAlreadyInResult = result.find((result: salePerPaymentMethod) => result.paymentMethod?._id === sale.paymentMethod?._id);

    // If the payment method is already in the result array, add the amount to the amount of the payment method
    if (paymentMethodAlreadyInResult) {
      paymentMethodAlreadyInResult.amount += sale.saleAmount;
      paymentMethodAlreadyInResult.count += 1;
      paymentMethodAlreadyInResult.average = paymentMethodAlreadyInResult.amount / paymentMethodAlreadyInResult.count;
    }

    // If the payment method is not in the result array, add it
    else {
      result.push({
        amount: sale.saleAmount,
        count: 1,
        average: sale.saleAmount,
        paymentMethod: sale.paymentMethod
      });
    }
  });

  return result;
};

// Total Costs per Payment Method
export const costsPerPaymentMethodStats = (sale: Sale[]): salePerPaymentMethod[] | [] => {
  const result: salePerPaymentMethod[] = [];

  // For each sale, verify if the payment method is already in the result array, if not, add it
  // And if it is, add the amount to the amount of the payment method
  sale.forEach((sale: Sale) => {
    // Verify if the payment method is already in the result array
    const paymentMethodAlreadyInResult = result.find((result: salePerPaymentMethod) => result.paymentMethod?._id === sale.paymentMethod?._id);

    // If the payment method is already in the result array, add the amount to the amount of the payment method
    if (paymentMethodAlreadyInResult) {
      paymentMethodAlreadyInResult.amount += sale.totalCost;
      paymentMethodAlreadyInResult.count += 1;
      paymentMethodAlreadyInResult.average = paymentMethodAlreadyInResult.amount / paymentMethodAlreadyInResult.count;
    }

    // If the payment method is not in the result array, add it
    else {
      result.push({
        amount: sale.totalCost,
        count: 1,
        average: sale.totalCost,
        paymentMethod: sale.paymentMethod
      });
    }
  });

  return result;
};

// Total Sales Per Vendor
interface salePerVendor {
  amount: number;
  count: number;
  average: number;
  vendor: Partial<authUser>;
}

export const salePerVendorStats = (sale: Sale[]): salePerVendor[] | [] => {
  const result: salePerVendor[] = [];

  // For each sale, verify if the vendor is already in the result array, if not, add it
  // And if it is, add the amount to the amount of the vendor
  sale.forEach((sale: Sale) => {
    // Verify if the vendor is already in the result array
    const vendorAlreadyInResult = result.find((result: salePerVendor) => result.vendor?._id === sale.vendor?._id);

    // If the vendor is already in the result array, add the amount to the amount of the vendor
    if (vendorAlreadyInResult) {
      vendorAlreadyInResult.amount += sale.saleAmount;
      vendorAlreadyInResult.count += 1;
      vendorAlreadyInResult.average = vendorAlreadyInResult.amount / vendorAlreadyInResult.count;
    }

    // If the vendor is not in the result array, add it
    else {
      result.push({
        amount: sale.saleAmount,
        count: 1,
        average: sale.saleAmount,
        vendor: sale.vendor!
      });
    }
  });

  return result;
}