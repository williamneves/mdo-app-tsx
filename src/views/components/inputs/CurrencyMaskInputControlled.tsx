import { NumericFormat, NumericFormatProps } from "react-number-format"
import InputAdornment from "@mui/material/InputAdornment"
import {
  TextField,
  TextFieldProps,
  StandardTextFieldProps,
  FilledTextFieldProps,
  OutlinedTextFieldProps
} from "@mui/material"
import { InputController } from "./InputController"
import { FieldErrors } from "react-hook-form"

const numericSetup = {
  thousandSeparator: ".",
  allowNegative: false,
  allowedDecimalSeparators: ["%", ",", "/", " ", "-", "."],
  decimalScale: 2,
  decimalSeparator: ","
}

// @ts-ignore
interface CurrencyMaskInputControlledProps
  extends NumericFormatProps,
    OutlinedTextFieldProps {
  name: string
  control: any
  errors: FieldErrors
  readOnly?: boolean
  // Just pass a ReactNode to simple string to startAdornment and endAdornment
  startAdornment?: JSX.Element | string
  endAdornment?: JSX.Element | string
}

const CustomTextField = (props: any) => <TextField {...props} />

const CurrencyMaskInputControlled = (
  props: CurrencyMaskInputControlledProps
) => {
  const {
    name,
    control,
    errors,
    readOnly,
    startAdornment,
    endAdornment,
    ...rest
  } = props

  return (
    <InputController
      control={control}
      errors={errors}
      name={name}
      render={({
        field: { onChange, name, value },
        fieldState: { invalid }
      }) => (
        <NumericFormat
          {...numericSetup}
          onValueChange={({ floatValue }) => onChange(floatValue)}
          value={value}
          name={name}
          error={invalid}
          InputProps={{
            readOnly: readOnly || props.InputProps?.readOnly,
            startAdornment: startAdornment ? (
              <InputAdornment position='start'>{startAdornment}</InputAdornment>
            ) : (
              props.InputProps?.startAdornment
            ),
            endAdornment: startAdornment ? (
              <InputAdornment position='end'>{endAdornment}</InputAdornment>
            ) : (
              props.InputProps?.endAdornment
            )
          }}
          {...rest}
          customInput={CustomTextField}
        />
      )}
    />
  )
}

CurrencyMaskInputControlled.defaultProps = {
  variant: "outlined"
}

export default CurrencyMaskInputControlled
