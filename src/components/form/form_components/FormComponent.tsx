import { ComponentTypes, FormComponent } from "./component_types";
import { FloatInput, NumberInput, TextInput } from "./Input";

const FormComponents: {
  [key in ComponentTypes]: FormComponent;
} = {
  [ComponentTypes.TEXT]: TextInput,
  [ComponentTypes.NUMBER]: NumberInput,
  [ComponentTypes.FLOAT]: FloatInput,
  [ComponentTypes.SELECT]: () => {
    return <div>test</div>;
  },
};

export const getComponentByType = (type: ComponentTypes) => {
  return FormComponents[type];
};
