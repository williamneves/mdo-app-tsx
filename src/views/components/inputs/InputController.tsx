import FormControl from "@mui/material/FormControl";
import {
  Controller,
  ControllerProps,
  FieldErrors,
  FieldError,
} from "react-hook-form";
import FormHelperText from "@mui/material/FormHelperText";

interface InputControllerProps extends ControllerProps{
  errors: FieldErrors;
}

export const InputController = (props: InputControllerProps) => {

  const {
    name,
    errors,
  } = props;

  // @ts-ignore
  return (
    <FormControl fullWidth>
      <Controller {...props} />
      {errors[name] && (
        <FormHelperText sx={{ color: "error.main" }} id={`${name}-text-input-form`}>
          {/* @ts-ignore */}
          {errors[name].message}
        </FormHelperText>
      )}
    </FormControl>
  );
};