/*
  Hooks for Wizard Steps Sales
 */

// Interfaces
import Sale from "src/interfaces/Sale";


// Calculate sale saleAmount
const calculateSaleAmount = (sale: Partial<Sale>) => {
  let saleAmount = 0;
  sale!.products!.forEach((product) => {
    if (product?.price) {
      saleAmount += product!.quantity * product!.price;
    }
  });
  return saleAmount;
};

// Calculate total sale discount
const calculateTotalDiscount = (sale: Partial<Sale>) => {
  let totalDiscount = 0;
  sale!.products!.forEach((product) => {
    if (product.discount) {
      totalDiscount +=
        product!.quantity * product!.discount;
    }
  });
  return totalDiscount;
};

// Calculate total sale cost
const calculateTotalCost = (sale: Partial<Sale>) => {
  let totalCost = 0;
  sale!.products!.forEach((product) => {
    if (product.cost) {
      totalCost += product!.quantity * product!.cost;
    }
  });
  return totalCost;
};

// Calculate total sale quantity
const calculateTotalQuantity = (sale: Partial<Sale>) => {
  let totalQuantity = 0;
  sale!.products!.forEach((product) => {
    totalQuantity += product!.quantity;
  });
  return totalQuantity;
};

// Calcule total sale payments
const calculateTotalPayments = (sales: Partial<Sale>) => {
  let totalPayments = 0;
  sales!.salePayments!.forEach((sale) => {
    if (sale.paymentAmount) {
      totalPayments += sale.paymentAmount;
    }
  });
  return totalPayments;
};

// Function with sales calculations
// @ts-ignore
export const calculateSales = (sales: Partial<Sale>, field: string): number => {
  // Make a switch with saleAmount, totalDiscount, totalCost, totalQuantity
  switch (field) {
    case "saleAmount":
      return calculateSaleAmount(sales);
    case "totalDiscount":
      return calculateTotalDiscount(sales);
    case "totalCost":
      return calculateTotalCost(sales);
    case "totalQuantity":
      return calculateTotalQuantity(sales);
    case "totalPayments":
      return calculateTotalPayments(sales);
    default:
      return 0;
  }
};

// Function to get the principal payment method
export const getPrincipalPaymentMethod = (sales: Partial<Sale>) => {
  // Loop through sale payments, and compare the paymentAmount. The Index with highest paymentAmount is the principal payment method
  let principalPaymentMethod: any = {};
  let highestPaymentAmount: number = 0;
  sales!.salePayments!.forEach((payment: any, index: number) => {
    // For each payment, check if the paymentAmount is higher than the highest paymentAmount
    if (parseFloat(payment.paymentAmount) > highestPaymentAmount) {
      // If so, set the highestPaymentAmount to the paymentAmount and set the principalPaymentMethodIndex to the index
      highestPaymentAmount = parseFloat(payment.paymentAmount);
      principalPaymentMethod = payment;
    }
  });

  return principalPaymentMethod;
};