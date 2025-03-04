import { ComponentTypes, FormComponent } from "./component_types";
import { FloatInput, NumberInput, TextInput } from "./Input";
import { AppSelect } from "./Select";
import { AppSwitch } from "./Switch";

const FormComponents: {
  [key in ComponentTypes]: FormComponent;
} = {
  [ComponentTypes.TEXT]: TextInput,
  [ComponentTypes.NUMBER]: NumberInput,
  [ComponentTypes.FLOAT]: FloatInput,
  [ComponentTypes.SELECT]: AppSelect,
  [ComponentTypes.SWITCH]: AppSwitch,
};

export const getComponentByType = (type: ComponentTypes) => {
  return FormComponents[type];
};
