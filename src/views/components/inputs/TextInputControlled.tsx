import { OutlinedTextFieldProps, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { FieldErrors } from "react-hook-form";

import { InputController } from "./InputController";

interface TextInputProps extends OutlinedTextFieldProps {
  name: string
  control: any
  label: string
  placeholder?: string
  errors: FieldErrors
  readOnly?: boolean
  // Just pass a ReactNode to simple string to startAdornment and endAdornment
  startAdornment?: JSX.Element | string
  endAdornment?: JSX.Element | string
  // Add any other props you want to pass to the input
}

export const TextInputControlled = (props: TextInputProps) => {

  const {
    name,
    control,
    label,
    placeholder,
    errors,
    startAdornment,
    endAdornment,
    variant,
    readOnly
  } = props;

  return (
    // @ts-ignore
      <InputController
        name={name}
        control={control}
        errors={errors}
        render={({ field: { value, onChange }, fieldState: { invalid } }) => (
          <TextField
            {...props}
            variant={variant}
            value={value}
            onChange={onChange}
            placeholder={placeholder || label}
            error={invalid}
            aria-describedby={`${name}-text-input-form`}
            InputProps={{
              readOnly: readOnly || props.InputProps?.readOnly,
              startAdornment: (
                startAdornment ?
                <InputAdornment position="start">
                  {startAdornment}
                </InputAdornment>
                : props.InputProps?.startAdornment
              ),
              endAdornment: (
                startAdornment ?
                <InputAdornment position="end">
                  {endAdornment}
                </InputAdornment>
                : props.InputProps?.endAdornment
              )
            }}
          />
        )}
      />
  );
};

TextInputControlled.defaultProps = {
  variant: "outlined",
}

export default TextInputControlled;