import { Field } from "./form_components/component_types";
import { getComponentByType } from "./form_components/FormComponent";

type AppFormProps<T> = {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  fields: Field<T>[];
};

export const AppForm = <T,>(props: AppFormProps<T>) => {
  const { formData, setFormData, fields } = props;

  const setFormDataAttr = (name: string, value: string | number) => {
    setFormData((prev: T) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={"flex flex-col gap-4 p-4"}>
      {fields.map(({ label, field, type }) => {
        const Component = getComponentByType(type);

        return (
          <Component
            key={field as string}
            label={label}
            field={field as string}
            value={formData[field] as string | number}
            setFieldValue={setFormDataAttr}
          />
        );
      })}
    </div>
  );
};
