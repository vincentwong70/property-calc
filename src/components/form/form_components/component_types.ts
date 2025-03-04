export enum ComponentTypes {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  FLOAT = "FLOAT",
  SELECT = "SELECT",
  SWITCH = "SWITCH",
}

export type Field<T> = {
  label: string;
  field: keyof T;
  type: ComponentTypes;

  options?: SelectOption[];
};

export type SelectOption = {
  label: string;
  value: string | number;
};

export type FormComponent = (props: {
  label: string;
  field: string;
  value: string | number | boolean;
  setFieldValue: (field: string, val: string | number | boolean) => void;

  options?: SelectOption[];
}) => JSX.Element;
