import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FormComponent } from "./component_types";

export const AppSelect: FormComponent = ({
  label,
  field,
  value,
  setFieldValue,
  options,
}) => {
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={value}
        label={label}
        onChange={(event) =>
          setFieldValue(field, event.target.value as string | number)
        }
      >
        {options?.map(({ label, value }) => (
          <MenuItem key={label} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
