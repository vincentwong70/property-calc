import { Property, properties } from "../../configs/properties";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FC, useMemo } from "react";
import {
  calculateGst,
  calculatePropertyTransferTax,
  formatCurrency,
  getMonthlyStrataFees,
  getMortgagePayment,
  getPricePerSqft,
} from "./property_calc_util";
import { FormValue } from "./property_calc_types";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type RowData = {
  type: Property["type"];
  parking_cost: number;
  strata_cost: Property["strata_cost"];
  name: string;
  price: number;
  interior_sqft: Property["interior_sqft"];
  exterior_sqft: Property["exterior_sqft"];
  price_per_sqft: string;
  gst: number;
  transfer_tax: number;
  total_cost: number;
  down_payment: number;
  mortgage_payment: number;
  total_monthly_fees: number;
  monthly_income: FormValue["monthlyIncome"];
} & {
  [key: string]: any;
};

type PropertyColumn = {
  id: string;
  label: string;
  render?: (data: RowData) => JSX.Element | number | string | null;
};

const initial_columns: PropertyColumn[] = [
  {
    id: "type",
    label: "Type",
  },
  {
    id: "interior_sqft",
    label: "Sqft",
  },
  {
    id: "price_per_sqft",
    label: "Price/Sqft",
    render: (data) => {
      if (data.interior_sqft) {
        return formatCurrency(data.price / data.interior_sqft);
      }

      return null;
    },
  },
  {
    id: "price",
    label: "Price",
    render: (data) => {
      return formatCurrency(data.price);
    },
  },
  {
    id: "transfer_tax",
    label: "Property Transfer Tax",
    render: (data) => {
      return formatCurrency(data.transfer_tax);
    },
  },
  {
    id: "gst",
    label: "GST",
    render: (data) => {
      return formatCurrency(data.gst);
    },
  },
  {
    id: "down_payment",
    label: "Down Payment",
    render: (data) => {
      return formatCurrency(data.down_payment);
    },
  },
  {
    id: "parking_cost",
    label: "Parking Cost",
    render: (data) => {
      return formatCurrency(data.parking_cost);
    },
  },
  {
    id: "total_cost",
    label: "Total Cost",
    render: (data) => {
      return <strong>{formatCurrency(data.total_cost)}</strong>;
    },
  },
];

const monthly_payment_columns: PropertyColumn[] = [
  {
    id: "strata_fees",
    label: "Strata Fees",
    render: (data) => {
      if (!data.strata_cost) {
        return "N/A";
      }

      return (
        <div>{`${Number(data.monthly_strata_fee).toFixed(1)} (${
          data.strata_cost
        } $/sqft)`}</div>
      );
    },
  },
  {
    id: "mortgage_payment",
    label: "Monthly Mortgage Payment",
    render: (data) => {
      return formatCurrency(data.mortgage_payment);
    },
  },
  {
    id: "total_monthly_fees",
    label: "Total Monthly Fees",
    render: (data) => {
      return <strong>{formatCurrency(data.total_monthly_fees)}</strong>;
    },
  },
  {
    id: "percentage_monthly_income",
    label: "Percentage of Monthly Income",
    render: (data) => {
      if (data.monthly_income > 0) {
        const percentage =
          (data.total_monthly_fees / data.monthly_income) * 100;
        return `${percentage.toFixed(0)} %`;
      }

      return "N/A";
    },
  },
];

const createEntry = (property: Property, formData: FormValue) => {
  const price = property.price as number;
  const sqft = property.interior_sqft as number;
  const parking_cost = property.parking_cost
    ? property.parking_cost + calculateGst(property.parking_cost)
    : 0;
  const gst = property.is_new ? calculateGst(price) : 0;
  const transfer_tax = calculatePropertyTransferTax(price);
  const total_cost = price + gst + transfer_tax + parking_cost;
  const down_payment = total_cost * (formData.downPaymentPercentage / 100);
  const mortgage_payment = getMortgagePayment(
    total_cost,
    down_payment,
    formData.mortgageRate,
    formData.amoritzation
  );

  const monthly_strata_fee = getMonthlyStrataFees(
    property.interior_sqft,
    property.strata_cost
  );

  const entry: RowData = {
    name: property.name,
    type: property.type,
    parking_cost,
    strata_cost: property.strata_cost,
    price: property.price as number,
    interior_sqft: property.interior_sqft,
    exterior_sqft: property.exterior_sqft,
    gst,

    price_per_sqft: getPricePerSqft(price, sqft),
    monthly_strata_fee,
    transfer_tax,
    total_cost,
    down_payment,
    mortgage_payment,
    total_monthly_fees: mortgage_payment + monthly_strata_fee,

    monthly_income: formData.monthlyIncome,
  };

  return entry;
};

export const PropertyCalculatorTable: FC<{
  formData: FormValue;
}> = ({ formData }) => {
  const data = useMemo(() => {
    const entries: RowData[] = [];

    for (const property of properties) {
      if (Array.isArray(property.plans)) {
        for (const plan of property.plans) {
          entries.push(
            createEntry(
              {
                ...property,
                ...plan,
                name: `${property.name} (${plan.name})`,
              },
              formData
            )
          );
        }
      } else {
        entries.push(
          createEntry(
            {
              ...property,
            },
            formData
          )
        );
      }
    }

    return entries;
  }, [formData]);

  const renderColumns = (columns: PropertyColumn[]) => {
    return columns.map((column) => {
      return (
        <StyledTableRow key={column.id}>
          <StyledTableCell component="th" scope="row">
            <div className="font-semibold">{column.label}</div>
          </StyledTableCell>

          {data.map((entry) => {
            return (
              <StyledTableCell align="left" key={`${column.id}__${entry.name}`}>
                {typeof column.render === "function" ? (
                  column.render(entry)
                ) : (
                  <>{entry?.[column.id]}</>
                )}
              </StyledTableCell>
            );
          })}
        </StyledTableRow>
      );
    });
  };

  const renderEmptyRow = (number: number) => {
    const rows: JSX.Element[] = [];

    if (number <= 0) {
      return null;
    }

    for (let i = 0; i < number; i += 1) {
      const row = (
        <StyledTableRow key={`row_${i}`}>
          <StyledTableCell component="th" scope="row">
            {""}
          </StyledTableCell>

          {data.map((entry, idx) => {
            return (
              <StyledTableCell
                align="left"
                key={`${entry.name}_${i}__${idx}`}
              ></StyledTableCell>
            );
          })}
        </StyledTableRow>
      );

      rows.push(row);
    }

    return rows;
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Statistic</StyledTableCell>

            {data.map((entry) => {
              return (
                <StyledTableCell key={entry.name} align="left">
                  {entry.name}
                </StyledTableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {renderColumns(initial_columns)}
          {renderEmptyRow(1)}
          {renderColumns(monthly_payment_columns)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
