import { PropertyCalculatorTable } from "./PropertyCalculatorTable";
import { useState } from "react";
import { FormValue } from "./property_calc_types";
import { AppForm } from "../../components/form/AppForm";
import {
  ComponentTypes,
  Field,
} from "../../components/form/form_components/component_types";

const initialFormValue = {
  monthlyIncome: 15000,
  mortgageRate: 3.96,
  downPaymentPercentage: 20,
  amoritzation: 25,
};

export const PropertyCalculator = () => {
  const [formData, setFormData] = useState<FormValue>(initialFormValue);

  const formFields: Field<FormValue>[] = [
    {
      label: "Mortgage Rate",
      field: "mortgageRate",
      type: ComponentTypes.FLOAT,
    },
    {
      label: "Amoritzation",
      field: "amoritzation",
      type: ComponentTypes.NUMBER,
    },
    {
      label: "Down Payment Percentage",
      field: "downPaymentPercentage",
      type: ComponentTypes.NUMBER,
    },
    {
      label: "Monthly Income",
      field: "monthlyIncome",
      type: ComponentTypes.NUMBER,
    },
  ];

  return (
    <div className="flex flex-col w-full h-full p-4">
      <AppForm
        formData={formData}
        setFormData={setFormData}
        fields={formFields}
      />
      <PropertyCalculatorTable formData={formData} />
    </div>
  );
};
