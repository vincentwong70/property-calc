import { TextField } from "@mui/material";
import { PropertyCalculatorTable } from "./PropertyCalculatorTable";
import { useState } from "react";
import { FormValue } from "./property_calc_types";

const initialFormValue = {
  monthlyIncome: 14400,
  mortgageRate: 4.49,
  downPaymentPercentage: 20,
  amoritzation: 25,
};

export const PropertyCalculator = () => {
  const [formData, setFormData] = useState<FormValue>(initialFormValue);

  const setFormDataAttr = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formFields: {
    label: string;
    field: keyof FormValue;
  }[] = [
    {
      label: "Mortgage Rate",
      field: "mortgageRate",
    },
    {
      label: "Amoritzation",
      field: "amoritzation",
    },
    {
      label: "Down Payment Percentage",
      field: "downPaymentPercentage",
    },
    {
      label: "Monthly Income",
      field: "monthlyIncome",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className={"flex flex-col gap-4 p-4"}>
        {formFields.map((config) => {
          return (
            <TextField
              key={config.field}
              label={config.label}
              type="number"
              name={config.field}
              value={formData[config.field]}
              onChange={setFormDataAttr}
            />
          );
        })}
      </div>

      <PropertyCalculatorTable formData={formData} />
    </div>
  );
};
