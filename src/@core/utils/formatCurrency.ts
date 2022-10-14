// Format a value to a currency Brazilian format
export const formattedCurrency = (value: number) => {
  // Using the Intl.NumberFormat API
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2
  }).format(value);
};

// Format a value to a currency Brazilian format with currency symbol
export const formattedCurrencyWithSymbol = (value: number) => {
  // Using the Intl.NumberFormat API
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    style: "currency",
    currency: "BRL"
  }).format(value);
};