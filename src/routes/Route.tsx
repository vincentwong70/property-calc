import { Routes, Route } from "react-router-dom";
import { PropertyCalculator } from "../pages/PropertyCalculator/PropertyCalculator";

export enum PATHS {
  MONTHLY_EXPENSE = "/calculator/monthly-expense",
  PROPERTY_CALC = "/calculator/property",
}

export const page_routes = [
  {
    label: "Monthly Expense Calculator",
    path: PATHS.MONTHLY_EXPENSE,
    Component: () => {
      return <div>expense</div>;
    },
  },
  {
    label: "Property Comparison",
    path: PATHS.PROPERTY_CALC,
    Component: PropertyCalculator,
  },
];

export const AppRoutes = () => {
  return (
    <Routes>
      {page_routes.map(({ path, Component }) => {
        return <Route key={path} path={path} element={<Component />} />;
      })}
    </Routes>
  );
};
