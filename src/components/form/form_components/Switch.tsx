import { FormControlLabel, Switch } from "@mui/material";
import { FormComponent } from "./component_types";

export const AppSwitch: FormComponent = ({
  label,
  value,
  field,
  setFieldValue,
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={value as boolean}
          onChange={(event) => setFieldValue(field, event?.target.checked)}
          inputProps={{ "aria-label": "controlled" }}
        />
      }
      label={label}
    />
  );
};
