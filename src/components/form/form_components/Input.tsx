import { TextField } from "@mui/material";
import { FormComponent } from "./component_types";
import { isFunction } from "lodash";

const createInputComponent =
  (
    type: string,
    convertFn?: (val: string | number) => string | number
  ): FormComponent =>
  ({ field, label, value, setFieldValue }) => {
    return (
      <TextField
        key={field}
        label={label}
        name={field}
        type={type}
        value={value}
        onChange={(e) => {
          const { value } = e.target;
          const _value = isFunction(convertFn) ? convertFn(value) : value;
          setFieldValue(field, _value);
        }}
      />
    );
  };

export const TextInput: FormComponent = createInputComponent("text");

export const NumberInput: FormComponent = createInputComponent(
  "number",
  (val) => parseInt(`${val}`)
);

export const FloatInput: FormComponent = createInputComponent("number", (val) =>
  parseFloat(`${val}`)
);
