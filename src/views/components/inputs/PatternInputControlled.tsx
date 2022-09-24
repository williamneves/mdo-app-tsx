import { PatternFormat, PatternFormatProps } from "react-number-format";
import InputAdornment from "@mui/material/InputAdornment";
import {
  TextField,
  OutlinedTextFieldProps
} from "@mui/material";
import { InputController } from "./InputController";
import { FieldErrors } from "react-hook-form";


const getThePattern = (type: string) => {
  switch (type) {
    case "cpf":
      return {
        mask: "_",
        format: "###.###.###-##",
        valueIsNumericString: true
      };
    case "cnpj":
      return {
        mask: "_",
        format: "##.###.###/####-##",
        valueIsNumericString: true
      };
    case "cep":
      return {
        mask: "_",
        format: "#####-###",
        valueIsNumericString: true
      };
    case "phone":
      return {
        mask: "_",
        format: "(##) #####-####",
        valueIsNumericString: true
      };
    default:
      return {
        mask: "_",
        format: "###.###.###-##",
        valueIsNumericString: true
      };
  }
};

// @ts-ignore
interface PatternInputControlledProps extends Omit<PatternFormatProps, "format">, OutlinedTextFieldProps {
  name: string;
  control: any;
  errors: FieldErrors;
  readOnly?: boolean;
  // Just pass a ReactNode to simple string to startAdornment and endAdornment
  startAdornment?: JSX.Element | string;
  endAdornment?: JSX.Element | string;
  patternType: "cpf" | "cnpj" | "cep" | "phone";
}

const CustomTextField = (props: any) => <TextField {...props} />;

const PatternInputControlled = (props: PatternInputControlledProps) => {

  const {
    name,
    control,
    errors,
    readOnly,
    startAdornment,
    endAdornment,
    patternType,
    ...rest
  } = props;

  const patternSetup = getThePattern(patternType);

  return (
    <InputController
      control={control}
      errors={errors}
      name={name}
      render={({ field: { onChange, name, value }, fieldState: { invalid } }) => (
        <PatternFormat
          onValueChange={({ value }) => onChange(value)}
          value={value}
          name={name}
          error={invalid}
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
          {...rest}
          {...patternSetup}
          customInput={CustomTextField}
        />
      )}
    />
  );
};

PatternInputControlled.defaultProps = {
  variant: "outlined"
};

export default PatternInputControlled;