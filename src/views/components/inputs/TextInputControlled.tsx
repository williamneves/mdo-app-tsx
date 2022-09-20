import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";

interface TextInputProps {
  name: string
  control: object
  label: string
  placeholder?: string
  errors: any
  // Just pass a ReactNode to simple string to startAdornment and endAdornment
  startAdornment?: JSX.Element | string
  endAdornment?: JSX.Element | string
  // Add any other props you want to pass to the input
  otherProps?: object
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
    otherProps
  } = props;

  // @ts-ignore
  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        // @ts-ignore
        control={control}
        render={({ field: { value, onChange }, fieldState: { invalid } }) => (
          <TextField
            value={value}
            label={label}
            onChange={onChange}
            placeholder={placeholder || label}
            error={invalid}
            aria-describedby={`${name}-text-input-form`}
            InputProps={{
              startAdornment: (
                startAdornment &&
                <InputAdornment position="start">
                  {startAdornment}
                </InputAdornment>
              ),
              endAdornment: (
                startAdornment &&
                <InputAdornment position="end">
                  {endAdornment}
                </InputAdornment>
              )
            }}
            {...otherProps}
          />
        )}
      />
      {errors[name] && (
        <FormHelperText sx={{ color: "error.main" }} id={`${name}-text-input-form`}>
          {errors[name].message}
        </FormHelperText>
      )}
    </FormControl>
  );
};