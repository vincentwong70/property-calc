import { useRef, useState } from "react";
import { Property, properties } from "../../configs/properties";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
  Button,
  Drawer,
} from "@mui/material";

import { FC, useMemo } from "react";
import {
  calculateGst,
  calculatePropertyTransferTax,
  formatCurrency,
  getMortgagePayment,
  getPricePerSqft,
} from "./property_calc_util";
import { FormValue } from "./property_calc_types";

import { AddProperty, AddPropertyFormData } from "./AddProperty";
import { isNil } from "lodash";
import { useStoreProperties } from "./property_calc_hooks";
import { useSnackbar } from "../../providers/NotifyProvider";

const ToolbarButton = styled(Button)({
  backgroundColor: "black",
  color: "white",
  marginLeft: "0.25rem",
  marginRight: "0.25rem",
  "&:hover": {
    backgroundColor: "gray",
  },
});

const StyledToolbar = styled(Toolbar)({
  backgroundColor: "white",
  border: "1px solid black",
  color: "black",
});

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
  link?: Property["link"];
  is_default: Property["is_default"];
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

      const formattedMonthlyPayment = formatCurrency(data.strata_cost);
      let strataPricePerSqft;

      if (!isNil(data.interior_sqft) && data.interior_sqft > 0) {
        strataPricePerSqft = Number(
          data.strata_cost / data.interior_sqft
        ).toFixed(2);
      }

      return !isNil(strataPricePerSqft)
        ? `${formattedMonthlyPayment} (${strataPricePerSqft} $/sqft)`
        : formattedMonthlyPayment;
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

  const monthly_strata_fees = property.strata_cost ?? 0;

  const entry: RowData = {
    name: property.name,
    link: property?.link,
    type: property.type,
    is_default: property.is_default ?? false,
    parking_cost,
    strata_cost: monthly_strata_fees,
    price: property.price as number,
    interior_sqft: property.interior_sqft,
    exterior_sqft: property.exterior_sqft,
    gst,

    price_per_sqft: getPricePerSqft(price, sqft),
    transfer_tax,
    total_cost,
    down_payment,
    mortgage_payment,
    total_monthly_fees: mortgage_payment + monthly_strata_fees,

    monthly_income: formData.monthlyIncome,
  };

  return entry;
};

export const PropertyCalculatorTable: FC<{
  formData: FormValue;
}> = ({ formData }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { userProperties, setUserProperties, saveProperties } =
    useStoreProperties();
  const propertyDataRef = useRef<undefined | AddPropertyFormData>(undefined);

  const { showSnackbar } = useSnackbar();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const data = useMemo(() => {
    const entries: RowData[] = [];
    const allProperties = [...properties, ...userProperties];

    for (const property of allProperties) {
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
  }, [formData, userProperties]);

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
      <StyledToolbar>
        <ToolbarButton
          variant="contained"
          onClick={() => {
            propertyDataRef.current = undefined;
            setDrawerOpen(true);
          }}
        >
          Add Property
        </ToolbarButton>

        <ToolbarButton
          variant="contained"
          onClick={() => {
            saveProperties();
            showSnackbar("Properties have been saved.", "success");
          }}
        >
          <div className="flex items-center">
            <SaveIcon className="mr-2" />
            <span>Save Properties</span>
          </div>
        </ToolbarButton>
      </StyledToolbar>

      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Statistic</StyledTableCell>

            {data.map((entry) => {
              return (
                <StyledTableCell
                  key={entry.name}
                  align="left"
                  sx={{
                    color: "blue",
                  }}
                >
                  <div className="flex items-center space-between">
                    {entry?.link && (
                      <a href={entry.link} target="_blank" className="mr-2">
                        <LinkIcon />
                      </a>
                    )}

                    <span className="mr-2">{entry.name}</span>

                    {!entry.is_default && (
                      <>
                        <EditIcon
                          className="cursor-pointer mr-2"
                          onClick={() => {
                            propertyDataRef.current = entry;
                            setDrawerOpen(true);
                          }}
                        />

                        <DeleteIcon
                          className="cursor-pointer mr-2"
                          onClick={() => {
                            setUserProperties((prev) => {
                              return prev.filter(
                                (property) => property.name !== entry.name
                              );
                            });
                          }}
                        />
                      </>
                    )}
                  </div>
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

      <Drawer
        anchor="right"
        sx={{
          "& .MuiDrawer-paper .Mui": { width: "90vw" },
        }}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <AddProperty
          data={propertyDataRef.current}
          onSubmit={(formData, isEdit) => {
            if (formData.name && !isEdit) {
              setUserProperties((prev) => [...prev, formData]);
            } else if (formData.name && isEdit) {
              setUserProperties((prev) => {
                const prevEntries = prev.filter(
                  (properties) => properties.name !== formData.name
                );
                return [...prevEntries, formData];
              });
            }

            toggleDrawer(false)();
          }}
          onClose={toggleDrawer(false)}
        />
      </Drawer>
    </TableContainer>
  );
};
