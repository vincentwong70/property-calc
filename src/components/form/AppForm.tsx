import { isFunction } from "lodash";
import { Field } from "./form_components/component_types";
import { getComponentByType } from "./form_components/FormComponent";
import { Button } from "@mui/material";

type AppFormProps<T> = {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  fields: Field<T>[];
  onSubmit?: (formData: T) => void;
};

export const AppForm = <T,>(props: AppFormProps<T>) => {
  const { formData, setFormData, fields, onSubmit } = props;

  const setFormDataAttr = (name: string, value: string | number | boolean) => {
    setFormData((prev: T) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={"flex flex-col gap-4 p-4"}>
      {fields.map(({ label, field, type, options }) => {
        const Component = getComponentByType(type);

        return (
          <Component
            key={field as string}
            label={label}
            field={field as string}
            value={formData[field] as string | number}
            setFieldValue={setFormDataAttr}
            // Select
            options={options}
          />
        );
      })}

      {isFunction(onSubmit) && (
        <div className="w-full items-center flex justify-center">
          <Button variant={"outlined"} onClick={() => onSubmit(formData)}>
            {"Submit"}
          </Button>
        </div>
      )}
    </div>
  );
};
