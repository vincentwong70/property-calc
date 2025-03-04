import { Box, IconButton, Typography } from "@mui/material";
import { FC, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { AppForm } from "../../components/form/AppForm";
import {
  ComponentTypes,
  Field,
} from "../../components/form/form_components/component_types";
import { Property, PropertyType } from "../../configs/properties";

type AddPropertyFormData = Property;

const initialFormData: AddPropertyFormData = {
  name: "",
  type: PropertyType.DUPLEX,
  price: 0,
  interior_sqft: 0,
  exterior_sqft: 0,
  is_new: false,
  parking_cost: 0,
  strata_cost: 0,
};

export const AddProperty: FC<{
  onSubmit: (formValues: AddPropertyFormData) => void;
  onClose: () => void;
}> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] =
    useState<AddPropertyFormData>(initialFormData);

  const fields: Field<AddPropertyFormData>[] = [
    {
      label: "Name",
      field: "name",
      type: ComponentTypes.TEXT,
    },
    {
      label: "House Type",
      field: "type",
      type: ComponentTypes.SELECT,
      options: [
        {
          label: "Townhouse",
          value: PropertyType.TOWNHOUSE,
        },
        {
          label: "Duplex",
          value: PropertyType.DUPLEX,
        },
      ],
    },
    {
      label: "Interior Sqft",
      field: "interior_sqft",
      type: ComponentTypes.NUMBER,
    },
    {
      label: "Exterior Sqft",
      field: "exterior_sqft",
      type: ComponentTypes.NUMBER,
    },
    {
      label: "Price",
      field: "price",
      type: ComponentTypes.NUMBER,
    },
    {
      label: "Strata Cost",
      field: "strata_cost",
      type: ComponentTypes.NUMBER,
    },
    {
      label: "Parking Cost",
      field: "parking_cost",
      type: ComponentTypes.NUMBER,
    },
    {
      label: "Should Apply GST",
      field: "is_new",
      type: ComponentTypes.SWITCH,
    },
  ];

  return (
    <Box sx={{ width: "40vw", p: 2 }} role="presentation">
      <div className={"flex items-center justify-between"}>
        <Typography variant={"h5"}>Add Property</Typography>
        <IconButton
          onClick={() => {
            onClose();
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </div>

      <AppForm
        formData={formData}
        fields={fields}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </Box>
  );
};
