import FormHelperText from "@mui/material/FormHelperText";
import { InputController } from "./InputController";
import {
  FieldErrors
} from "react-hook-form";

import { TextField } from "@mui/material";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { MobileDatePicker } from "@mui/lab/";
import ptBR from "date-fns/locale/pt-BR";
import { Locale } from "date-fns";

const LangObj: { [key: string]: Locale } = { ptBR };

interface DatePickerProps {
  name: string;
  control: any;
  label: string;
  errors: FieldErrors;
  errorField?: string;
}

const DatePickerInputControlled = (props: DatePickerProps) => {

  const {
    name,
    control,
    errors,
    label,
    errorField,
    ...rest
  } = props;

  return (
    // @ts-ignore
    <InputController
      name={name}
      control={control}
      errors={errors}
      errorField={errorField}
      render={({ field: { value, onChange }, fieldState: { invalid, error } }) => (
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          locale={LangObj["ptBR"]}
        >
          <MobileDatePicker
            {...rest}
            label={label}
            value={value}
            onChange={onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                error={invalid}
              />
            )}
          />
          {
            error &&
            <FormHelperText sx={{ color: "error.main" }} id={`${name}-text-input-form`}>
              {
                error.message ||
                Object.keys(error).map((key: string) => {
                  // @ts-ignore
                  return error[key].message;
                })[0]
              }
            </FormHelperText>
          }
        </LocalizationProvider>
      )}
    />
  );
};

export default DatePickerInputControlled;