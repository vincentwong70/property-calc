export enum ComponentTypes {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  FLOAT = "FLOAT",
  SELECT = "SELECT",
}

export type Field<T> = {
  label: string;
  field: keyof T;
  type: ComponentTypes;
};

export type FormComponent = (props: {
  label: string;
  field: string;
  value: string | number;
  setFieldValue: (field: string, val: string | number) => void;
}) => JSX.Element;
