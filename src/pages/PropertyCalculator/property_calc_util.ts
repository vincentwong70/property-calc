export const getPricePerSqft = (price: number, sqft: number) => {
  return Number(price / sqft).toFixed(2);
};

export const calculateGst = (value: number) => {
  return value * 0.05;
};

export const calculatePropertyTransferTax = (value: number) => {
  return value * 0.02;
};

export const formatCurrency = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  }).format(price);
};

export const getMortgagePayment = (
  totalPrice: number,
  downPayment: number,
  annualInterestRate: number,
  years: number
) => {
  const principal = totalPrice - downPayment;

  // Convert annual interest rate to a monthly interest rate
  const monthlyInterestRate = annualInterestRate / 12 / 100;

  // Calculate the total number of payments (months)
  const totalPayments = years * 12;

  // Calculate the mortgage payment using the formula
  const mortgagePayment =
    (principal *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, totalPayments))) /
    (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

  return mortgagePayment;
};
