// Format a value to a currency Brazilian format
export const formattedCurrency = (value: number) => {
  // Using the Intl.NumberFormat API
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2
  }).format(value);
};