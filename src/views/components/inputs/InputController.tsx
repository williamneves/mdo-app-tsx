import FormControl from "@mui/material/FormControl";
import {
  Controller,
  ControllerProps,
} from "react-hook-form";

interface InputControllerProps extends ControllerProps{
  errors: any;
}

const defaultProps: any = {
  name: "controlledInputText",
  errors: {
    controlledInputText: {
      message: "Error message"
    }
  }
};

export const InputController = (props: InputControllerProps) => {

  const {
    name,
    errors,
    ...rest
  } = props;

  // @ts-ignore
  return (
    <FormControl fullWidth>
      <Controller name={name} {...rest} />
    </FormControl>
  );
};

InputController.defaultProps = defaultProps;